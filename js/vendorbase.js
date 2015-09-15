/**
 * @fileoverview Provides the interface for implementing vendor specific getters
 * for user names and user pictures.
 *
 * @author regardingscot@gmail.com (PeterStJ)
 */

goog.provide('nfc.vendor.Base');


/** Base class for vendor specific getters. */
nfc.vendor.Base = goog.defineClass(null, {
  constructor: function() {
    /**
     * @type {!string}
     * @protected
     */
    this.accessToken = '';
    /**
     * @type {!string}
     * @protected
     */
    this.accessKey = '';
    /**
     * @type {!string}
     * @protected
     */
    this.baseUrl = '';
  },

  /**
   * Initializer: will be called immediately after construction.
   *
   * @protected
   */
  init: function() {
    throw new Error('Not implemented');
  },

  /**
   * Given a userid returns a promise that will resolve to the user name as per
   * the corresponding social network.
   *
   * @param {!string} id
   * @return {!goog.Promise<!string>}
   */
  getUserNameByUserId: function(id) {
    throw new Error('Not implemented');
  },

  /**
   * Given a user name returns a promise that will resolve to an url of the
   * image on the profile of the user in the corresponding social network.
   *
   * @param {!string} id
   * @return {!goog.Promise<!string>}
   */
  getPictureUrlByUserId: function(id) {
    throw new Error('Not implemented');
  }
});
