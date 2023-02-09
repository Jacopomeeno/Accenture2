sap.ui.define([
    "./BaseController",
    "sap/ui/core/routing/History",

],
    function (BaseController, History) {
        "use strict";

        return BaseController.extend("project1.controller.aImpegno", {
            onInit() {
                this.setEsercizioGestione()
                this.getOwnerComponent().getModel("temp");
                this.getRouter().getRoute("aImpegno").attachPatternMatched(this._onObjectMatched, this);
            },

            _onObjectMatched: function (oEvent) {
                this.getView().bindElement(
                    "/HeaderNISet('Bukrs='" + oEvent.getParameters().arguments.campo +
                    "',Gjahr='" + oEvent.getParameters().arguments.campo1 +
                    "',Zamministr='" + oEvent.getParameters().arguments.campo2 +
                    "',ZchiaveNi='" + oEvent.getParameters().arguments.campo3 +
                    "',ZidNi='" + oEvent.getParameters().arguments.campo4 +
                    "',ZRagioCompe='" + oEvent.getParameters().arguments.campo5 + "')"
                );
                this.viewHeader(oEvent)
            },

            viewHeader: function (oEvent) {

                var header = this.getView().getModel("temp").getData().HeaderNISet
                var position = this.getView().getModel("temp").getData().PositionNISet
                for (var i = 0; i < header.length; i++) {
                    if (header[i].Bukrs == oEvent.getParameters().arguments.campo &&
                        header[i].Gjahr == oEvent.getParameters().arguments.campo1 &&
                        header[i].Zamministr == oEvent.getParameters().arguments.campo2 &&
                        header[i].ZchiaveNi == oEvent.getParameters().arguments.campo3 &&
                        header[i].ZidNi == oEvent.getParameters().arguments.campo4 &&
                        header[i].ZRagioCompe == oEvent.getParameters().arguments.campo5) {

                        var progressivoNI = header[i].ZchiaveNi
                        this.getView().byId("ProgressivoNI1").setText(progressivoNI)

                        var dataRegistrazione = header[i].ZdataCreaz
                        var dataNuova = new Date(dataRegistrazione),
                            mnth = ("0" + (dataNuova.getMonth() + 1)).slice(-2),
                            day = ("0" + dataNuova.getDate()).slice(-2);
                        var nData = [dataNuova.getFullYear(), mnth, day].join("-");
                        var nDate = nData.split("-").reverse().join(".");
                        this.getView().byId("data1").setText(nDate)

                        var strAmmResp = header[i].Fistl
                        this.getView().byId("SAR1").setText(strAmmResp)

                        var PF = header[i].Fipex
                        this.getView().byId("PF1").setText(PF)

                        var oggSpesa = header[i].ZoggSpesa
                        this.getView().byId("oggSpesaNI1").setText(oggSpesa)

                        var mese = header[i].Zmese
                        this.getView().byId("mese1").setText(mese)

                        var comp = position[i].ZcompRes
                        if(comp=='C') var n_comp='Competenza'
                        if(comp='R') var n_comp='Residui'
                        this.getView().byId("comp1").setText(n_comp)

                        var statoNI = header[i].ZcodiStatoni
                        this.getView().byId("statoNI1").setText(statoNI)

                        var importoTot = header[i].ZimpoTotni
                        this.getView().byId("importoTot1").setText(importoTot)

                    }
                }
            },


            onBackButton: function () {
                window.history.go(-1);
            },

            onForwardButton: function () {
                this.getOwnerComponent().getRouter().navTo("aImpegno2");
            },

            setEsercizioGestione: function () {
                const data = new Date();
                let anno = data.getFullYear();
                this.getView().byId("es_gestione").setValue(anno)
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