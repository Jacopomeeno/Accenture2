sap.ui.define([
    "./BaseController",
    "sap/ui/core/routing/History",

],
    function (BaseController, History) {
        "use strict";
        return BaseController.extend("project1.controller.aImpegno2", {
            onBackButton: function () {
                window.history.go(-1);
            },
        })
    }
)