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
		onBeforeRendering: function() {
			//this.getView().byId("DSCWidthSlider").setVisible(!sap.ui.Device.system.phone);
			//this.getView().byId("DSCWidthHintText").setVisible(!sap.ui.Device.system.phone);
		},
		handleSliderChange: function (oEvent) {
			var iValue = oEvent.getParameter("value");
			this.updateControlWidth(iValue);
		},
		updateControlWidth: function (iValue) {
			var $DSCContainer = this.getView().byId("sideContentContainer").$();
			if (iValue) {
				$DSCContainer.width(iValue + "%");
			}
		},
		updateToggleButtonState: function (oEvent) {
			var oToggleButton = this.getView().byId("toggleButton"),
				sCurrentBreakpoint = oEvent.getParameter("currentBreakpoint");
 
			if (sCurrentBreakpoint === "S") {
				oToggleButton.setEnabled(true);
			} else {
				oToggleButton.setEnabled(false);
			}
		},
		handleToggleClick: function () {
			this.getView().byId("DynamicSideContent").toggle();
		},
			self: function() {
				return this;
			}
		});
	});