/**
 * @fileoverview Povides the main app logic for NFC STB interface. The app
 * consists of a timer and logic to be executed on each tick. Once the tick
 * occurs the app is querying a remote server for data and after processing
 * it might adjust the tick duration and restart it. The data changes are
 * observed via events and updates are applied to the UI.
 *
 * Intrinsically the FB and G+ APIs are queries for data for user name and
 * user picture to be aplied on the UI as well.
 *
 * @author regardingscot@gmail.com (PeterStJ)
 */

goog.provide('nfc.control.Main');

goog.require('goog.Promise');
goog.require('goog.Timer');
goog.require('goog.labs.net.image');
goog.require('nfc.gen.dto.NFCPlaceUpdate');
goog.require('nfc.ng.filter');
goog.require('nfc.vendor.Facebook');
goog.require('nfc.vendor.Google');
goog.require('pstj.control.Control');
goog.require('pstj.ds.DtoBase');


/** Implements the main app logic */
nfc.control.Main = goog.defineClass(pstj.control.Control, {
  /**
   * @constructor
   * @extends {pstj.control.Control}
   * @param {!string} acctid The account id of the location.
   * @param {!string} updateurl The URL to query for updates.
   */
  constructor: function(acctid, updateurl) {
    pstj.control.Control.call(this);
    /**
     * @type {!string}
     * @protected
     */
    this.updateUrl = (updateurl + acctid);
    /**
     * The timeout in milliseconds.
     * @type {!number}
     * @private
     */
    this.timeout_ = nfc.control.Main.DEFAULT_TIMEOUT;
    /**
     * The FB query abstraction.
     * @type {!nfc.vendor.Facebook}
     * @private
     */
    this.fc_ = new nfc.vendor.Facebook();
    /**
     * The G+ query abstraction.
     * @type {!nfc.vendor.Google}
     * @private
     */
    this.gp_ = new nfc.vendor.Google();
    /**
     * The data structure to use.
     * @type {!nfc.gen.dto.NFCPlaceUpdate}
     * @private
     */
    this.data_ = new nfc.gen.dto.NFCPlaceUpdate();
    /**
     * The actual data to use. Note that we copy the data over this one
     * once we have all the details.
     * @type {!nfc.gen.dto.NFCPlaceUpdate}
     * @private
     */
    this.storage_ = new nfc.gen.dto.NFCPlaceUpdate();
    /**
     * The timer to execute the code on intervals.
     * @type {!goog.Timer}
     * @private
     */
    this.timer_ = new goog.Timer(this.timeout_);
    /**
     * Use some cache to avoid unnessesary queries to third parties.
     * @type {!Array<!string>}
     * @private
     */
    this.cache_ = ['', ''];
    /**
     * Callback to execute when update occurs and all data is collected.
     * @type {?function(!nfc.gen.dto.NFCPlaceUpdate): void}
     * @private
     */
    this.onUpdateCallback_ = null;

    this.registerDisposable(this.timer_);
    this.registerDisposable(this.data_);
    this.init();
  },

  /** @override */
  init: function() {
    goog.base(this, 'init');
    this.getHandler().listen(this.data_, pstj.ds.DtoBase.EventType.CHANGE,
        this.onDataChange);
    this.getHandler().listen(this.timer_, goog.Timer.TICK, this.onTick);
    this.update();
    this.timer_.start();
  },

  /**
   * Handles the tick event from the timer (i.e. when it is time to update the
   * data from the server).
   * @param {goog.events.Event} e
   * @protected
   */
  onTick: function(e) {
    this.update();
  },

  /**
   * Sets the callback function to be executed when update occurs.
   * @param {?function(!nfc.gen.dto.NFCPlaceUpdate): void} cb
   */
  setUpdateCallback: function(cb) {
    this.onUpdateCallback_ = cb;
  },

  /**
   * Triggers server update.
   * @protected
   */
  update: function() {
    goog.labs.net.xhr.getJson(this.updateUrl)
        .then(this.onUpdateReceived, null, this);
  },

  /**
   * Receives the update from the server.
   * @param {Object} update
   * @protected
   */
  onUpdateReceived: function(update) {
    if (goog.isObject(update)) {
      this.data_.fromJSON(update);
    }
  },

  /**
   * Executed when the DTO object changes (i.e. we received new data from
   * server).
   * @param {goog.events.Event} e
   * @protected
   */
  onDataChange: function(e) {
    if (this.data_.refreshInterval * 1000 != this.timeout_) {
      this.timeout_ = this.data_.refreshInterval * 1000;
      this.timer_.setInterval(this.timeout_);
    }
    if (this.updateCache()) {
      this.getNewUser().then(this.onCacheUpdated, null, this);
    } else {
      this.data_.username = this.storage_.username;
      this.data_.usericonurl = this.storage_.usericonurl;
      this.storage_.fromJSON(/** @type {Object<string, *>} */(
          this.data_.toJSON()));
      this.onUpdateCallback_(this.storage_);
    }
  },

  /**
   * Do the actual update by calling the registered callback.
   * @param {!Array<!string>} userinfo
   * @protected
   */
  onCacheUpdated: function(userinfo) {
    if (!goog.isNull(this.onUpdateCallback_)) {
      this.data_.username = userinfo[0];
      this.data_.usericonurl = userinfo[1];
      this.storage_.fromJSON(/** @type {Object<string, *>} */(
          this.data_.toJSON()));
      this.onUpdateCallback_(this.storage_);
    }
  },

  /**
   * Retrieves the user name and the url of the image, then loads the image
   * and then resolves the promise so we are sure to have everything loaded
   * for the update to be smooth.
   * @protected
   * @return {goog.Promise<!Array<!string>>}
   */
  getNewUser: function() {
    var vendor = null;
    switch (this.data_.userAuthProvider) {
      case nfc.control.Main.USER_TYPE.GOOGLE:
        vendor = this.gp_;
        break;
      case nfc.control.Main.USER_TYPE.FACEBOOK:
        vendor = this.fc_;
        break;
      default:
        throw new Error('Unrecognized auth vendor: ' +
            this.data_.userAuthProvider);
    }
    return goog.Promise.all([
      vendor.getUserNameByUserId(this.data_.userID),
      vendor.getPictureUrlByUserId(this.data_.userID)])
        .then(function(result) {
          return new goog.Promise(function(resolve, reject) {
            goog.labs.net.image.load(result[1]).then(function(img) {
              resolve(result);
            });
          });
        });
  },

  /**
   * Checks if the cache needs updating and if it was updates returns true, else
   * the user seem to be the same and we do not need to update.
   * @return {boolean}
   * @protected
   */
  updateCache: function() {
    if (this.data_.userID != this.cache_[0] ||
        this.data_.userAuthProvider != this.cache_[1]) {
      this.cache_[0] = this.data_.userID;
      this.cache_[1] = this.data_.userAuthProvider;
      return true;
    } else {
      return false;
    }
  },

  statics: {
    /**
     * The default time between updates.
     * @const {!number}
     * @protected
     */
    DEFAULT_TIMEOUT: (5 * 60 * 1000),
    /**
     * Defines the user types we know how to handle.
     * @enum {!string}
     * @protected
     */
    USER_TYPE: {
      GOOGLE: 'google',
      FACEBOOK: 'facebook'
    }
  }
});
