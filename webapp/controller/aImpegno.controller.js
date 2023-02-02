sap.ui.define([
        "./BaseController",
        
    ],
    function (BaseController) {
        "use strict";

        return BaseController.extend("project1.controller.aImpegno", {
            onInit() {
            },
            onBackButton: function(){
                this.getOwnerComponent().getRouter().navTo("iconTabBar");
            },

            onSearch: function (oEvent) {
                // this.onCallHeader()
        
                var that = this;
                this.getView().byId("HeaderNIAssImp").setVisible(true);
        
                var that = this;
                var oMdlAImp = new sap.ui.model.json.JSONModel();
                this.getOwnerComponent().getModel().read("/HeaderNISet", {
                    success: function (data) {
                        oMdlAImp.setData(data.results);
                        that.getView().getModel("temp").setProperty('/HeaderNISet', data.results)
                    },
                    error: function (error) {
                        var e = error;
                    }
                });
        
                this.getOwnerComponent().setModel(oMdlAImp, "HeaderNIAssImp");
                //sap.ui.getCore().TableModel = oMdlW;
        
            }
        });
    },

    
);