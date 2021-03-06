sap.ui.define([
		"portaltest/controller/BaseController",
		"sap/ui/model/json/JSONModel",
		"sap/ui/core/routing/History",
		"portaltest/model/formatter",
		"sap/ui/model/Filter",
		"sap/ui/model/FilterOperator",
		"portaltest/controls/SnippetsPopUp",
		'sap/m/MessageToast'
	], function (BaseController, JSONModel, History, formatter, Filter, FilterOperator, SnippetsPopUp, MessageToast) {
		"use strict";

		return BaseController.extend("portaltest.controller.Worklist", {

			formatter: formatter,

			/* =========================================================== */
			/* lifecycle methods                                           */
			/* =========================================================== */

			/**
			 * Called when the worklist controller is instantiated.
			 * @public
			 */
			onInit : function () {
				var oViewModel,
					iOriginalBusyDelay,
					oTable = this.byId("table");

				// Put down worklist table's original value for busy indicator delay,
				// so it can be restored later on. Busy handling on the table is
				// taken care of by the table itself.
				iOriginalBusyDelay = oTable.getBusyIndicatorDelay();
				// keeps the search state
				this._oTableSearchState = [];

				// Model used to manipulate control states
				oViewModel = new JSONModel({
					worklistTableTitle : this.getResourceBundle().getText("worklistTableTitle"),
					saveAsTileTitle: this.getResourceBundle().getText("worklistViewTitle"),
					shareOnJamTitle: this.getResourceBundle().getText("worklistViewTitle"),
					shareSendEmailSubject: this.getResourceBundle().getText("shareSendEmailWorklistSubject"),
					shareSendEmailMessage: this.getResourceBundle().getText("shareSendEmailWorklistMessage", [location.href]),
					tableNoDataText : this.getResourceBundle().getText("tableNoDataText"),
					tableBusyDelay : 0
				});
				this.setModel(oViewModel, "worklistView");

				// Make sure, busy indication is showing immediately so there is no
				// break after the busy indication for loading the view's meta data is
				// ended (see promise 'oWhenMetadataIsLoaded' in AppController)
				oTable.attachEventOnce("updateFinished", function(){
					// Restore original busy indicator delay for worklist's table
					oViewModel.setProperty("/tableBusyDelay", iOriginalBusyDelay);
				});
			},

			/* =========================================================== */
			/* event handlers                                              */
			/* =========================================================== */
			lamePrint : function (oItem) {
				//window.print();	
				// var viewDom = this.getView().getDomRef();
				var viewDom = document.body.innerHTML;
				var ctrlString = "width=500px, height = 600px";
				var wind = window.open("","PrintWindow", ctrlString);
				wind.document.write( viewDom );
				wind.print();
				wind.close();
			},
			
     		/**
			 * Shows the selected item on the object page
			 * On phones a additional history entry is created
			 * @param {sap.m.ObjectListItem} oItem selected Item
			 * @private
	 		 */
			_showObject : function (oItem) {
				
				var obtSg =  this.getView().byId("SegBtoId");
				switch (obtSg.getSelectedKey()) {
					case "MDE":
							this.getRouter().navTo("objectMD", {
							objectId: oItem.getBindingContext().getProperty("InfoRecID") });
						break;
					case "MDER":
							this.getRouter().navTo("master", {
							objectId: oItem.getBindingContext().getProperty("InfoRecID") });
						break;
					case "NEW": // open new tab _self, _parent, _blank
								// I have to write https:// always! otherwise it does not work! 
							//window.open("www.google.com","_blank"); //not 
							//window.location.href = "www.google.com"; //not
							//window.location = "www.google.com"; // not
							
							//window.location.assign("https://www.w3schools.com"); /// works! 
							//window.open("https://www.w3schools.com","_blank"); //works ! 
							var sSup =  oItem.getBindingContext().getProperty("custNumber");
							window.open("https://sapui5.hana.ondemand.com/test-resources/sap/m/demokit/worklist/webapp/test/mockServer.html#/Objects/ObjectID_"+ sSup, 
										"_blank"); //not 
							
							
							
						    /* var a = document.createElement('a');
							a.href = "www.google.com";
						    a.target = '_blank'; // now it will open new tab/window and bypass any popup blocker!
						    this.fireClickEvent(a);*/
						
						    /*var oLink2 = new sap.m.Link();
						    oLink2.attachPress(function() { alert('Alert Link');    });
							oLink2.setText("Link to URL (Target: _blank)");
							oLink2.setHref("http://www.sap.com");
							oLink2.setTarget("_blank");
							this.getView().addContent(oLink2);
							//this.fireClickEvent(oLink2);
							oLink2.firePress({});*/   
						break;
					case "CAM":
							this.getRouter().navTo("object", {
							objectId: oItem.getBindingContext().getProperty("InfoRecID") });
						break;	
					default: // nothing 
				}
			},
			// this function can fire onclick handler for any DOM-Element
			fireClickEvent : function(element) {
			    var evt = new window.MouseEvent('click', {
			        view: window,
			        bubbles: true,
			        cancelable: true
			    });
			
			    element.dispatchEvent(evt);
			},
			handleSnippetsPress: function (oEvent) {
					// ok, add another instance...:
				var myControl2 = new SnippetsPopUp({
				      src1:"../assets/defaultImg.png", 
				      prop1:"click to close", 
				      href1:"www.google.com",
				      content: [
				        new sap.m.Button({text: "Hi!"})  
				      ]
			    });
			    myControl2.open();
			},
			handleUploadComplete: function (oEvent) {
				var f = oEvent.oSource.oFileUpload.files[0]; 
				var path = URL.createObjectURL(f);   
				//var img = sap.ui.getCore().byId("img");
				var img = this.getView().byId("img");
				img.setSrc(path);  
			},
			handleUploadPress : function (oEvent) {
				var oFileUploader = this.getView().byId("fileUploader");
				if(!oFileUploader.getValue()) {
					MessageToast.show("Choose a file first");
					return;
				}
				
				//oFileUploader.upload();
				
				 /*var oFileUploader2 = new sap.ui.unified.FileUploader({
                    uploadUrl : "your_service/UserSet('"+ user[0].getValue() +"')/Photo",
                    name: "simpleUploader", 
                    uploadOnChange: false,
                    sendXHR: true,
                    useMultipart: false,
                    headerParameters: [
                        new sap.ui.unified.FileUploaderParameter({name: "x-csrf-token", value: sap.ui.getCore().getModel().getHeaders()['x-csrf-token'] }),    
                    ],
                    uploadComplete: function (oEvent) {
                        var sResponse = oEvent.getParameter("response");
                        if (sResponse) {
                            oUploadDialog.close();
                            sap.ui.commons.MessageBox.show("Return Code: " + sResponse, "Response", "Response");
                        }
                    }  
				});
				// press: 
					 oFileUploader.insertHeaderParameter(new sap.ui.unified.FileUploaderParameter({name: "slug", value: oFileUploader.getValue() }));
                     oFileUploader.upload();
				*/
				
			},

			/**
			 * Triggered by the table's 'updateFinished' event: after new table
			 * data is available, this handler method updates the table counter.
			 * This should only happen if the update was successful, which is
			 * why this handler is attached to 'updateFinished' and not to the
			 * table's list binding's 'dataReceived' method.
			 * @param {sap.ui.base.Event} oEvent the update finished event
			 * @public
			 */
			onUpdateFinished : function (oEvent) {
				// update the worklist's object counter after the table update
				var sTitle,
					oTable = oEvent.getSource(),
					iTotalItems = oEvent.getParameter("total");
				// only update the counter if the length is final and
				// the table is not empty
				if (iTotalItems && oTable.getBinding("items").isLengthFinal()) {
					sTitle = this.getResourceBundle().getText("worklistTableTitleCount", [iTotalItems]);
				} else {
					sTitle = this.getResourceBundle().getText("worklistTableTitle");
				}
				this.getModel("worklistView").setProperty("/worklistTableTitle", sTitle);
			},
			
			onPressTest: function(oEvent){
				MessageToast.show("Fragment button");
			},

			/**
			 * Event handler when a table item gets pressed
			 * @param {sap.ui.base.Event} oEvent the table selectionChange event
			 * @public
			 */
			onPress : function (oEvent) {
				// The source is the list item that got pressed
				this._showObject(oEvent.getSource());
			},


			/**
			 * Event handler for navigating back.
			 * It there is a history entry or an previous app-to-app navigation we go one step back in the browser history
			 * If not, it will navigate to the shell home
			 * @public
			 */
			onNavBack : function() {
				var sPreviousHash = History.getInstance().getPreviousHash(),
					oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");

				if (sPreviousHash !== undefined || !oCrossAppNavigator.isInitialNavigation()) {
					history.go(-1);
				} else {
					oCrossAppNavigator.toExternal({
						target: {shellHash: "#Shell-home"}
					});
				}
			},

			/**
			 * Event handler when the share in JAM button has been clicked
			 * @public
			 */
			onShareInJamPress : function () {
				var oViewModel = this.getModel("worklistView"),
					oShareDialog = sap.ui.getCore().createComponent({
						name: "sap.collaboration.components.fiori.sharing.dialog",
						settings: {
							object:{
								id: location.href,
								share: oViewModel.getProperty("/shareOnJamTitle")
							}
						}
					});
				oShareDialog.open();
			},

			onSearch : function (oEvent) {
				if (oEvent.getParameters().refreshButtonPressed) {
					// Search field's 'refresh' button has been pressed.
					// This is visible if you select any master list item.
					// In this case no new search is triggered, we only
					// refresh the list binding.
					this.onRefresh();
				} else {
					var oTableSearchState = [];
					var sQuery = oEvent.getParameter("query");

					if (sQuery && sQuery.length > 0) {
						oTableSearchState = [new Filter("MaterialNumber", FilterOperator.Contains, sQuery)];
					}
					this._applySearch(oTableSearchState);
				}

			},

			/**
			 * Event handler for refresh event. Keeps filter, sort
			 * and group settings and refreshes the list binding.
			 * @public
			 */
			onRefresh : function () {
				var oTable = this.byId("table");
				oTable.getBinding("items").refresh();
			},
			
			onItemSelected: function(oEvent) {
				
				var oSelectedItem = oEvent.getSource();
				var oContext = oSelectedItem.getBindingContext();
				var sPath = oContext.getPath();
				var oTable = this.byId("tabCampInfoRec");
				oTable.bindElement({ path: sPath });
				this.byId("tabCampInfoRec").setVisible(true); 


/*				var oSelectedItem = oEvent.getSource();
				var oContext = oSelectedItem.getBindingContext();
				var sPath = oContext.getPath();
				var oProductDetailPanel = this.byId("table2");
				oProductDetailPanel.bindElement({ path: sPath, parameter: { expand: "ToCampaignInfoRec"} });
				this.byId("table2").setVisible(true); */
				
/*				var sObjectId =  oEvent.getParameter("arguments").objectId;
				this.getModel().metadataLoaded().then( function() {
					var sObjectPath = this.getModel().createKey("CampaignSet", {
						ProductID :  sObjectId
					});
					this._bindView("/" + sObjectPath);
				}.bind(this));*/
			},
			
			
			/* =========================================================== */
			/* internal methods                                            */
			/* =========================================================== */
			_bindView : function (sObjectPath) {
				var oViewModel = this.getModel("objectView"),
					oDataModel = this.getModel();

				this.getView().bindElement({
					path: sObjectPath,
					parameters: {
						expand: "ToCampaignInfoRec"	
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
					sObjectId = oObject.CampaignID,
					sObjectName = oObject.CampaignID;

				// Everything went fine.
				oViewModel.setProperty("/busy", false);
				oViewModel.setProperty("/shareSendEmailSubject",
				oResourceBundle.getText("shareSendEmailObjectSubject", [sObjectId]));
				oViewModel.setProperty("/shareSendEmailMessage",
				oResourceBundle.getText("shareSendEmailObjectMessage", [sObjectName, sObjectId, location.href]));
			},


			/**
			 * Internal helper method to apply both filter and search state together on the list binding
			 * @param {object} oTableSearchState an array of filters for the search
			 * @private
			 */
			_applySearch: function(oTableSearchState) {
				var oTable = this.byId("table"),
					oViewModel = this.getModel("worklistView");
				oTable.getBinding("items").filter(oTableSearchState, "Application");
				// changes the noDataText of the list in case there are no filter results
				if (oTableSearchState.length !== 0) {
					oViewModel.setProperty("/tableNoDataText", this.getResourceBundle().getText("worklistNoDataWithSearchText"));
				}
			}

		});
	}
);