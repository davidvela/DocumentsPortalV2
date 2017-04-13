sap.ui.define([
	"portaltest/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/routing/History",
	"portaltest/model/formatter"
], function(
	BaseController,
	JSONModel,
	History,
	formatter) {
	"use strict";
	return BaseController.extend("portaltest.controller.ObjectMD", {

		onInit: function() {
			var iOriginalBusyDelay,
				oViewModel = new JSONModel({
					busy: true,
					delay: 0,
					title: "Projec Areas"
				});

			this.getRouter().getRoute("objectMD").attachPatternMatched(this._onObjectMatched, this);

			// Store original busy indicator delay, so it can be restored later on
			iOriginalBusyDelay = this.getView().getBusyIndicatorDelay();
			this.setModel(oViewModel, "objectView");
			this.getOwnerComponent().getModel().metadataLoaded().then(function() {
				// Restore original busy indicator delay for the object view
				oViewModel.setProperty("/delay", iOriginalBusyDelay);
			});
			//this.initMaster();
			//this.injectTestButton();
		},

		// master methods 

		onSelectionChange: function(oEvent) {
			// get the list item, either from the listItem parameter or from the event's source itself (will depend on the device-dependent mode).
			this._showDetail(oEvent.getParameter("listItem") || oEvent.getSource());
		},

		_showDetail: function(oItem) {
			var oItemSelected = oItem.getBindingContext().getProperty("CampaignID");
			var sPath = "/CampaignSet('" + oItemSelected + "')";

			var oElement = this.byId("detailContainer");
			oElement.bindElement({
				path: sPath
			});

			/*var bReplace = !Device.system.phone;
			this.getRouter().navTo("object", {
				objectId : oItem.getBindingContext().getProperty("ObjectID")
			}, bReplace);*/

			var objectSel = this.getView().getModel().getProperty(sPath);
			oElement.removeAllContent();
			oElement.addContent(new sap.m.Label({
						text: "type: {CampaignType}"
					}));
			switch (objectSel.CampaignType) {
				case "Application":
					oElement.addContent(new sap.m.Input({
						value: "{CampaignName}"
					}));
					break;
				case "IoT":
					oElement.addContent(new sap.m.Input({
						value: "{CampaignName}"
					}));
					oElement.addContent(new sap.m.Button({
						text: "IoT is cool"
					}));
					break;
				case "Legacy":
					oElement.addContent( new sap.ui.core.mvc.XMLView({
							viewName:"portaltest.view.fragments_views.upCollections" ,
							type:"XML"					})
						);
					break;
				default:
			}

			// real logic: objectSel->array - array - ID,  
			

		},

		// injects a simple testing button in the lower left area of the current app
		// <script src="https://sap.github.io/openSAP-ui5-course/Validator.js"></script>

		injectTestButton: function() {
			this._oValidateButton = new sap.m.Button("validate", {
				icon: "sap-icon://wrench",
				tooltip: "Click here or press F9 to execute the tests for this exercise",
				press: function() {
					// sometimes button triggers tap twice or user double clicks
					// therefore we add a slight timeout of 1s before resetting again
					/* setTimeout(function () {
						this.bPressBlocker = false;
					}.bind(this), 1000);
					if (!this.bPressBlocker) {
						this.runTests();
					} else {
						this._oPopover.openBy(this._oValidateButton);
					}
					this.bPressBlocker = true;*/
				}.bind(this)
			}).placeAt("content", -1);

			// CSS manupulation for the validator button
			this._oValidateButton.addEventDelegate({
				onAfterRendering: function(oEvent) {
					var oButton = oEvent.srcControl;
					oButton.$().css("position", "absolute");
					oButton.$().css("z-index", "100000");
					oButton.$().css("width", "100px");
					oButton.$().css("height", "100px");
					oButton.$().css("left", "50px");
					oButton.$().css("bottom", "50px");
					oButton.$().css("border-radius", "500px");

					oButton.$("inner").css("width", "100px");
					oButton.$("inner").css("height", "100px");
					oButton.$("inner").css("border-radius", "100px");
					oButton.$("inner").css("background", "#009de0");
					oButton.$("inner").css("text-shadow", "0 1px 50px #ffffff");

					oButton.$("img").css("color", "#eee");
					oButton.$("img").css("width", "100px");
					oButton.$("img").css("height", "100px");
					oButton.$("img").css("line-height", "100px");
					oButton.$("img").css("font-size", "35pt");
					oButton.$("img").control(0).setColor("#eee");
				}
			});
		},

		// logic to build screens 
		buildScreen: function(oElements) {
			var oDetailContainer = this.byId("detailContainer");
			//this.getView().setModel(oModel, "master");

			//	oDetailContainer.emp
			for (var element in oElements) {
				//	switch	
			}

		},

		initMaster: function() {
			var screens = {
				objects: [{
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
				}]
			};
			//console.log("init Master");	
			var oModel = new sap.ui.model.json.JSONModel();
			oModel.setData(screens);
			this.getView().setModel(oModel, "master");
			//var oModel = new JSONModel(jQuery.sap.getModulePath("portaltest.localService", "/questionnaire.json"));
			//sap.ui.getCore().setModel(oModel, "master" );

		},

		// detail methods

		// other methods

		_onObjectMatched: function(oEvent) {
			var sObjectId = oEvent.getParameter("arguments").objectId;
			this.getModel().metadataLoaded().then(function() {
				var sObjectPath = this.getModel().createKey("InfoRecSet", {
					InfoRecID: sObjectId
				});
				this._bindView("/" + sObjectPath);
			}.bind(this));
		},

		_bindView: function(sObjectPath) {
			var oViewModel = this.getModel("objectView");
			var oDataModel = this.getModel();

			var oList = this.byId("masterListId");
			if (oList !== undefined)
				oList.bindElement({
					path: sObjectPath
				});

			this.getView().bindElement({
				path: sObjectPath,
				parameters: {
					expand: "CampaignToInfoSet"
				},
				events: {
					change: this._onBindingChange.bind(this),
					dataRequested: function() {
						oDataModel.metadataLoaded().then(function() {
							// Busy indicator on view should only be set if metadata is loaded,
							// otherwise there may be two busy indications next to each other on the
							// screen. This happens because route matched handler already calls '_bindView'
							// while metadata is loaded.
							oViewModel.setProperty("/busy", true);
						});
					},
					dataReceived: function() {
						oViewModel.setProperty("/busy", false);
					}
				}
			});

		},
		_onBindingChange: function() {
			var oView = this.getView(),
				oViewModel = this.getModel("objectView"),
				oElementBinding = oView.getElementBinding();
			// No data for the binding
			if (!oElementBinding.getBoundContext()) {
				this.getRouter().getTargets().display("objectNotFound");
				return;
			}

			var oResourceBundle = this.getResourceBundle(),
				oObject = oView.getBindingContext().getObject(),
				sObjectId = oObject.InfoRecID,
				sObjectName = oObject.MaterialNumber;

			// Everything went fine.
			oViewModel.setProperty("/busy", false);
			oViewModel.setProperty("/saveAsTileTitle", oResourceBundle.getText("saveAsTileTitle", [sObjectName]));
			oViewModel.setProperty("/shareOnJamTitle", sObjectName);
			oViewModel.setProperty("/shareSendEmailSubject",
				oResourceBundle.getText("shareSendEmailObjectSubject", [sObjectId]));
			oViewModel.setProperty("/shareSendEmailMessage",
				oResourceBundle.getText("shareSendEmailObjectMessage", [sObjectName, sObjectId, location.href]));
		},

		onNavBack: function() {
			var sPreviousHash = History.getInstance().getPreviousHash(),
				oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");

			if (sPreviousHash !== undefined || !oCrossAppNavigator.isInitialNavigation()) {
				history.go(-1);
			} else {
				this.getRouter().navTo("worklist", {}, true);
			}
		}

	});

});