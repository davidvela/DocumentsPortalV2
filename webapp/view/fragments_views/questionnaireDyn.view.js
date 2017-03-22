sap.ui.jsview("portaltest.view.fragments_views.questionnaireDyn", {
    getControllerName: function() {
        return "portaltest.controller.fragments_views.questionnaireDyn";
    },

    	createContent: function(oController) {
    		return new sap.m.Button( { text : "Questionnaire JSview!" ,
    								   //press : function(ev) {        	}
    								   press :  [oController.onPressTest2, oController] 
    		});
    	
    	}	
	});