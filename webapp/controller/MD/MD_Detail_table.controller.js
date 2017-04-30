/*global location */
sap.ui.define([
	"portaltest/controller/BaseController",
	"sap/ui/model/json/JSONModel"
], function(BaseController, JSONModel) {
	"use strict";

	var columnData = [{
		columnName: "firstName"
	}, {
		columnName: "lastName"
	}, {
		columnName: "department"
	}];

	var rowData = [{
		firstName: "Sachin",
		lastName: "Tendulkar",
		department: "Cricket"
	}, {
		firstName: "Lionel",
		lastName: "Messi",
		department: "Football"
	}, {
		firstName: "Lionel",
		lastName: "Messi",
		department: "Football"
	}, {
		firstName: "Mohan",
		lastName: "Lal",
		department: "Film"
	}];

	return BaseController.extend("portaltest.controller.MD.MD_Detail_table", {

		onInit: function() {

			var oViewModel = new JSONModel({
				busy: false,
				delay: 0
			});
			//this.getRouter().getRoute("objectMDR").attachPatternMatched(this._onObjectMatched, this);
			var sObjectPath = this.getModel().createKey("CampaignSet", {
					CampaignID: "001"//sCampId
				});
		/*	this.getView().bindElement({  // no model attached to this view... 
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
			//this.setModel(oViewModel, "detailView");

		},
		
		_onObjectMatched: function(oEvent) {
			var sObjectId = oEvent.getParameter("arguments").objectId;

			//this
			//this.getView().setModel(oModel, "masterIR");

			var sCampId = oEvent.getParameter("arguments").campId;
			this.getModel().metadataLoaded().then(function() {
				var sObjectPath = this.getModel().createKey("CampaignSet", {
					CampaignID: sCampId
				});
				this._bindView("/" + sObjectPath);
			}.bind(this));

			//this.buildDynamicScreen(sCampId);

		},
		
		_bindView: function(sObjectPath) {
			// Set busy indicator during view binding
			var oViewModel = this.getModel("detailView");
			var dyn = this.buildDynamicScreen;
			// If the view was not bound yet its not busy, only if the binding requests data it is set to busy again
			oViewModel.setProperty("/busy", false);

			this.getView().bindElement({
				path: sObjectPath,
				events: {
					change: this._onBindingChange.bind(this),
					dataRequested: function() {
						oViewModel.setProperty("/busy", true);
						//setTimeout(function(){ alert("Hello"); }, 3000);
						//dyn(sObjectPath);
					},
					dataReceived: function() {
						oViewModel.setProperty("/busy", false);
					}
				}
			});
		},

	});

});