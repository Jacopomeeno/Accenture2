sap.ui.define(
    [
        "sap/ui/core/mvc/Controller",
        'sap/ui/model/json/JSONModel',
        'sap/ui/export/Spreadsheet',
        "sap/ui/core/library"
    ],
    /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */
    function (BaseController, JSONModel, Spreadsheet, CoreLibrary) {
        "use strict";
        var EdmType = sap.ui.export.EdmType

        var ValueState = CoreLibrary.ValueState,
            oData = {
                RevocaButtonVisible: false,
                FirmaButtonVisible: true,
            };

        return BaseController.extend("project1.controller.inserisciInvioFirma", {
            onInit() {
                var oProprietà = new JSONModel(),
                    oInitialModelState = Object.assign({}, oData);
                oProprietà.setData(oInitialModelState);
                this.getView().setModel(oProprietà);
            },

            onSelect: function (oEvent) {

                var key = oEvent.getParameters().key;

                if (key === "ListaDettagli") {
                }

                else if (key === "Workflow") {
                }

                else if (key === "Fascicolo") {
                }
            },

            onBackButton: function () {
                this.getOwnerComponent().getRouter().navTo("View1");
            },

            pressFirma: function () {
                this.getOwnerComponent().getRouter().navTo("inserisciFirma");
            },


            pressRevocaNI: function () {
                //var oProprietà = this.getView().getModel();
                this.getView().byId("editRow").setEnabled(true);
            },


        });
    }
);
