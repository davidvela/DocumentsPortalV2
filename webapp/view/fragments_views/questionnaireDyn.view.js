sap.ui.jsview("portaltest.view.fragments_views.questionnaireDyn", {
    getControllerName: function() {
        return "portaltest.controller.fragments_views.questionnaireDyn";
    },	createContent: function(oController) {
		 
		    // QUESTION
				
				  
		    // SUBQUESTION 
		    
		    // INPUTS -
		    
		    var oTable =  new sap.m.Table({ headerText : "Dynamic Table", 
					columns : [ 
					            new sap.m.Column({ id : "idPNum", 	header: new sap.m.Label({text: "Project Number"}), width: "5%",}),
								//new sap.m.Column({ id : "idPName", 	header: new sap.m.Label({text: "Project Name "}),  width: "40%",}),
								//new sap.m.Column({ id : "idPPers", 	header: new sap.m.Label({text: "Created Person "}),  width: "10%",}),
							]
					//select : [ oController.onNextTapED, oController ]
				});
		    oTable.bindAggregation("items", {
			        path: "projects>/elements",
			        template: new sap.m.ColumnListItem({
			            cells: [   new sap.m.Label({ text: "{projects>projectId}" }),
			                       new sap.m.Label({ text: "{projects>projectName}" }),
			                       new sap.m.Label({ text: "{projects>creator}" }),
			                       new sap.m.Label({ text: "{projects>creationDate}" }),
			                       new sap.m.ObjectStatus({ text: "{projects>statusTxt}", state: "{projects>status}"})
			            	   ]
			        })
			    });			
    		
    		
    		
    		
    		
    		
    		
    		
    		
    		
    		
    		var oButton = new sap.m.Button( { text : "Questionnaire JSview2!",press :  [oController.onPressTest2, oController] });
    		var oLayout = new sap.m.VBox( { items:[oButton]   });
			//centerLayoutSym.setAlignItems("Center");
			//centerLayoutSym.setJustifyContent("Center");
    		
    		return oLayout ;
    	}	
	});