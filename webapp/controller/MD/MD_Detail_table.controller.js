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
			this.setModel(oViewModel, "detailView");
		}

	});

});