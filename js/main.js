goog.provide('app.Main');

goog.require('goog.Uri');
goog.require('goog.asserts');
goog.require('goog.dom');
goog.require('nfc.control.Main');
goog.require('pstj.configure');
goog.require('pstj.ds.ngmodel');


/**
 * Provides app specific integration with the HTML.
 */
app.Main = goog.defineClass(null, {
  constructor: function() {
    /**
     * @type {!string}
     * @private
     */
    this.baseurl_ = goog.asserts.assertString(
        pstj.configure.getRuntimeValue('BASE_URL',
            'assets/exampledata.json', '__NFC.CONFIG'));
    /**
     * @type {!string}
     * @private
     */
    this.acctid_ = app.Main.obtainAccountId();
    /**
     * @type {!string}
     * @private
     */
    this.location_ = app.Main.obtainLocationId();
    /**
     * The controller that handles the update of data.
     * @type {!nfc.control.Main}
     * @private
     */
    this.ctrl_ = new nfc.control.Main(this.baseurl_ + this.acctid_ +
        (this.location_ != '' ? ('&locationid=' + this.location_) : ''));
    /**
     * The root element of the bindings.
     * @type {Element}
     * @private
     */
    this.rootElement_ = null;
    this.init();
  },

  /**
   * Initialize functionality.
   * @protected
   */
  init: function() {
    this.rootElement_ = goog.asserts.assertElement(document.body);
    pstj.ds.ngmodel.bindElement(this.rootElement_);
    this.ctrl_.setUpdateCallback(goog.bind(this.paint, this));
  },

  /**
   * Repaints the UI based on the new data.
   * @param {!nfc.gen.dto.NFCPlaceUpdate} data
   * @protected
   */
  paint: function(data) {
    pstj.ds.ngmodel.updateElement(this.rootElement_, data);
  },

  statics: {
    /**
     * Attempts to obtain the account ID for the buziness to query for.
     * @return {!string}
     */
    obtainAccountId: function() {
      var acctid = goog.global['__acctid'];
      if (goog.isDef(acctid)) {
        return goog.asserts.assertString(acctid.toString());
      } else {
        var uri = new goog.Uri(window.location.href);
        acctid = uri.getParameterValue('acctid');
        if (goog.isDef(acctid)) {
          return goog.asserts.assertString(acctid.toString());
        } else {
          throw new Error('Cannot determine account ID for business');
        }
      }
    },

    /**
     * Retrieves the location id of the business.
     * @return {!string}
     */
    obtainLocationId: function() {
      var locationid = goog.global['__locationid'];
      if (goog.isDef(locationid)) return goog.asserts.assertString(locationid);
      else {
        var uri = new goog.Uri(window.location.href);
        locationid = uri.getParameterValue('locationid');
        if (goog.isDef(locationid)) {
          return goog.asserts.assertString(locationid);
        } else {
          throw new Error('Cannot determine location ID for business');
        }
      }
    }
  }
});
