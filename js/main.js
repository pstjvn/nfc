goog.provide('app.Main');

goog.require('app.Ui');
goog.require('goog.Uri');
goog.require('goog.asserts');
goog.require('goog.dom');
goog.require('nfc.control.Main');
goog.require('pstj.configure');


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
     * The controller that handles the update of data.
     * @type {!nfc.control.Main}
     * @private
     */
    this.ctrl_ = new nfc.control.Main(this.acctid_, this.baseurl_);
    this.ui_ = new app.Ui();
    this.init();
  },

  /**
   * Initialize functionality.
   * @protected
   */
  init: function() {
    this.ctrl_.setUpdateCallback(goog.bind(this.paint, this));
    goog.dom.removeNode(document.getElementById('loader'));
  },

  /**
   * Repaints the UI based on the new data.
   * @param {!nfc.gen.dto.NFCPlaceUpdate} data
   * @protected
   */
  paint: function(data) {
    if (!this.ui_.isInDocument()) {
      this.ui_.setModel(data);
      this.ui_.render();
    }
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
    }
  }
});
