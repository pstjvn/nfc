goog.provide('app.Ui');
goog.provide('app.UiRenderer');

goog.require('app.template');
goog.require('goog.ui.registry');
goog.require('pstj.material.Element');
goog.require('pstj.material.ElementRenderer');


/** Implements the UI for the app. */
app.Ui = goog.defineClass(pstj.material.Element, {
  constructor: function() {
    pstj.material.Element.call(this);
    this.setUseNGTemplateSyntax(true);
  }
});


/** Implements the renderer for the UI component. */
app.UiRenderer = goog.defineClass(pstj.material.ElementRenderer, {
  constructor: function() {
    pstj.material.ElementRenderer.call(this);
  },

  /** @override */
  getTemplate: function(model) {
    return app.template.Main(model);
  },

  /** @override */
  generateTemplateData: function(control) {
    return {
      data: control.getModel()
    };
  },

  /** @override */
  getCssClass: function() {
    return app.UiRenderer.CSS_CLASS;
  },

  statics: {
    /**
     * @const {!string}
     */
    CSS_CLASS: goog.getCssName('e-like-app')
  }
});
goog.addSingletonGetter(app.UiRenderer);


// Register for default renderer.
goog.ui.registry.setDefaultRenderer(app.Ui, app.UiRenderer);


// Register decorator factory function.
goog.ui.registry.setDecoratorByClassName(app.UiRenderer.CSS_CLASS, function() {
  return new app.Ui();
});
