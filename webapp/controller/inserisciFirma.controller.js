sap.ui.define(
    [
        "sap/ui/core/mvc/Controller",
        "sap/m/MessageBox",
    ],
    function (BaseController, MessageBox) {
        "use strict";

        return BaseController.extend("project1.controller.inserisciFirma", {
            onInit() {
                var oModel = new sap.ui.model.json.JSONModel("../mockdata/tabPreimpNI.json");
                this.getView().setModel(oModel, "tabPreimpNI");
            },

            onBackButton: function () {
                this.getOwnerComponent().getRouter().navTo("iconTabBar2");
            },

            onConfirm: function () {
                //aggiunge dati
                MessageBox.warning("Sei sicuro di voler modificare la NI?", {
                    actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
                    emphasizedAction: MessageBox.Action.YES,
                    onClose: function (oAction) {
                        if (oAction === sap.m.MessageBox.Action.YES) {
                            MessageBox.success("Operazione eseguita con successo")
                        }
                    }
                })
            },


        });
    }
);