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
		return BaseController.extend("portaltest.controller.fragments_views.upCollections", {
			onInit : function () {
				//console.log("init Collections");	
			},

			formatter: formatter,

			onPressTest2: function(oEvent) {
				sap.m.MessageToast.show("Fragment button own controller");
			},
			onPressTest3: function(oEvent) {
				sap.m.MessageToast.show("Fragment button own controller HTML");
			},
			onPressTest4: function(oEvent) {
				sap.m.MessageToast.show("Fragment button own controller JS");
			},

			self: function() {
				return this;
			}
		});
	});