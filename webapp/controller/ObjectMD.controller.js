sap.ui.define([
		"portaltest/controller/BaseController",
		"sap/ui/model/json/JSONModel",
		"sap/ui/core/routing/History",
		"portaltest/model/formatter"
	], function (		
		BaseController,
		JSONModel,
		History,
		formatter) {
		"use strict";
		return BaseController.extend("portaltest.controller.ObjectMD", {

			onInit : function () {
				var iOriginalBusyDelay,
					oViewModel = new JSONModel({
						busy : true,
						delay : 0,
						title: "Projec Areas"
					});

				this.getRouter().getRoute("objectMD").attachPatternMatched(this._onObjectMatched, this);

				// Store original busy indicator delay, so it can be restored later on
				iOriginalBusyDelay = this.getView().getBusyIndicatorDelay();
				this.setModel(oViewModel, "objectView");
				this.getOwnerComponent().getModel().metadataLoaded().then(function () {
						// Restore original busy indicator delay for the object view
						oViewModel.setProperty("/delay", iOriginalBusyDelay);
					}
				);
				//this.initMaster();
			},
			
			
			// master methods 
			
			onSelectionChange : function (oEvent) {
				// get the list item, either from the listItem parameter or from the event's source itself (will depend on the device-dependent mode).
				this._showDetail(oEvent.getParameter("listItem") || oEvent.getSource());
			},

			_showDetail : function (oItem) {
				var oItemSelected = oItem.getBindingContext().getProperty("CampaignID");
				var sPath = "/CampaignSet('"+ oItemSelected + "')";
				
				var oElement = this.byId("detailContainer");
				oElement.bindElement({ path: sPath });

				/*var bReplace = !Device.system.phone;
				this.getRouter().navTo("object", {
					objectId : oItem.getBindingContext().getProperty("ObjectID")
				}, bReplace);*/
				
				
				var objectSel = this.getView().getModel().getProperty(sPath);
				oElement.removeAllContent();
				switch (objectSel.CampaignType) {
					case "Application":
						oElement.addContent( new sap.m.Input({ value: "{CampaignName}"}) );
						break;
					case "IoT":
						oElement.addContent( new sap.m.Input({ value: "{CampaignName}"}) );
						oElement.addContent(new sap.m.Button({ text : "IoT is cool"  }));
						break;
					default:
				}
				
				
				// real logic: 
				
			},
			
			// logic to build screens 
			buildScreen : function( oElements  ) {
				var oDetailContainer = this.byId("detailContainer");
				 //this.getView().setModel(oModel, "master");
				
				
			//	oDetailContainer.emp
				for(var element in oElements)
				{	
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
						} ]
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
			
			_onObjectMatched : function (oEvent) {
				var sObjectId =  oEvent.getParameter("arguments").objectId;
				this.getModel().metadataLoaded().then( function() {
					var sObjectPath = this.getModel().createKey("InfoRecSet", {
						InfoRecID :  sObjectId
					});
					this._bindView("/" + sObjectPath);
				}.bind(this));
			},
			
			_bindView : function (sObjectPath) {
				var oViewModel = this.getModel("objectView");
				var oDataModel = this.getModel();
				
				var oList = this.byId("masterListId");
					if (oList !== undefined)
						oList.bindElement({ path: sObjectPath });
				
				this.getView().bindElement({
					path: sObjectPath,
					parameters: {
						expand: "CampaignToInfoSet"	
					},
					events: {
						change: this._onBindingChange.bind(this),
						dataRequested: function () {
							oDataModel.metadataLoaded().then(function () {
								// Busy indicator on view should only be set if metadata is loaded,
								// otherwise there may be two busy indications next to each other on the
								// screen. This happens because route matched handler already calls '_bindView'
								// while metadata is loaded.
								oViewModel.setProperty("/busy", true);
							});
						},
						dataReceived: function () {
							oViewModel.setProperty("/busy", false);
						}
					}
				});
				
			},
			_onBindingChange : function () {
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

			onNavBack : function() {
				var sPreviousHash = History.getInstance().getPreviousHash(),
					oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");

				if (sPreviousHash !== undefined || !oCrossAppNavigator.isInitialNavigation()) {
					history.go(-1);
				} else {
					this.getRouter().navTo("worklist", {}, true);
				}
			}
			
			
		});

	}
);