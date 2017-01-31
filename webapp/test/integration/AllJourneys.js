jQuery.sap.require("sap.ui.qunit.qunit-css");
jQuery.sap.require("sap.ui.thirdparty.qunit");
jQuery.sap.require("sap.ui.qunit.qunit-junit");
QUnit.config.autostart = false;

sap.ui.require([
		"sap/ui/test/Opa5",
		"portaltest/test/integration/pages/Common",
		"sap/ui/test/opaQunit",
		"portaltest/test/integration/pages/Worklist",
		"portaltest/test/integration/pages/Object",
		"portaltest/test/integration/pages/NotFound",
		"portaltest/test/integration/pages/Browser",
		"portaltest/test/integration/pages/App"
	], function (Opa5, Common) {
	"use strict";
	Opa5.extendConfig({
		arrangements: new Common(),
		viewNamespace: "portaltest.view."
	});

	sap.ui.require([
		"portaltest/test/integration/WorklistJourney",
		"portaltest/test/integration/ObjectJourney",
		"portaltest/test/integration/NavigationJourney",
		"portaltest/test/integration/NotFoundJourney",
		"portaltest/test/integration/FLPIntegrationJourney"
	], function () {
		QUnit.start();
	});
});