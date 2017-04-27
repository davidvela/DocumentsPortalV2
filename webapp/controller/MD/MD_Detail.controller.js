/*global location */
sap.ui.define([
	"portaltest/controller/BaseController",
	"sap/ui/model/json/JSONModel"
], function(BaseController, JSONModel) {
	"use strict";

	return BaseController.extend("portaltest.controller.MD.MD_Detail", {

		onInit: function() {
			// Model used to manipulate control states. The chosen values make sure,
			// detail page is busy indication immediately so there is no break in
			// between the busy indication for loading the view's meta data

			var oViewModel = new JSONModel({
				busy: false,
				delay: 0,
				lineItemListTitle: this.getResourceBundle().getText("detailLineItemTableHeading")
			});
			this.getRouter().getRoute("objectMDR").attachPatternMatched(this._onObjectMatched, this);
			this.setModel(oViewModel, "detailView");
			this.getOwnerComponent().getModel().metadataLoaded().then(this._onMetadataLoaded.bind(this));

		},

		buildDynamicScreen: function(pItemSelected) {

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
				firstName: "Mohan",
				lastName: "Lal",
				department: "Film"
			}];

			var sPath = "/CampaignSet('" + pItemSelected + "')";
			var oElement = this.byId("detailContainerMDR");
			// var objectSel = this.getView().getModel().getProperty(sPath);
			var objectSel = this.getModel().getProperty(sPath);
			oElement.removeAllContent();
			oElement.addContent(new sap.m.Label({
				text: "type: {CampaignType}"
			}));

			if (objectSel === undefined) return;

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

					var sValues = "yes;no";
					var aValues = sValues.split(";");

					var cb1 = new sap.m.ComboBox({
						tooltip: "this is my toolTip!",
						width: "200px"
					});
					///cb1.addStyle("");
					//cb1.addItem(new sap.ui.core.Item({	text: "Production"	}));
					function myFunction(item) {
						cb1.addItem(new sap.ui.core.Item({
							text: item
						}));
					}
					aValues.forEach(myFunction);

					oElement.addContent(cb1);
					break;
				case "Legacy":
					oElement.addContent(new sap.ui.core.mvc.XMLView({
						viewName: "portaltest.view.MD.MD_Detail_table",
						type: "XML"
					}));

					var oTable = new sap.ui.table.Table({    visibleRowCount: 3		});
					//var oTable = new sap.m.Table({   mob table does not have column binding!
					//	visibleRowCount: 3
					//});

					var oModel = new sap.ui.model.json.JSONModel();
					oModel.setData({
						rows: rowData,
						columns: columnData
					});
					oTable.setModel(oModel);

					oTable.bindColumns("/columns", function(sId, oContext) {
						var columnName = oContext.getObject().columnName;
						return new sap.ui.table.Column({
							label: columnName,
							template: columnName
						});
					});

					oTable.bindRows("/rows");
					
					oElement.addContent(oTable);

					break;
				default:
			}
		},

		onMenuAction: function(oEvent) {
			var oItem = oEvent.getParameter("item");
			var oElement = this.byId("detailContainerMDR");

			switch (oItem.getText()) {
				case "Field":
					oElement.addContent(new sap.m.Input({
						value: "{CampaignName}"
					}));
					break;
				case "Legacy":
					break;
				default:
			}
			/* 				sItemPath = "";
			while (oItem instanceof sap.m.MenuItem) {
				sItemPath = oItem.getText() + " > " + sItemPath;
				oItem = oItem.getParent();
			}
			sItemPath = sItemPath.substr(0, sItemPath.lastIndexOf(" > "));
			sap.m.MessageToast.show("Action triggered on item: " + sItemPath); */
		},

		/* =========================================================== */
		/* event handlers                                              */
		/* =========================================================== */
		onPress: function(oEvent) {
			this.getRouter().navTo("objectMD", {
				objectId: "001"
			}); // oItem.getBindingContext().getProperty("InfoRecID") });			
		},
		    
	    onPrint : function(oEvent) {
	        var oTarget = this.getView(),
	            sTargetId = oEvent.getSource().data("targetId");
	            
	        if (sTargetId) {
	            oTarget = oTarget.byId(sTargetId);
	        }
	        
	        if (oTarget) {
	            var $domTarget = oTarget.$()[0],
	                sTargetContent = $domTarget.innerHTML,
	                sOriginalContent = document.body.innerHTML;
	                
	            document.body.innerHTML = sTargetContent;
	            window.print();
	            document.body.innerHTML = sOriginalContent;
	        } else {
	            jQuery.sap.log.error("onPrint needs a valid target container [view|data:targetId=\"SID\"]");
	        }
	    },
		
		/**
		 * Updates the item count within the line item table's header
		 * @param {object} oEvent an event containing the total number of items in the list
		 * @private
		 */
		onListUpdateFinished: function(oEvent) {
			var sTitle,
				iTotalItems = oEvent.getParameter("total"),
				oViewModel = this.getModel("detailView");

			// only update the counter if the length is final
			if (this.byId("lineItemsList").getBinding("items").isLengthFinal()) {
				if (iTotalItems) {
					sTitle = this.getResourceBundle().getText("detailLineItemTableHeadingCount", [iTotalItems]);
				} else {
					//Display 'Line Items' instead of 'Line items (0)'
					sTitle = this.getResourceBundle().getText("detailLineItemTableHeading");
				}
				oViewModel.setProperty("/lineItemListTitle", sTitle);
			}
		},

		/* =========================================================== */
		/* begin: internal methods                                     */
		/* =========================================================== */

		/**
		 * Binds the view to the object path and expands the aggregated line items.
		 * @function
		 * @param {sap.ui.base.Event} oEvent pattern match event in route 'object'
		 * @private
		 */
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

			this.buildDynamicScreen(sCampId);

		},
		/**
		 * Binds the view to the object path. Makes sure that detail view displays
		 * a busy indicator while data for the corresponding element binding is loaded.
		 * @function
		 * @param {string} sObjectPath path to the object to be bound to the view.
		 * @private
		 */
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

		_onBindingChange: function() {
			var oView = this.getView(),
				oElementBinding = oView.getElementBinding();

			// No data for the binding
			if (!oElementBinding.getBoundContext()) {
				this.getRouter().getTargets().display("detailObjectNotFound");
				// if object could not be found, the selection in the master list
				// does not make sense anymore.
				this.getOwnerComponent().oListSelector.clearMasterListSelection();
				return;
			}

			var sPath = oElementBinding.getPath(),
				oResourceBundle = this.getResourceBundle(),
				oObject = oView.getModel().getObject(sPath),
				sObjectId = oObject.ObjectID,
				sObjectName = oObject.Name,
				oViewModel = this.getModel("detailView");

			this.getOwnerComponent().oListSelector.selectAListItem(sPath);

			oViewModel.setProperty("/shareSendEmailSubject",
				oResourceBundle.getText("shareSendEmailObjectSubject", [sObjectId]));
			oViewModel.setProperty("/shareSendEmailMessage",
				oResourceBundle.getText("shareSendEmailObjectMessage", [sObjectName, sObjectId, location.href]));
		},

		_onMetadataLoaded: function() {
			// Store original busy indicator delay for the detail view
			var iOriginalViewBusyDelay = this.getView().getBusyIndicatorDelay(),
				oViewModel = this.getModel("detailView");
			//oLineItemTable = this.byId("lineItemsList");
			//iOriginalLineItemTableBusyDelay = oLineItemTable.getBusyIndicatorDelay();

			// Make sure busy indicator is displayed immediately when
			// detail view is displayed for the first time
			oViewModel.setProperty("/delay", 0);
			oViewModel.setProperty("/lineItemTableDelay", 0);

			/*oLineItemTable.attachEventOnce("updateFinished", function() {
				// Restore original busy indicator delay for line item table
				oViewModel.setProperty("/lineItemTableDelay", iOriginalLineItemTableBusyDelay);
			});*/

			// Binding the view will set it to not busy - so the view is always busy if it is not bound
			oViewModel.setProperty("/busy", true);
			// Restore original busy indicator delay for the detail view
			oViewModel.setProperty("/delay", iOriginalViewBusyDelay);
		}

	});

});