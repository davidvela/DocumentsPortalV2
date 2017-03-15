sap.ui.define(["sap/ui/core/Control"], function(Control) {
	"use strict";
	return Control.extend("portaltest.controls.SnippetsPopUp", {
		"metadata": {
			"properties": {
				"src1": "string",
				"prop1": "string",
				"href1": "string"
			},
			"events": {
				"press": "press"
			},
			"aggregations": {
	          "content": {
	            "type": "sap.ui.core.Control"
	          }
        	}
		},
		init: function() {
			jQuery.sap.require("sap.ui.core.Popup");
        	this.oPopup = new sap.ui.core.Popup(this
        	//,true,false,true  /* modal, shadow, autoClose */
        	);
		},
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
			// oRm.write("<a");
			// oRm.writeAttributeEscaped("href", oControl.getHref1());
			// oRm.write(">");
			// oRm.write("</a>");
			
			var aContent = oControl.getContent();
	        for (var i = 0; i < aContent.length; i++) {
	          oRm.renderControl(aContent[i]);
	        }
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
		},
		open: function() {
        	this.oPopup.open();
    	},			// an event handler:
    	ontap : function(evt) {   // is called when the Control's area is clicked - no event registration required
	        this.firePress();
	        //if (!evt.isMarked()) {   // check whether a child control has already handled the event
	          this.oPopup.close();
	        //}
      }

	});
});