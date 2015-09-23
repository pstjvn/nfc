/**
 * @fileoverview Provides the filter required for the app (templates).
 *
 * @author regardingscot@gmail.com (PeterStJ)
 */

goog.provide('nfc.ng.filter');


goog.scope(function() {
var _ = nfc.ng.filter;


/**
 * Splits the string in the middle.
 * @param {string} data
 * @return {string}
 */
_.splitInMiddle = function(data) {
  var middle = data.length / 2;
  return data.slice(0, middle) + ' ' + data.slice(middle, data.length);
};


// Export the symbol for filter to be able to see it.
goog.exportSymbol('ngf' + 'splitInMiddle', _.splitInMiddle);

});  // goog.scope
