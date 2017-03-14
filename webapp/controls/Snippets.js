sap.ui.define(["sap/ui/core/Control"], function(Control) {
	"use strict";
	return Control.extend("portaltest.controls.Snippets", {
		"metadata": {
			"properties": {
				"src1": "string",
				"prop1": "string",
				"href1": "string"
			},
			"events": {}
		},
		init: function() {},
		renderer: function(oRm, oControl) {
			oRm.write("<figure");
			oRm.writeControlData(oControl);
			oRm.addClass("snip1585");
			oRm.writeClasses();
			oRm.write(">");
			oRm.write("<img");
			oRm.writeAttributeEscaped("src", oControl.getSrc1());
			oRm.write(">");
			oRm.write("</img>");
			oRm.write("<figcaption");
			oRm.write(">");
			oRm.write("<h3");
			oRm.write(">");
			oRm.write("<span");
			oRm.write(">");
			oRm.writeEscaped(oControl.getProp1());
			oRm.write("</span>");
			oRm.write("</h3>");
			oRm.write("</figcaption>");
			oRm.write("<a");
			oRm.writeAttributeEscaped("href", oControl.getHref1());
			oRm.write(">");
			oRm.write("</a>");
			oRm.write("</figure>");
		},
		onAfterRendering: function(evt) {},
		setSrc1: function(value) {
			this.setProperty("src1", value, true);
			return this;
		},
		setProp1: function(value) {
			this.setProperty("prop1", value, true);
			return this;
		},
		setHref1: function(value) {
			this.setProperty("href1", value, true);
			return this;
		}
	});
});