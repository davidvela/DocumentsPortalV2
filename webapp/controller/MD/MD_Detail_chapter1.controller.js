/*global location */
sap.ui.define([
	"portaltest/controller/BaseController",
	"sap/ui/model/json/JSONModel"
], function(BaseController, JSONModel) {
	"use strict";
		return BaseController.extend("portaltest.controller.MD.MD_Detail_chapter1", {

		onInit: function() {

			var oViewModel = new JSONModel({
				busy: false,
				delay: 0, 
				Tablelength: 5
			});
			//this.getRouter().getRoute("objectMDR").attachPatternMatched(this._onObjectMatched, this);
				/*var sObjectPath = this.getModel().createKey("CampaignSet", {
					CampaignID: "001"//sCampId
				});
			this.getView().bindElement({  // no model attached to this view... 
				path: sObjectPath,
				events: {
					//change: this._onBindingChange.bind(this),
					dataRequested: function() {
						oViewModel.setProperty("/busy", true);
					},
					dataReceived: function() {
						oViewModel.setProperty("/busy", false);
					}	}
				}); */
			this.setModel(oViewModel, "detailView");  
			//this.buildDynamicScreen();
		},
		buildDynamicScreen: function( ) {
			var oElement = this.byId("detailContainerMDR_ch1");
			oElement.removeAllContent();

					
		}
		
	});

});