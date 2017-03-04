sap.ui.jsview("portaltest.view.fragments_views.upCollections", {
    getControllerName: function() {
        return "portaltest.controller.fragments_views.upCollections";
    },

    	createContent: function(oController) {
    		return new sap.m.Button( { text : "JS view!" ,
    								   //press : function(ev) {        	}
    								   press :  [oController.onPressTest4, oController] 
    		});
    	
    	}	
	});