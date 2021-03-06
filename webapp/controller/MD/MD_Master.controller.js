/*global history */
sap.ui.define([
		"portaltest/controller/BaseController",
		"sap/ui/model/json/JSONModel",
		"sap/ui/model/Filter",
		"sap/ui/model/FilterOperator",
		"sap/m/GroupHeaderListItem",
		"sap/ui/Device",
		"sap/ui/core/routing/History"
	], function (BaseController, JSONModel, Filter, FilterOperator, GroupHeaderListItem, Device, History) {
		"use strict";
		var objID; 
		
		return BaseController.extend("portaltest.controller.MD.MD_Master", {
			onInit : function () {
				// Control state model
					var oList = this.byId("masterListIdMD"),
					oViewModel = this._createViewModel(),
					busyInd = this.byId("busyMaster");
				//var iOriginalBusyDelay = oList.getBusyIndicatorDelay();

				//this._oGroupSortState = new GroupSortState(oViewModel, grouper.groupUnitNumber(this.getResourceBundle()));
				this.busy = busyInd;
				this.busy.open();
				
				this._oList = oList;
				// keeps the filter and search state
				this._oListFilterState = {
					aFilter : [],
					aSearch : []
				};

				this.setModel(oViewModel, "masterView");
				oList.attachEventOnce("updateFinished", function(){
					//oViewModel.setProperty("/delay", iOriginalBusyDelay);
				});

				this.getView().addEventDelegate({
					onBeforeFirstShow: function () {
						this.getOwnerComponent().oListSelector.setBoundMasterList(oList);
						}.bind(this)
					}); 
				
				var a = this.getRouter().getRoute("master");
				
				//this.getRouter().getRoute("master").attachPatternMatched(this._onMasterMatched, this);
				this.getRouter().getRoute("master").attachPatternMatched(this._onObjectMatched, this);
				this.getRouter().getRoute("objectMDR").attachPatternMatched(this._onObjectMatched, this);
				this.getRouter().attachBypassed(this.onBypassed, this);
			},

			/* =========================================================== */
			/* event handlers                                              */
			/* =========================================================== */
			onUpdateFinished : function (oEvent) {
				this._updateListItemCount(oEvent.getParameter("total"));
				this.byId("pullToRefresh").hide();
			},
			onAcceptButton: function(){
				console.log("accept Master");
				var model = this.getView().getModel();
			},
			/**
			 * Event handler for refresh event. Keeps filter, sort
			 * and group settings and refreshes the list binding.
			 * @public
			 */
			onRefresh : function () {
				this._oList.getBinding("items").refresh();
			},
			/**
			 * Event handler for the list selection event
			 * @param {sap.ui.base.Event} oEvent the list selectionChange event
			 * @public
			 */
			onSelectionChange : function (oEvent) {
				// get the list item, either from the listItem parameter or from the event's source itself (will depend on the device-dependent mode).
				this._showDetail(oEvent.getParameter("listItem") || oEvent.getSource());
			},
			/**
			 * Event handler for the bypassed event, which is fired when no routing pattern matched.
			 * If there was an object selected in the master list, that selection is removed.
			 * @public
			 */
			onBypassed : function () {
				this._oList.removeSelections(true);
			},
						/**
			 * Event handler for navigating back.
			 * We navigate back in the browser historz
			 * @public
			 */
			onNavBack : function() {
				var sPreviousHash = History.getInstance().getPreviousHash(),
					oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");
	
				if (sPreviousHash !== undefined || !oCrossAppNavigator.isInitialNavigation()) {
					history.go(-1);
				} else {
					this.getRouter().navTo("worklist", {}, true);
				}
				//history.go(-1);
			},
			_createViewModel : function() {
				return new JSONModel({
					isFilterBarVisible: false,
					filterBarLabel: "",
					delay: 0,
					title: "My title", //this.getResourceBundle().getText("masterTitleCount", [0]),
					noDataText: this.getResourceBundle().getText("masterListNoDataText"),
					sortBy: "Name",
					groupBy: "None"
				});
			},
			
			/**
			 * If the master route was hit (empty hash) we have to set
			 * the hash to to the first item in the list as soon as the
			 * listLoading is done and the first item in the list is known
			 * @private
			 */
			_onMasterMatched :  function() {
				this.getOwnerComponent().oListSelector.oWhenListLoadingIsDone.then(
					function (mParams) {
						if (mParams.list.getMode() === "None") {
							return;
						}
						//var sObjectId = mParams.firstListitem.getBindingContext().getProperty("ObjectID");
						//this.getRouter().navTo("objectMDR", {objectId : sObjectId}, true);
					}.bind(this),
					function (mParams) {
						if (mParams.error) {
							return;
						}
						//this.getRouter().getTargets().display("detailNoObjectsAvailable");
					}.bind(this)
				);
			},

			/**
			 * Shows the selected item on the detail page
			 * On phones a additional history entry is created
			 * @param {sap.m.ObjectListItem} oItem selected Item
			 * @private
			 */
			_showDetail : function (oItem) {
				var bReplace = !Device.system.phone;
				this.getRouter().navTo("objectMDR", {
					objectId : this.objID,
					campId : oItem.getBindingContext().getProperty("CampaignID")
				}, bReplace);
			},

			/**
			 * Sets the item count on the master list header
			 * @param {int} iTotalItems the total number of items in the list
			 * @private
			 */
			_updateListItemCount : function (iTotalItems) {
				var sTitle;
				// only update the counter if the length is final
				if (this._oList.getBinding("items").isLengthFinal()) {
					sTitle = this.getResourceBundle().getText("masterTitleCount", [iTotalItems]);
					this.getModel("masterView").setProperty("/title", sTitle);
				}
			},
			
		_onObjectMatched: function(oEvent) {
			var sObjectId = oEvent.getParameter("arguments").objectId;
			this.objID = sObjectId;
			this.getModel().metadataLoaded().then(function() {
				var sObjectPath = this.getModel().createKey("InfoRecSet", {
					InfoRecID: sObjectId
				});
				this._bindView("/" + sObjectPath);
			}.bind(this));
		},

		_bindView: function(sObjectPath) {
			var oViewModel = this.getModel("masterView");
			var oDataModel = this.getModel();
			oViewModel.setProperty("/busy", true);
			
			var bd = this.busy;//.close();
			
			var oList = this.byId("masterListIdMD");
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
				//	change: this._onBindingChange.bind(this),
					dataRequested: function() {
						oDataModel.metadataLoaded().then(function() {
							oViewModel.setProperty("/busy", true);
						});
					},
					dataReceived: function() {
						oViewModel.setProperty("/busy", false);
						bd.close();
					}
				}
			});

		}
			
		});

	}
);