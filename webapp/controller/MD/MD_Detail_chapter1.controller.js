//*global location */
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
			//this.getRouter().getRoute("objectMDR");//.attachPatternMatched(this._onObjectMatched, this);
			
			/*	var sObjectPath = this.getModel().createKey("CampaignSet", {
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
			this.buildDynamicScreen();
		},
		buildDynamicScreen: function( ) {
			//var oElement = this.byId("detailContainerMDR_ch1");
			//oElement.removeAllContent();
			var model = "test"; 
					
		},
		_onObjectMatched: function(oEvent) {
			var sObjectId = oEvent.getParameter("arguments").objectId;

			var sCampId = oEvent.getParameter("arguments").campId;
			this.getModel().metadataLoaded().then(function() {
				var sObjectPath = this.getModel().createKey("CampaignSet", {
					CampaignID: sCampId
				});
				this._bindView("/" + sObjectPath);
			}.bind(this));
		},
		_bindView: function(sObjectPath) {
			this.getView().bindElement({
				path: sObjectPath,
				parameters: {
					expand: "ToElements"	
				},
				events: {
					change: this._onBindingChange.bind(this),
					dataRequested: function() {
						//setTimeout(function(){ alert("Hello"); }, 3000);
						//dyn(sObjectPath);
					},
					dataReceived: function() {					}
				}
			});
		},

		_onBindingChange: function() {
			var oView = this.getView(),
			oElementBinding = oView.getElementBinding();
			if (!oElementBinding.getBoundContext()) {
				this.getRouter().getTargets().display("detailObjectNotFound");
				return;
			}

			var sPath = oElementBinding.getPath(),
				oObject = oView.getModel().getObject(sPath);
			this.getOwnerComponent().oListSelector.selectAListItem(sPath);
		}
		
	});

});