sap.ui.define(
    [
        "sap/ui/core/mvc/Controller"
    ],
    function (BaseController) {
        "use strict";

        return BaseController.extend("project1.controller.aImpegno", {
            onInit() {
            },
            onBackButton: function(){
                this.getOwnerComponent().getRouter().navTo("iconTabBar");
            }
        });
    }
);