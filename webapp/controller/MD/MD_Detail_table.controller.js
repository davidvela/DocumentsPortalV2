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
		department: "Cricket",
		edit      : true
	}, {
		firstName: "Lionel",
		lastName: "Messi",
		department: "Football",
		edit      : true
	}, {
		firstName: "Lionel",
		lastName: "Messi",
		department: "Football",
		edit      : false
	}, {
		firstName: "Mohan",
		lastName: "Lal",
		department: "Film",
		edit      : true

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
			this.buildDynamicScreen();
		},
		onPress_editAll: function(oItem){  //console.log("edit all");
			var option = true;
			if(oItem.getSource().getText() !== "Edit All"){
				option = false; oItem.getSource().setText("Edit All")	;
			} else oItem.getSource().setText( "Block All")	;
			
			var oModel = oItem.getSource().getParent().getParent().getModel(); //.getProperty("/rows");
			var oRows = oModel.getProperty("/rows");
			for(var i in oRows){
				oRows[i].edit = option ;
			}
			
			oModel.setProperty("/rows", oRows);

		}	,
		onPress_editRow: function(oItem){  //console.log("edit row");
				var tbl = oItem.getSource().getParent().getParent();
			    var idx = tbl.getSelectedIndex();
		        
		        var oModel = oItem.getSource().getParent().getParent().getModel(); //.getProperty("/rows");
			
		        if (idx !== -1) {
				  var oRow = oModel.getProperty("/rows/"+idx);
				  oRow.edit = !oRow.edit;
				  oModel.setProperty("/rows/"+idx, oRow);

		          //sap.m.MessageToast.show(JSON.stringify(removed[0]) +  'is removed');
		          //tbl.setSelectedIndex(-1);
		        } else {
		          sap.m.MessageToast.show('Please select a row');
		        }
			
		}	,
		onPress_removeRow: function(oItem){  //console.log("Remove row");
				var tbl = oItem.getSource().getParent().getParent();
			    var idx = tbl.getSelectedIndex();
		        
		        if (idx !== -1) {
		          var m = tbl.getModel();
		          var data = m.getData();
		          var removed = data.rows.splice(idx, 1);
		          m.setData(data);
		          sap.m.MessageToast.show(JSON.stringify(removed[0]) +  'is removed');
		          tbl.setSelectedIndex(-1);
		        } else {
		          sap.m.MessageToast.show('Please select a row');
		        }
			
		}	,
		onPress_addRow: function(oItem){ 	
			//console.log("Add row");
			//var row = new sap.ui.table.Row({});
			//oItem.getSource().getParent().getParent().addRow(row);
			var oModel = oItem.getSource().getParent().getParent().getModel(); //.getProperty("/rows");
			var oRows = oModel.getProperty("/rows");
			
			var example = {}; //= { firstName: "jose", 	lastName: "Lal",	department: "Film"  };
			var oColumns = oModel.getProperty("/columns");//("/rows/0");
			for(var i in oColumns){
				//oRow[i] = "";
				example[oColumns[i].columnName] = "put your text here";
			}
			
			oRows.push(example);
			//oRows.push(oRow);
			oModel.setProperty("/rows", oRows);

		},
		buildDynamicScreen: function( ) {
			var oElement = this.byId("detailContainerMDRT");
			oElement.removeAllContent();
			var length = 10; // rowData.length;
			var oTable = new sap.ui.table.Table({  
						visibleRowCount: length ,	
						selectionMode: sap.ui.table.SelectionMode.Single, //Single, MultiTonggle, None
						toolbar: new sap.m.Toolbar({content : [
																	new sap.m.Label({
																		text : "Table title..."
																	}),
																	new sap.m.ToolbarSpacer(),		
																	new sap.m.Button({
																		icon: "sap-icon://edit",
																		//text: "All",
																		text : "Edit All Rows",
																		press :this.onPress_editAll}),
																	new sap.m.Button({
																		icon: "sap-icon://edit",
																		text : "Edit Row",
																		press :this.onPress_editRow}),
																	new sap.m.Button({
																		icon: "sap-icon://add",
																		text : "New Row",
																		press :this.onPress_addRow}),
																	new sap.m.Button({
																		icon: "sap-icon://delete",
																		text : "Remove Row",
																		type : "Reject",
																		press : this.onPress_removeRow
																		/* function() {
																			//oList.getHeaderToolbar().destroy();
																			console.log("ola");
																		}*/
																	})
																]			})  
						
					}).addStyleClass('alternate-color');

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
						
						var template = new sap.m.Input({value: '{' + columnName  + '}', editable: "{edit}"});
						
						return new sap.ui.table.Column({
							label: columnName,
							template: template //columnName
						});
					});

					oTable.bindRows("/rows");
					oElement.addContent(oTable);
					
					this.buildRest(); 
					
		},
		
		buildRest: function(){
		
			var oElement = this.byId("detailContainerMDRT");
			//*****
			//INPUT
			//****
			oElement.addContent(new sap.m.Input({
						value: "{CampaignName}"
					}));
						oElement.addContent(new sap.m.Button({
						text: "IoT is cool"
					}));
			//*****
			//COMBOBOX
			//****
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
			//*****
			//LABEL
			//****				
				oElement.addContent(new sap.m.Label({
					text: "type: {CampaignType}"
				}));
			//*****
			//IMG
			//****				
				oElement.addContent(new sap.m.Image({
					src: "../assets/defaultImg.png", width: "50px"
				}));	
					
					
		}

	});

});