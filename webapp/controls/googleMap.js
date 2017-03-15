//	<script type="text/javascript" src="http://maps.google.com/maps/api/js?sensor=false"></script>

sap.ui.core.Control.extend("portaltest.controls.googleMap", { // call the new Control type "my.GoogleMap" and let it inherit from sap.ui.core.Control
	// the control API:
	metadata: {
		properties: { // setter and getter are created behind the scenes, incl. data binding and type validation
			latitude: "float",
			longitude: "float",
			zoom: {
				type: "int",
				defaultValue: 5
			}
		}
	},

	init: function() {
		this._html = new sap.ui.core.HTML({
			content: "<div style='height:100%;width:100%;' id='" + this.getId() + "-map'></div>"
		});
	},

	// the part creating the HTML:
	renderer: function(oRm, oControl) { // static function, so use the given "oControl" instance instead of "this" in the renderer function
		oRm.write("<div style='height:400px;width:400px;margin:18px;' ");
		oRm.writeControlData(oControl); // writes the Control ID and enables event handling - important!
		oRm.write(">");
		oRm.renderControl(oControl._html);
		oRm.write("</div>");
	},

	// an event handler:
	onAfterRendering: function() {
		if (!this.initialized) { // after the first rendering initialize the map
			this.initialized = true;
			var options = {
				zoom: this.getZoom(),
				center: new google.maps.LatLng(this.getLatitude(), this.getLongitude()),
				mapTypeId: "roadmap"
			};
			this._map = new google.maps.Map(jQuery.sap.domById(this.getId() + "-map"), options);

			// for two-way binding: update position when user drags map
			var that = this;
			google.maps.event.addListener(this._map, 'center_changed', function() {
				var c = this.getCenter();
				that.setProperty("longitude", c.lng(), true);
				that.setProperty("latitude", c.lat(), true);
			});

			// same for zoom
			google.maps.event.addListener(this._map, 'zoom_changed', function() {
				that.setProperty("zoom", this.getZoom(), true);
			});

		} else {
			// after subsequent rerenderings, the map needs to get the current values set
			this._map.setCenter(new google.maps.LatLng(this.getLatitude(), this.getLongitude()));
		}

	},

	setZoom: function(zoomValue) {
		this.setProperty("zoom", zoomValue, true); // no rerendering required

		if (this.getDomRef()) { // if rendered, directly let the map zoom
			this._map.setZoom(zoomValue);
		}
		return this;
	},

	setLatitude: function(lat) {
		this.setProperty("latitude", lat, true); // no rerendering required
		if (this._map) {
			this._map.panTo(new google.maps.LatLng(this.getLatitude(), this.getLongitude()));
		}

		return this;
	}
});