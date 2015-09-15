/**
 * @fileoverview Main app entrance.
 *
 * @author regardingscot@gmail.com (Peter StJ)
 */

goog.provide('app');

goog.require('goog.Promise');
goog.require('nfc.vendor.Facebook');
goog.require('nfc.vendor.Google');


(function() {
  // Instanciate your app code here.
  var fb = new nfc.vendor.Facebook();
  var gp = new nfc.vendor.Google();

  goog.Promise.all([
    fb.getUserNameByUserId('100004879987691'),
    fb.getPictureUrlByUserId('100004879987691')
  ]).then(function(data) {
    document.getElementById('fbimg').src = data[1];
    document.getElementById('fbname').textContent = data[0];
  });

  goog.Promise.all([
    gp.getUserNameByUserId('110065732245285350385'),
    gp.getPictureUrlByUserId('110065732245285350385')
  ]).then(function(data) {
    document.getElementById('gimg').src = data[1];
    document.getElementById('gname').textContent = data[0];
  });

})();
