/**
 * @fileoverview Implements vendor specific code for Facebook Graph API.
 *
 * @author regardingscot@gmail.com (PeterStJ)
 */

goog.provide('nfc.vendor.Facebook');

goog.require('goog.Promise');
goog.require('goog.labs.net.xhr');
goog.require('goog.string');
goog.require('nfc.vendor.Base');


/** Implements the vendor specific functionality for Facebook. */
nfc.vendor.Facebook = goog.defineClass(nfc.vendor.Base, {
  constructor: function() {
    nfc.vendor.Base.call(this);
    this.baseUrl = 'https://graph.facebook.com/v2.4/';
    /**
     * @type {!string}
     * @private
     */
    this.incopleteId_ = '';
    /**
     * @type {?function(string): void}
     * @private
     */
    this.lastResolver_ = null;
    /**
     * @type {?function(?): void}
     * @private
     */
    this.lastRejecter_ = null;
    this.init();
  },

  /**
   * Initialize the vendor authentication.
   * @protected
   */
  init: function() {
    goog.labs.net.xhr.get(this.constructAccessTokenQuery_())
        .then(this.saveAccessTokenQuery_, null, this);
  },

  /** @override */
  getUserNameByUserId: function(id) {
    if (this.hasAccessToken_()) {
      return goog.labs.net.xhr.getJson(this.baseUrl + id + '?' +
          this.accessToken)
          .then(function(resp) {
            if (!goog.isNull(this.lastResolver_)) {
              this.incopleteId_ = '';
              this.lastResolver_(resp.name);
              this.lastRejecter_ = null;
              this.lastResolver_ = null;
            }
            return goog.asserts.assertString(resp.name);
          }, null, this);
    } else {
      if (!goog.isNull(this.lastResolver_)) {
        this.incopleteId_ = id;
        this.lastRejecter_(null);
        this.lastResolver_ = null;
        this.lastRejecter_ = null;
      }
      this.incopleteId_ = id;
      return new goog.Promise(function(resolve, reject) {
        this.lastResolver_ = resolve;
        this.lastRejecter_ = reject;
      }, this);
    }
  },

  /** @override */
  getPictureUrlByUserId: function(id) {
    return goog.Promise.resolve(this.baseUrl + id +
        '/picture?width=160&height=160');
  },

  /**
   * Constructs the auth URL for facebook.
   * @private
   * @return {!string}
   */
  constructAccessTokenQuery_: function() {
    return 'https://graph.facebook.com/' +
        'oauth/access_token?' +
        'client_id=208475542818108&' +
        'client_secret=4852efd208f5d59d0a3bd4ebbe81b28d' +
        '&grant_type=client_credentials';
  },

  /**
   * Stores the access token as a string to be used for further calls to
   * Facebook graph API.
   * @param {string} response
   * @private
   */
  saveAccessTokenQuery_: function(response) {
    goog.asserts.assertString(response);
    if (!goog.string.startsWith(response, 'access_token=')) {
      throw new Error('Cannot obtain access token from Facebook');
    }
    this.accessToken = response;
    if (!goog.string.isEmpty(this.incopleteId_)) {
      this.getUserNameByUserId(this.incopleteId_);
    }
  },

  /**
   * Checks if we already have the access token.
   * @return {boolean}
   */
  hasAccessToken_: function() {
    return !goog.string.isEmpty(this.accessToken);
  }
});
