sap.ui.define([
		"portaltest/controller/BaseController",
		"sap/ui/model/json/JSONModel",
		"sap/ui/core/routing/History",
		"portaltest/model/formatter",
		"sap/ui/model/Filter",
		"sap/ui/model/FilterOperator",
		'sap/m/MessageToast'
	],
	function(BaseController, JSONModel, History, formatter, Filter, FilterOperator, MessageToast) {
		"use strict";
		return BaseController.extend("portaltest.controller.fragments_views.upCollections", {
			formatter: formatter,
			onInit: function() {
				//console.log("init Collections");	
				var oModel = new JSONModel(jQuery.sap.getModulePath("portaltest.localService", "/itemsDOC.json"));
				this.getView().setModel(oModel, "dcs");

				// Flag to track if the upload of the new version was triggered by the Upload a new version button.
				this.bIsUploadVersion = false;
			},
			
			
			
			onPressTest2: function(oEvent) {
				sap.m.MessageToast.show("Fragment button own controller");
			},
			onPressTest3: function(oEvent) {
				sap.m.MessageToast.show("Fragment button own controller HTML");
			},
			onPressTest4: function(oEvent) {
				sap.m.MessageToast.show("Fragment button own controller JS");
			},
			
	//************************************************************
	// ON VALUE HELP
	//************************************************************
			onValueHelpRequest: function() {
			/*	var that = this;
				var oValueHelpDialog = new sap.ui.comp.valuehelpdialog.ValueHelpDialog({
					basicSearchText: this.theTokenInput.getValue(),
					title: "Company",
					supportMultiselect: false,
					supportRanges: false,
					supportRangesOnly: false,
					key: this.aKeys[0],
					descriptionKey: this.aKeys[1],
					stretch: sap.ui.Device.system.phone
				});
			
			*/

			},
	//************************************************************
	// UPLOAD COLLECTION
	//************************************************************
			onChange: function(oEvent) {
				var oUploadCollection = oEvent.getSource();
				// Header Token
				var oCustomerHeaderToken = new sap.m.UploadCollectionParameter({
					name : "x-csrf-token",
					value : "securityTokenFromModel"
				});
				oUploadCollection.addHeaderParameter(oCustomerHeaderToken);
			},
			onFileSizeExceed : function(oEvent) {
				MessageToast.show("FileSizeExceed event triggered.");
			},
			onTypeMissmatch : function(oEvent) {
				MessageToast.show("TypeMissmatch event triggered.");
			},
			onSelectChange:  function(oEvent) {
				var oUploadCollection= this.getView().byId("UploadCollection");
				oUploadCollection.setShowSeparators(oEvent.getParameters().selectedItem.getProperty("key"));
			},
			onBeforeUploadStarts: function(oEvent) {
				// Header Slug
				var oCustomerHeaderSlug = new sap.m.UploadCollectionParameter({
					name : "slug",
					value : oEvent.getParameter("fileName")
				});
				oEvent.getParameters().addHeaderParameter(oCustomerHeaderSlug);
				MessageToast.show("BeforeUploadStarts event triggered.");
			},
			onUploadTerminated: function(oEvent) {
				// get parameter file name
				var sFileName = oEvent.getParameter("fileName");
				// get a header parameter (in case no parameter specified, the callback function getHeaderParameter returns all request headers)
				var oRequestHeaders = oEvent.getParameters().getHeaderParameter();
			},
			getAttachmentTitleText: function(){
				var aItems = this.getView().byId("UploadCollection").getItems();
				return "Uploaded (" + aItems.length + ")";
			},
	 		onDownloadItem: function(oEvent){
				var oUploadCollection = this.getView().byId("UploadCollection");
				var aSelectedItems = oUploadCollection.getSelectedItems();
				if (aSelectedItems){
					for (var i = 0; i < aSelectedItems.length; i++){
						oUploadCollection.downloadItem(aSelectedItems[i], true);
					}
				} else {
					MessageToast.show("Select an item to download");
				}
			},
			onVersion: function(oEvent){
				var oUploadCollection = this.getView().byId("UploadCollection");
				this.bIsUploadVersion = true;
				this.oItemToUpdate = oUploadCollection.getSelectedItem();
				oUploadCollection.openFileDialog(this.oItemToUpdate);
			},
			onSelectionChange: function(oEvent){
				var oUploadCollection = this.getView().byId("UploadCollection");
				// If there's any item selected, sets download button enabled
				if (oUploadCollection.getSelectedItems().length > 0) {
					this.getView().byId("downloadButton").setEnabled(true);
					if (oUploadCollection.getSelectedItems().length === 1) {
						this.getView().byId("versionButton").setEnabled(true);
					} else {
						this.getView().byId("versionButton").setEnabled(false);
					}
				} else {
					this.getView().byId("downloadButton").setEnabled(false);
					this.getView().byId("versionButton").setEnabled(false);
				}
			},
			onFileTypeChange: function(oEvent) {
				var oUploadCollection = this.getView().byId("UploadCollection");
				var oFileTypesMultiComboBox = this.getView().byId("fileTypesBox");
				oUploadCollection.setFileType(oFileTypesMultiComboBox.getSelectedKeys());
			},
			updateFile: function(oNewFileParameters){
				var oData = this.getView().byId("UploadCollection").getModel("dcs").getData();
				var aItems = jQuery.extend(true, {}, oData).items;
				// Adds the new metadata to the file which was updated.
				for (var i = 0; i < aItems.length; i++) {
					if (aItems[i].documentId === this.oItemToUpdate.getDocumentId()) {
						// Uploaded by
						aItems[i].attributes[0].text = "You";
						// Uploaded on
						aItems[i].attributes[1].text = new Date(jQuery.now()).toLocaleDateString();
						// Version
						var iVersion = parseInt(aItems[i].attributes[3].text);
						iVersion++;
						aItems[i].attributes[3].text = iVersion;
					}
				}
				// Updates the model.
				this.getView().byId("UploadCollection").getModel("dcs").setData({
					"items" : aItems
				});
				// Sets the flag back to false.
				this.bIsUploadVersion = false;
				this.oItemToUpdate = null;
			},
			onUploadComplete: function(oEvent) {
			// If the upload is triggered by a new version, this function updates the metadata of the old file and deletes the progress indicator once the upload was finished.
			if (this.bIsUploadVersion) {
				this.updateFile(oEvent.getParameters());
			} else {
				var oData = this.getView().byId("UploadCollection").getModel("dcs").getData();
				var aItems = jQuery.extend(true, {}, oData).items;
				var oItem = {};
				var sUploadedFile = oEvent.getParameter("files")[0].fileName;
				// at the moment parameter fileName is not set in IE9
				if (!sUploadedFile) {
					var aUploadedFile = (oEvent.getParameters().getSource().getProperty("value")).split(/\" "/);
					sUploadedFile = aUploadedFile[0];
				}
				oItem = {
					"documentId" : jQuery.now().toString(), // generate Id,
					"fileName" : sUploadedFile,	"mimeType" : "", "thumbnailUrl" : "",	"url" : "",
					"attributes":[
						{ "title" : "Uploaded By",	"text" : "You" },
						{ "title" : "Uploaded On",	"text" : new Date(jQuery.now()).toLocaleDateString()	},
						{ "title" : "File Size",	"text" : "505000"		},
						{ "title" : "Version",		"text" : "1"	}
					]	};
				aItems.unshift(oItem);
				this.getView().byId("UploadCollection").getModel("dcs").setData({
					"items" : aItems
				});
				// Sets the text to the label
				this.getView().byId("attachmentTitle").setText(this.getAttachmentTitleText());
			}
			// delay the success message for to notice onChange message
			setTimeout(function() { MessageToast.show("UploadComplete event triggered."); }, 4000);
			//setTimeout( function() => MessageToast.show("UploadComplete event triggered.") , 4000);
		},
	//************************************************************		
	// SPLIT CONTAINER 
	//************************************************************
			onBeforeRendering: function() {
				//this.getView().byId("DSCWidthSlider").setVisible(!sap.ui.Device.system.phone);
				//this.getView().byId("DSCWidthHintText").setVisible(!sap.ui.Device.system.phone);
			},
			handleSliderChange: function(oEvent) {
				var iValue = oEvent.getParameter("value");
				this.updateControlWidth(iValue);
			},
			updateControlWidth: function(iValue) {
				var $DSCContainer = this.getView().byId("sideContentContainer").$();
				if (iValue) {
					$DSCContainer.width(iValue + "%");
				}
			},
			updateToggleButtonState: function(oEvent) {
				var oToggleButton = this.getView().byId("toggleButton"),
					sCurrentBreakpoint = oEvent.getParameter("currentBreakpoint");

				if (sCurrentBreakpoint === "S") {
					oToggleButton.setEnabled(true);
				} else {
					oToggleButton.setEnabled(false);
				}
			},
			handleToggleClick: function() {
				this.getView().byId("DynamicSideContent").toggle();
			},
			self: function() {
				return this;
			}
		});
	});