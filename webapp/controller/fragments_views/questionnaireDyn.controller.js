sap.ui.define([
		"portaltest/controller/BaseController",
		"sap/ui/model/json/JSONModel",
		"sap/ui/core/routing/History",
		"portaltest/model/formatter",
		"sap/ui/model/Filter",
		"sap/ui/model/FilterOperator",
		'sap/m/MessageToast'
	],
	function(BaseController, JSONModel, History, formatter, Filter, FilterOperator, MessageToast) {
		"use strict";
		return BaseController.extend("portaltest.controller.fragments_views.questionnaireDyn", {

			onInit: function() {
			var screens = {
				elements: [{
					Id: "1",
					Name: "Header"
				}, {
					Id: "2",
					Name: "Material Scope"
				}, {
					Id: "3",
					Name: "SDS"
				}, {
					Id: "4",
					Name: "Formula"
				} ]
			};
				//console.log("init Controller with local data for testing");	
				//var oModel = new sap.ui.model.json.JSONModel();
				//oModel.setData(screens);
				var oModel = new JSONModel(jQuery.sap.getModulePath("portaltest.localService", "/questionnaire.json"));
				//sap.ui.getCore().setModel(oModel, "screens" );
				this.getView().setModel(oModel, "screens");
				var oModel = new JSONModel(jQuery.sap.getModulePath("portaltest.localService", "/questionnaireDyn.json"));
				//sap.ui.getCore().setModel(oModel, "screens" );
				this.getView().setModel(oModel);

			},

			formatter: formatter,
			onPressTest2: function(oEvent) {
				sap.m.MessageToast.show("QuestionnaireDynamic");
			},

			self: function() {
				return this;
			}
		});
	});