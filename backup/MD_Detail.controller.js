/*global location */
sap.ui.define([
	"portaltest/controller/BaseController",
	"sap/ui/model/json/JSONModel"
], function(BaseController, JSONModel) {
	"use strict";
	
	var comboBoxYesNo = [ new sap.ui.core.Item({ key : "yes",  text : "YES"   }),
						  new sap.ui.core.Item({  key : "no",  text : "NO"     })
						];
	
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
		}];
	return BaseController.extend("portaltest.controller.MD.MD_Detail", {
	//require("portaltest/assets/");
/* **************************************************************************************************		
		INIT 
   ************************************************************************************************** */
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
		
/* **************************************************************************************************		
		BUILD DYNAMIC SCREEN 
   ************************************************************************************************** */		
		buildDynamicScreen: function(pItemSelected, pPath) {
			//var space = new sap.ui.layout.AbsoluteLayout({width: "100px", height: "10px"});

			
			var sPath = "/CampaignSet('" + pItemSelected + "')";
			if (pPath !== undefined) sPath = pPath;
			
			var oElement = this.byId("detailContainerMDR");
			// var objectSel = this.getView().getModel().getProperty(sPath);
			
			var objectSel = undefined;
		//	do {
				var objectSel = this.getModel().getProperty(sPath);
		//	} while(objectSel === undefined )
			
			oElement.removeAllContent();
			
			if (objectSel !== undefined) {
				for(var i in objectSel.ToElements.__list) { 
					var sPath2 = "/" + objectSel.ToElements.__list[i]; 		//console.log( sPath2 );
					var objectSel2 = this.getModel().getProperty(sPath2);
					if (objectSel === undefined) return;
				
				// element Object
					switch (objectSel2.elementType) {
						case "title":
							oElement.addContent(new sap.m.Title({
								text: "{elementValueB}", titleStyle: "H3"  })
							.bindElement({path: sPath2 }).addStyleClass("sapUiSmallMargin") );
							break;
						case "input":
							oElement.addContent( new sap.ui.layout.Grid( { hSpacing: 2,defaultSpan:"L6 M6 S10",
							content:[
								new sap.m.Label({ text: "{description}" }) ,
								new sap.m.Input({ value: "{elementValueB}" }) 
							]}).bindElement({path: sPath2 })  );
						//	oElement.addContent(space );.addStyleClass("sapUiSmallMargin") 
							break;
						case "comboBox":
							var oCombo =	new sap.m.ComboBox({
									tooltip: "this is my toolTip!",
									width: "200px", 
									selectedKey: "{elementValueB}",
									placeholder: "Select..."
									/*items  : {	path:  "ToTables",
												template:  new sap.ui.core.ListItem({text:"{value}" , key: "{column}" })
									}   /* [ new sap.ui.core.Item({ 
									               key : "yes",
									               text : "yes"
									            }),
									            new sap.ui.core.Item({
									               key : "no",
									               text : "no"
									            })
									 ]	*/
									}); //.bindElement({path: sPath2 }); //,  parameters: {expand: 'ToTable'} })
																	//"{ path: 'ToElements', parameters: {expand: 'ToTable'} }" 
							
							var method1 = this.combo1;
							if(objectSel2.elementID == "003") // if method is not initial ... 
								oCombo.attachChange(method1);
						//	else break;
								
							if(objectSel2.elementValueB === "yes ") 
								oCombo.bindItems( {	path:  "ToTables",
													template:  new sap.ui.core.ListItem({text:"{value}" , key: "{column}" })
												});
							else {	
								 oCombo.addItem(new sap.ui.core.Item({ key : "yes",  text : "YES"   }));
								 oCombo.addItem( new sap.ui.core.Item({  key : "no",  text : "NO"     }));

								//oCombo.addItem(comboBoxYesNo[0]); 
								//oCombo.addItem(comboBoxYesNo[1]); 
								
							}
							oElement.addContent( new sap.ui.layout.Grid( { hSpacing: 2,defaultSpan:"L6 M6 S10",
								content:[new sap.m.Label({ text: "{description}" }) , oCombo	]})).bindElement({path: sPath2 });
							break;
							  
							
						case "table":
							var oTable2 = new sap.ui.table.Table({  visibleRowCount: { path:"Length",  
											formatter: function(value){ return parseInt(value); } } , //"{Length}"	, (myValue == 'true')
								
								selectionMode: sap.ui.table.SelectionMode.None, //Single, MultiTonggle, None
								toolbar: new sap.m.Toolbar({content : [ 	
											new sap.m.Label({ text : "Table title..." }),new sap.m.ToolbarSpacer(),
											new sap.m.Button({	icon: "sap-icon://add",	text : "New Row",	press :this.onPress_addRow}) ,
											new sap.m.Button({	icon: "sap-icon://edit",	text : "",	press :this.onPress_editRow}) 
										] })
							});
						
							oTable2.bindElement({path: sPath2,  parameter: { expand: "ToTables"} }); 
							/*oTable2.addColumn(new sap.ui.table.Column({	label: "{elementValueB} ", 
																		template: new sap.m.Input({ value: '{value}', editable: "{Edit}" })//.bindElement({path: sPath2,  parameter: { expand: "ToTables"} }) 
																		//template: new sap.m.Input().bindProperty("value","ToTables/0/value") 
							} ) );*/
							
								var oCombo2 =	new sap.m.ComboBox({
									tooltip: "this is my toolTip!",
									width: "200px", 
									editable: { path:"Edit",  formatter: function(value){ if (value == 'true') return true; else return true; } } , 
									selectedKey: "{value}",
									placeholder: "Select...",
									items  : [ new sap.ui.core.Item({ 
									               key : "yes",
									               text : "yes"
									            }),
									            new sap.ui.core.Item({
									               key : "no",
									               text : "no"
									            })
									 ]	
									}); 

							oTable2.addColumn(new sap.ui.table.Column({	label: "{elementValueB} ", 
																		template: oCombo2
							} ) );
							
							oTable2.addColumn(new sap.ui.table.Column({	label: "Delete ",
																		visible:  "{Edit}",
																		width: "10%",
																		template: new sap.m.Button({ icon: "sap-icon://delete" , text:"{TablesID}", press: this.onPress_delRow })
							} ) );
							oTable2.bindRows("ToTables").addStyleClass("sapUiSmallMargin") ; // items="{ path: 'ToCampaignInfoRec', parameters: {expand: 'ToInfoRec'} }
							//oElement.addContent(oTable2);
							//var ii = 1; 		//TablesSet(TablesID='002',elementID='004',CampaignID='001')
							/*do{
								var iTID = ("00" + ii).slice(-3);
   								var sPath3 = "/TablesSet(TablesID='" + iTID + "'" +
												      ",elementID='" + objectSel2.elementID +  "'" +
												    ",CampaignID='"  + objectSel2.CampaignID + "')"; console.log( sPath3 );
								 var objectSel3 = this.getModel().getProperty(sPath3); 
								 if (objectSel3 === undefined) ii = -1; else{ console.log(objectSel3.value); ii++;}
							} while( ii !== -1)
							*/
							break;
							case "column":
							oTable2.addColumn(new sap.ui.table.Column({	label: objectSel2.description, //"{description} ",  //the mapping is from the row table 
																		template: new sap.m.Input({ value: '{' + objectSel2.elementValueB + '}' })
							} ) );	
							if(objectSel2.description === "end" ){	
								oElement.addContent(oTable2);
							}
							break;
					}//end switch
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
		    
	    onPrint : function(oEvent) {
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
	                
	            document.body.innerHTML =   //'<body background="./picture"'  // background can be removed 
	            							'<div style="width:100%; background-color: red;"> HI '
	            							+ 'hola <button> hello </button>' 
	            							+ '<img src="./assets/defaultImg.png" alt="HTML5 Icon" style="width:50px; height:50px;  float: left;">'
	            							+ '<img src="portaltest/assets/defaultImg.png" alt="HTML5 Icon" style="width:50px; height:50px;  float: rigth; left:20px">'
	            							+ '<p style="page-break-after:always;">page break</p>'
	            							+ sTargetContent
	            							+ '</div>';
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
		combo1: function(oEvent){
			//console.log("Hola Combo1 ");	
			var oElement = this.getModel().getProperty("/CampDynSet(CampaignID='001',elementID='004')");
			oElement.Edit   = !oElement.Edit; 
			
			if(oEvent.getSource().getSelectedKey() == "yes" && oElement.Edit == false )
			{	oElement.Edit = true; 
				this.getModel().update("/CampDynSet(CampaignID='001',elementID='004')", oElement);
			}else if(oEvent.getSource().getSelectedKey() == "no" && oElement.Edit == true )
			{	oElement.Edit = false;
				this.getModel().update("/CampDynSet(CampaignID='001',elementID='004')", oElement);
			}
		},
		//dynamic table controller
		onPress_editRow: function(oItem){
			var tTabletmp	= oItem.getSource().getParent().getParent() ;
			var oPath		= tTabletmp.getBindingContext();//.sPath;
			var oModel		= tTabletmp.getModel();
			var oElement    = oModel.getProperty(oPath.sPath);
			oElement.Edit   = !oElement.Edit; 
			//oModel.setProperty(oPath.sPath, oElement,false);
			oModel.update(oPath.sPath, oElement);
		},
		onPress_delRow: function(oItem){
			//var tTabletmp	= oItem.getSource().getParent().getParent() ;
			var sPath		= oItem.getSource().getBindingContext().sPath;
			var oModel		= this.getModel();
			oModel.remove(sPath);
		},
		onPress_addRow: function(oItem){ 	
			//console.log("Add row");
			//var row = new sap.ui.table.Row({});
			//oItem.getSource().getParent().getParent().addRow(row);
			var tTabletmp	= oItem.getSource().getParent().getParent() ;
			var oPath		= tTabletmp.getBindingContext();//.sPath;
			var oModel		= tTabletmp.getModel(); //.getProperty("/rows");
			//var oRows = oModel.getProperty("/rows");
			//var oData = oModel.getProperty(sPath);
			
			var oElement = oModel.getProperty( oPath.sPath);
			oElement.Length = parseInt(oElement.Length) + 1; 
			oElement.Length = "" + oElement.Length; 
			
			//Error - the update only works the first time! fix: https://archive.sap.com/discussions/thread/3730383
			//still error! 
			
			//tTabletmp.getVisi
			
			
			//oModel.setProperty(oPath.sPath, oElement);
			//tTabletmp.setModel(oModel);
			//oModel.submitChanges();
			
			/*var sPathIDs = oPath.sPath.slice(11,60);
			sPathIDs = sPathIDs.replace(/'/g, "");
			sPathIDs = sPathIDs.replace(")", "");
			var oObjs = sPathIDs.split(",");
			oObjs[0] = oObjs[0].split("=");
			oObjs[1] = oObjs[1].split("="); */
			
			var example = {
							TablesID	: oElement.Length, //"003",
							elementID	: oElement.elementID, //oObjs[1][1],
							CampaignID	: oElement.CampaignID, //oObjs[0][1],
							columnData  : "NewC ",
							value   	: "New"
						}; 

			// create new entry in the model
			oModel.create("/TablesSet",  example, null);

			/*oModel.createEntry("/TablesSet", {
				properties: example,
				success: this._onCreateSuccess//.bind(this)
			});*/
			/*
			var oColumns = oModel.getProperty("/columns");//("/rows/0");
			for(var i in oColumns){
				//oRow[i] = "";
				example[oColumns[i].columnName] = "put your text here";
			}
			
			oRows.push(example);
			//oRows.push(oRow);
			oModel.setProperty("/rows", oRows);
			
			var oModelDT = oItem.getSource().getParent().getParent().getModel("detailView");
			var dataDT = oModelDT.getData();
			dataDT.Tablelength++;
			oModelDT.setData(dataDT);*/
			
		},
		_onCreateSuccess: function (oProduct) {
			//console.log("success");
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
					expand: "ToElements"	
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