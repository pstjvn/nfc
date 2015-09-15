
// This code is auto generate, please do not edit.

goog.provide('nfc.gen.dto.NFCPlaceUpdate');

goog.require('goog.asserts');
goog.require('pstj.ds.DtoBase');


goog.scope(function() {
var a = goog.asserts;


/**
 * Describes a place that uses nfc product
 * @extends {pstj.ds.DtoBase}
 */
nfc.gen.dto.NFCPlaceUpdate = goog.defineClass(pstj.ds.DtoBase, {
  constructor: function() {
    pstj.ds.DtoBase.call(this);
    /**
     * The ID of the user corespponding to an account in social networks
     * @type {string}
     */
    this.userID = '';
    /**
     * The auth provider for the user: FB or G+
     * @type {string}
     */
    this.userAuthProvider = '';
    /**
     * How many likes has the location total
     * @type {number}
     */
    this.locationLikes = 0;
    /**
     * How many likes the last user has for this place in total
     * @type {number}
     */
    this.userLikes = 0;
    /**
     * The location name as registered in the system
     * @type {string}
     */
    this.locationName = '';
    /**
     * The data refresh interval in seconds
     * @type {number}
     */
    this.refreshInterval = 0;
  },

  /** @override */
  fromJSON: function(map) {
    this.userID = a.assertString((goog.isString(map['user_id']) ?
        map['user_id'] : ''));
    this.userAuthProvider = a.assertString((goog.isString(map['user_type']) ?
        map['user_type'] : ''));
    this.locationLikes = a.assertNumber((goog.isNumber(map['place_likes']) ?
        map['place_likes'] : 0));
    this.userLikes = a.assertNumber((goog.isNumber(map['user_likes']) ?
        map['user_likes'] : 0));
    this.locationName = a.assertString((goog.isString(map['place_name']) ?
        map['place_name'] : ''));
    this.refreshInterval = a.assertNumber((goog.isNumber(map['refresh']) ?
        map['refresh'] : 0));
    goog.base(this, 'fromJSON', map);
  },

  /** @override */
  toJSON: function() {
    return {
      'user_id': this.userID,
      'user_type': this.userAuthProvider,
      'place_likes': this.locationLikes,
      'user_likes': this.userLikes,
      'place_name': this.locationName,
      'refresh': this.refreshInterval
    };
  }
});
});  // goog.scope

