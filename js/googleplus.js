/**
 * @fileoverview Implements vendor specific code for Google Plus API.
 *
 * @author regardingscot@gmail.com (PeterStJ)
 */

goog.provide('nfc.vendor.Google');

goog.require('goog.Uri');
goog.require('goog.labs.net.xhr');
goog.require('goog.string');
goog.require('nfc.vendor.Base');


/** Implementation for Google Plus API. */
nfc.vendor.Google = goog.defineClass(nfc.vendor.Base, {
  constructor: function() {
    nfc.vendor.Base.call(this);
    this.accessToken = 'AIzaSyCZ2vwKb8BfT44s6fkxy7eM0UMclOm94Jg';
    this.accessKey = 'key=';
    this.baseUrl = 'https://www.googleapis.com/plus/v1/people/';
  },

  /** @override */
  init: function() {},

  /** @override */
  getUserNameByUserId: function(id) {
    return goog.labs.net.xhr.getJson(this.baseUrl + id +
        '?fields=name&' + this.accessKey + this.accessToken)
        .then(function(resp) {
          var name = '';
          if (!goog.isDef(resp['name'])) {
            throw new Error('Cannot find name');
          }
          if (goog.isDef(resp['name']['honorificPrefix'])) {
            name += resp['name']['honorificPrefix'] + ' ';
          }
          if (goog.isDef(resp['name']['givenName'])) {
            name += resp['name']['givenName'] + ' ';
          }
          if (goog.isDef(resp['name']['familyName'])) {
            name += resp['name']['familyName'] + ' ';
          }
          if (goog.isDef(resp['name']['honorificSuffix'])) {
            name += resp['name']['honorificSuffix'];
          }
          return goog.string.trim(name);
        });
  },

  /** @override */
  getPictureUrlByUserId: function(id) {
    return goog.labs.net.xhr.getJson(this.baseUrl + id +
        '?fields=image&' + this.accessKey + this.accessToken)
        .then(function(resp) {
          if (!goog.isDef(resp['image']) ||
              !goog.isDef(resp['image']['url'])) {
            throw new Error('Cannot retrieve image from G+');
          }
          var uri = new goog.Uri(resp['image']['url']);
          uri.setParameterValue('sz', '160');
          return uri.toString();
        });
  }
});
