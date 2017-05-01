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
				/*var sObjectPath = this.getModel().createKey("CampaignSet", {
					CampaignID: "001"//sCampId
				});
			this.getView().bindElement({  // no model attached to this view... 
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
			this.setModel(oViewModel, "detailView");

		},
		buildDynamicScreen: function( ) {
			var oElement = this.byId("detailContainerMDRT");
			oElement.removeAllContent();
				var length = rowData.length;
					var oTable = new sap.ui.table.Table({  visibleRowCount: length  		});
					//var oTable = new sap.m.Table({   mob table does not have column binding!
					//	visibleRowCount: 3 visibleRowCount: 10
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

			
		}

	});

});