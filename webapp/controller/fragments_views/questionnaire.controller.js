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
		return BaseController.extend("portaltest.controller.fragments_views.questionnaire", {
			onInit : function () {
				//console.log("init Collections");	
			},

			formatter: formatter,
			onPressTest2: function(oEvent) {
				sap.m.MessageToast.show("Questionnaire");
			},

			self: function() {
				return this;
			}
		});
	});