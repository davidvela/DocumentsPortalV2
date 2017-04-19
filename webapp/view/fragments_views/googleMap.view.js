sap.ui.jsview("portaltest.view.fragments_views.googleMap", {
    // getControllerName: function() {
    //     return "portaltest.controller.fragments_views.upCollections";
    // },

    	createContent: function(oController) {
    		
    		jQuery.sap.require("sap.ui.model.json.JSONModel");
    		jQuery.sap.require("portaltest.controls.googleMap");
			var oModel = new sap.ui.model.json.JSONModel({
				longitude: -122.5,
				latitude: 37.7,
				zoom: 10
			});
			sap.ui.getCore().setModel(oModel);
			
			
			// PART 2: instantiate Map control, bind properties and place it onto the page
			var myMap = new	portaltest.controls.googleMap({
				longitude:"{/longitude}", 
				latitude:"{/latitude}",
				zoom: "{/zoom}"
			}); 
    		
    		var myMap2 = new	portaltest.controls.googleMap({
				longitude:"-122.5", 
				latitude:" 37.7",
				zoom: "10"
			}); 
    		
    		return myMap;
    		
    		// });
    	
    	}	
	});