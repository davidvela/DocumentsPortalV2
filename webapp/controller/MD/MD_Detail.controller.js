/*global location */
sap.ui.define([
	"portaltest/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"portaltest/model/formatter"
], function(BaseController, JSONModel, formatter) {
	"use strict";
	var columnData = [{
			columnName: "firstName"
	}, {	columnName: "lastName"
	}, {	columnName: "department"
	}];
	var rowData = [{
		firstName: "Sachin",
		lastName: "Tendulkar",
		department: "Cricket"
	}];
	return BaseController.extend("portaltest.controller.MD.MD_Detail", {
		//require("portaltest/assets/");
		
		formatter: formatter,

		/* **************************************************************************************************		
			INIT 
		************************************************************************************************** */
		onInit: function() {
			var oViewModel = new JSONModel({
				busy: false,
				delay: 0,
				lineItemListTitle: this.getResourceBundle().getText("detailLineItemTableHeading")
			});
			this.getRouter().getRoute("objectMDR").attachPatternMatched(this._onObjectMatched, this);
			this.setModel(oViewModel, "detailView");
			this.getOwnerComponent().getModel().metadataLoaded().then(this._onMetadataLoaded.bind(this));

		},

		/* **************************************************************************************************		
				BUILD DYNAMIC SCREEN 
		   ************************************************************************************************** */
		buildBasisTypes: function(pObj) {
			var sElementType; 
			if (pObj.elementType === "column" || pObj.elementType === "mColumn") sElementType = pObj.columnSubType;
			else sElementType = pObj.elementType;
									
			switch (sElementType) {
				case "title":
					return new sap.m.Title({id: pObj.description,	text: "{elementValueB}",	titleStyle: "H3"	});
				case "inputC":
						return new sap.m.Input({value:  '{' + pObj.elementValueB + '}'
							,editable: {	path: "value4", formatter: formatter.toBoolean	}	//row level
							//,placeholder: '{' + pObj.elementValueB + '}'
						});
				case "input":
					var oInput = new sap.m.Input({value: "{elementValueB}",
									editable: {	path: "Edit", formatter: formatter.toBoolean},
									required : {	path: "required", formatter: formatter.toBooleanF}		
					});
					if (pObj.required === "true") {
						oInput.attachChange( this.onEmptyValidation);
					}
					return new sap.ui.layout.Grid({	hSpacing: 2, defaultSpan: "L6 M6 S10",
						content: [	new sap.m.Label({text: "{description}" , labelFor: oInput }),
									oInput
								] });
				case "maskInput":
					return new sap.ui.layout.Grid({	hSpacing: 2, defaultSpan: "L6 M6 S10",
						content: [	new sap.m.Label({text: "{description}"		}),
									new sap.m.MaskInput({value: "{elementValueB}", 
									mask: "{mask}", placeholderSymbol: "_", placeholder: "{placeHolder}"})
								] });				 
				case "comboBox":
					var oCombo ;
					if (pObj.elementType === "column") 
					oCombo = new sap.m.ComboBox({	tooltip: "this is my toolTip!",	width: "200px",
						selectedKey: '{' + pObj.elementValueB + '}',	placeholder: "Select..."
						//,editable: {	path: "Edit", formatter: formatter.toBoolean}	per row!
					});
					else
					oCombo = new sap.m.ComboBox({	tooltip: "this is my toolTip!",	width: "200px",
						selectedKey: "{elementValueB}",	placeholder: "Select..."
						//,editable: {	path: "Edit", formatter: formatter.toBoolean}	
					});
				
					var method1;
					//if(pObj.method !== undefined) 
					if (pObj.elementID === "003") {
						method1 = this.combo1;
						oCombo.attachChange(method1);
					}
					
					switch (pObj.subType) {
						case "table":
							oCombo.bindItems({	path: "ToTables",	
							template: new sap.ui.core.ListItem({	text: "{value2}",	key: "{value1}" }) });
						break;
						case "cbYESNO":
							oCombo.addItem(new sap.ui.core.Item({	key: "yes",	text: "YES"	}));
							oCombo.addItem(new sap.ui.core.Item({	key: "no",	text: "NO"	}));
						break;
					}
					return oCombo;
				case "table":
					var oTable2 = new sap.ui.table.Table({
						visibleRowCount: {	path: "length",	formatter: formatter.toInt},
						selectionMode: sap.ui.table.SelectionMode.Single, //Single, MultiTonggle, None
						toolbar: new sap.m.Toolbar({
							content: [
								new sap.m.Label({ text: "{description}"	}), 
								new sap.m.ToolbarSpacer(),
								new sap.m.Button({	icon: "sap-icon://add",	 text: "New Row",	press: this.onPress_addRow	}),
								new sap.m.Button({	icon: "sap-icon://edit", text: "",	press: this.onPress_editRow })
							]	})
					});	
					oTable2.addColumn(new sap.ui.table.Column({label: "Delete ",	visible: "{Edit}", width: "10%", 
						template: new sap.m.Button({	icon: "sap-icon://delete",	text: "{tablesID}", press: this.onPress_delRow	})
					}));
					oTable2.bindRows("ToTables").addStyleClass("sapUiSmallMargin"); 
					return oTable2;
			}
		},
		buildDynamicScreen: function(pItemSelected, pPath) {
			//var space = new sap.ui.layout.AbsoluteLayout({width: "100px", height: "10px"});
			var sPath = "/CampaignSet('" + pItemSelected + "')";
			if (pPath !== undefined) sPath = pPath;

			var oElement = this.byId("detailContainerMDR");
			var objectSel = undefined;
			objectSel = this.getModel().getProperty(sPath);
			oElement.removeAllContent();

			if (objectSel !== undefined) {
				
				for (var i in objectSel.ToElements.__list) {
					var sPath2 = "/" + objectSel.ToElements.__list[i]; //console.log( sPath2 );
					var objectSel2 = this.getModel().getProperty(sPath2);

					switch (objectSel2.elementType) {
						case "title":
							oElement.addContent(this.buildBasisTypes(objectSel2).bindElement({	path: sPath2	}).addStyleClass("sapUiSmallMargin"));
							break;
						case "input":
							oElement.addContent(this.buildBasisTypes(objectSel2).bindElement({	path: sPath2  }));
							break;
						case "maskInput":
							oElement.addContent(this.buildBasisTypes(objectSel2).bindElement({	path: sPath2  }));
							break; 
						case "comboBox":
							oElement.addContent(	
								new sap.ui.layout.Grid({	hSpacing: 2,	defaultSpan: "L6 M6 S10",
								content: [	new sap.m.Label({	text: "{description}"	}) ,
											this.buildBasisTypes(objectSel2)
										] }).bindElement({ path: sPath2	})
								);
							break;
						case "table":
							var intTable = 0;
							var oTables = [];
							
							oTables[intTable] =  this.buildBasisTypes(objectSel2).bindElement({	path: sPath2	});
							if( objectSel2.required === '2'){
								intTable = 1;
								oTables[intTable] =  this.buildBasisTypes(objectSel2).bindElement({	path: sPath2	});
							}
							intTable = 0;
							
							
							// test to get the items
							///CampDynSet(CampaignID='001',elementID='004')/ToTables"  //objectSel2.ToTables.__deferred.uri
					var oItems= this.getModel().getProperty( "/CampDynSet(CampaignID='001',elementID='004')/ToTables" ,null, {"$expand": "ToTables"}, true,
				                     function(response) {console.log(response); } ,
				                     function() {console.log('error occured');  }
				                 );
							
							
							break;
						case "column":
							if (objectSel2.description === "end") {
								oElement.addContent(oTables[intTable]);
								intTable = 1;
							} else { 
							   oTables[intTable].addColumn(new sap.ui.table.Column({
								label: objectSel2.description, 	template: this.buildBasisTypes(objectSel2) }));
							}
							break;
						case "mTable":
								var oTableM = new sap.m.Table({	headerText : "{description}"  });
								
								var oTableTemp = new sap.m.ColumnListItem({  cells: [      ]   });
								oTableM.bindAggregation("items", {path: "ToTables", template: oTableTemp });
							    
   								oTableM.bindElement({path: sPath2, parameter: {	expand: "ToTables"}}).addStyleClass("sapUiSmallMargin");
							break;
						case "mColumn":
							if (objectSel2.description === "end") {
								oElement.addContent(oTableM);
							} else  {
 							   oTableM.addColumn(new sap.m.Column({  header:new sap.m.Label({ text:  objectSel2.description })   }) );
 							   oTableTemp.addCell( this.buildBasisTypes(objectSel2)    );
 							   //oTableTemp.addCell(  new sap.m.Label({ text: "{value1}" })   );
							   //template: 	this.buildBasisTypes(objectSel2) }));
							}
							break;
					} //end switch
				}

			}

			if (objectSel === undefined) return;
			switch (objectSel.CampaignType) {
				case "Application":
					/*var view = new sap.ui.core.mvc.XMLView({
						viewName: "portaltest.view.MD.MD_Detail_chapter1",
						type: "XML"
					}); 
					//view.bindElement({path: sPath, parameters: {expand: "ToElements"	}});
					oElement.addContent(view	);*/
					break;
				case "IoT":
					oElement.addContent(new sap.ui.core.mvc.XMLView({
						viewName: "portaltest.view.MD.MD_Detail_chapter1",
						type: "XML"
					}));
					oElement.addContent(new sap.ui.core.mvc.XMLView({
						//	viewName: "portaltest.view.MD.MD_Detail_table",
						viewName: "portaltest.view.fragments_views.questionnaire",
						type: "XML"
					}));

					break;
				case "Legacy":
					oElement.addContent(new sap.ui.core.mvc.XMLView({
						viewName: "portaltest.view.MD.MD_Detail_table",
						type: "XML"
					}));
					var length = rowData.length;
					var oTable = new sap.ui.table.Table({
						visibleRowCount: length
					});
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
					var ot1 = oTable;
					//var shallowCopy = { ...oTable }; // ES6  not working operator ...
					//var newObject = new sap.ui.table.Table({  visibleRowCount: length  		});
					//newObject = jQuery.extend(true, {}, oTable);
					//newObject = JSON.parse(JSON.stringify(oTable));

					//oElement.addContent(newObject);
					oElement.addContent(oTable);

					break;
				default:
			}
		},

		//***************************		
		// insert button
		/*
		var oComboBox2 = new sap.ui.commons.ComboBox("ComboBox2", {tooltip:"City", displaySecondaryValues:true, value:"Walldorf", "association:listBox" : oListBox1});
		// Create a Textfield to visualize the CHANGE event
		var oTextField1 = new sap.ui.commons.TextField("TextField1", {tooltip:"Value of Combobox", editable:false, value:oComboBox2.getValue()});
		oComboBox2.attachChange(function(){oTextField1.setValue(oComboBox2.getValue());});
		*/
		//**************************
		onMenuAction: function(oEvent) {
			var oItem = oEvent.getParameter("item");
			var oElement = this.byId("DynamicScrMD");

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
			/* 	sItemPath = "";
			while (oItem instanceof sap.m.MenuItem) {
				sItemPath = oItem.getText() + " > " + sItemPath;
				oItem = oItem.getParent();
			}
			sItemPath = sItemPath.substr(0, sItemPath.lastIndexOf(" > "));
			sap.m.MessageToast.show("Action triggered on item: " + sItemPath); */
		},
		//***************************		
		//***************************		
		/* =========================================================== */
		/* event handlers                                              */
		/* =========================================================== */
		//***************************		
		//***************************		
		onPress: function(oEvent) {
			this.getRouter().navTo("objectMD", {
				objectId: "001"
			}); // oItem.getBindingContext().getProperty("InfoRecID") });			
		},
		onPressRefresh: function(oEvent) {
			var path = this.getView().getBindingContext().getPath();
			this.buildDynamicScreen("dummy", path);
		},

		onPrint: function(oEvent) {
			//require("portaltest/assets/defaultImg.png");

			var oTarget = this.getView(),
				// sTargetId = oEvent.getSource().data("targetId");
				sTargetId = oEvent.getSource().getText();

			if (sTargetId === "PrintTab") {
				oTarget = oTarget.byId("detailContainerMDR");
			}

			if (oTarget) {
				var $domTarget = oTarget.$()[0],
					sTargetContent = $domTarget.innerHTML,
					sOriginalContent = document.body.innerHTML;

				document.body.innerHTML = //'<body background="./picture"'  // background can be removed 
					'<div style="width:100%; background-color: red;"> HI ' + 'hola <button> hello </button>' +
					'<img src="./assets/defaultImg.png" alt="HTML5 Icon" style="width:50px; height:50px;  float: left;">' +
					'<img src="portaltest/assets/defaultImg.png" alt="HTML5 Icon" style="width:50px; height:50px;  float: rigth; left:20px">' +
					'<p style="page-break-after:always;">page break</p>' + sTargetContent + '</div>';
				// watermark - DRAFT please fill the questionnaire - not sent - empty or incomplete . 
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
		onEmptyValidation: function(oEvent){
			 if (this.getValue() === "") 
				this.setValueState(sap.ui.core.ValueState.Error);  
			else this.setValueState(sap.ui.core.ValueState.None);
		},
		combo1: function(oEvent) {
			//console.log("Hola Combo1 ");	
			var oElement = this.getModel().getProperty("/CampDynSet(CampaignID='001',elementID='004')");
			oElement.Edit = !oElement.Edit;

			if (oEvent.getSource().getSelectedKey() == "yes" && oElement.Edit == false) {
				oElement.Edit = true;
				this.getModel().update("/CampDynSet(CampaignID='001',elementID='004')", oElement);
			} else if (oEvent.getSource().getSelectedKey() == "no" && oElement.vi == true) {
				oElement.Edit = false;
				this.getModel().update("/CampDynSet(CampaignID='001',elementID='004')", oElement);
			}
		},
		onAcceptButton: function(oItem){
			//console.log("acept");
			var oModel = this.getView().getModel();
			var oElement = oModel.getProperty(this.getView().getBindingContext().sPath);
			if	(oElement !== undefined ){
				for (var i in oElement.ToElements.__list) {
					var sPath2 = "/" + oElement.ToElements.__list[i]; 
					var objectSel2 = this.getModel().getProperty(sPath2);
					
					
					
				}
			}
			
			var element = this.getView().byId("titleID1"); 
		},
		//dynamic table controller
		onPress_editRow: function(oItem) {
			var tTabletmp = oItem.getSource().getParent().getParent();
			var oPath = tTabletmp.getBindingContext(); //.sPath;
			var oModel = tTabletmp.getModel();
			var oElement = oModel.getProperty(oPath.sPath);
			oElement.Edit = !oElement.Edit;
			//oModel.setProperty(oPath.sPath, oElement,false);
			oModel.update(oPath.sPath, oElement);
		},
		onPress_delRow: function(oItem) {
			//var tTabletmp	= oItem.getSource().getParent().getParent() ;
			var sPath = oItem.getSource().getBindingContext().sPath;
			var oModel = this.getModel();
			//oModel.remove(sPath);
			var oElement = oModel.getProperty(sPath);
			if(oElement.value4 === "true") oElement.value4 = "false";
			else oElement.value4 = "true";
			oModel.update(sPath, oElement);

		},
		onPress_addRow: function(oItem) {
			//console.log("Add row");
			//var row = new sap.ui.table.Row({});
			//oItem.getSource().getParent().getParent().addRow(row);
			var tTabletmp = oItem.getSource().getParent().getParent();
			var oPath = tTabletmp.getBindingContext(); //.sPath;
			var oModel = tTabletmp.getModel(); //.getProperty("/rows");
			//var oRows = oModel.getProperty("/rows");
			//var oData = oModel.getProperty(sPath);

			var oElement = oModel.getProperty(oPath.sPath);
			oElement.length = parseInt(oElement.length) + 1;
			oElement.length = "" + oElement.length;
			
			 var idx = tTabletmp.getSelectedIndex();
		     var example = {};
		     if (idx !== -1) { 		     // copy row
		     	var rows = tTabletmp.getRows();
		    	var row = rows[idx];
		    	
		    	if	(row !== undefined)
		    		var oRPath = row._getBindingContext();
		    		var oSElement = oModel.getProperty(oRPath.sPath);	
		    		example = {
		    			CampainID: oSElement.CampainID, //typo in the model =S
						elementID: oSElement.elementID, //oObjs[1][1],
						tablesID: oElement.length, //"003",
						value1: oSElement.value1,
						value2: oSElement.value2,
						value3: oSElement.value3,
						value4: oSElement.value4,
						value5: oSElement.value5,
						value6: oSElement.value6,
						value7: oSElement.value7
		    		}; 
		     	
		     }else{
				example = {
					CampainID: oElement.CampaignID, //typo in the model =S
					//CampaignID: oElement.CampaignID, //oObjs[0][1],
					elementID: oElement.elementID, //oObjs[1][1],
					tablesID: oElement.length, //"003",
					value1: "NewC ",
					value2: "New",
					value3: "New",
					value4: "New",
					value5: "New",
					value6: "New",
					value7: "New"
				};
		     }
			// create new entry in the model
			oModel.create("/TablesSet", example, null);

			/*oModel.createEntry("/TablesSet", {
				properties: example,
				success: this._onCreateSuccess//.bind(this)
			});		_onCreateSuccess: function (oProduct) {
			//console.log("success");
			},*/

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
				parameters: {
					expand: "ToElements,ToCampaignInfoRec"
				},
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