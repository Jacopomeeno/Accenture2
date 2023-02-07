sap.ui.define(
    [
        "./BaseController",
        "sap/m/MessageBox",
        "sap/ui/core/routing/History",
        'project1/model/DateFormatter'
    ],
    function (BaseController, MessageBox, History, DateFormatter) {
        "use strict";

        return BaseController.extend("project1.controller.modificaImporto", {
            formatter: DateFormatter,
            onInit() {
                this.onModificaNI()
                this.getOwnerComponent().getModel("temp");
                this.getRouter().getRoute("modificaImporto").attachPatternMatched(this._onObjectMatched, this);
            },

            onBackButton: function () {
                window.history.go(-1);
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
                        this.getView().byId("comp1").setText(comp)

                        var statoNI = header[i].ZcodiStatoni
                        this.getView().byId("statoNI1").setText(statoNI)

                        var importoTot = header[i].ZimpoTotni
                        this.getView().byId("importoTot1").setText(importoTot)

                    }
                }

            },

            onModificaNI: function () {
                var that = this;
                var oMdlM = new sap.ui.model.json.JSONModel();
                this.getOwnerComponent().getModel().read("/PositionNISet", {
                    filters: [],
                    urlParameters: "",
                    success: function (data) {
                        oMdlM.setData(data.results);
                        that.getView().getModel("temp").setProperty('/PositionNISet', data.results)
                    },
                    error: function (error) {
                        var e = error;
                    }
                });
                this.getOwnerComponent().setModel(oMdlM, "PositionNIMI");
            },

            onUpdateImporto: function () {
                /*update operation*/
                var that = this
                MessageBox.warning("Sei sicuro di voler modificare la NI?", {
                    actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
                    emphasizedAction: MessageBox.Action.YES,
                    onClose: function (oAction) {
                        if (oAction === sap.m.MessageBox.Action.YES) {
                            var oModel = that.getView().getModel();
                            var editImp = {};
                            editImp.importoNI = that.getView().byId("importoNI").getValue();
                            editImp.importoRes = that.getView().byId("importoRes").getValue();

                            oModel.update("/PositionNISet('" + editImp.importoNI + "',)", editImp, {
                                method: "PUT",
                                success: function (data) {
                                    //console.log("success");
                                    MessageBox.success("Operazione eseguita con successo")
                                },
                                error: function (e) {
                                    //console.log("error");
                                    MessageBox.error("Operazione non eseguita")
                                }
                            });
                        }
                    }
                });
            }

            // onSaveDati: function () {
            //     //aggiunge dati
            //     var oMdlM = new sap.ui.model.json.JSONModel();
            //     var spesa= this.getView().byId("HeaderNIM")
            //     MessageBox.warning("Sei sicuro di voler modificare la NI?", {
            //         actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
            //         emphasizedAction: MessageBox.Action.YES,
            //         onClose: function (oAction) {
            //             if (oAction === sap.m.MessageBox.Action.YES) {
            //                 //var oggSpesa = this.getView().byId("oggSpesa").getValue()
            //                 var that = this;
            //                 var aData = jQuery.ajax({
            //                     type: "PATCH",
            //                     contentType: "application/json",
            //                     url: "/sap/opu/odata/sap/ZS4_NOTEIMPUTAZIONI_SRV/HeaderNISet",
            //                     dataType: "json",
            //                     async: false,
            //                     body: JSON.stringify({
            //                         ZoggSpesa: oggSpesa
            //                       }),
            //                     success: function (data, textStatus, jqXHR) {
            //                         // resolve(data.value)
            //                         //console.log(data)
            //                         oMdlITB.setData(data.d.results);
            //                         //that.getView().getModel("temp").setProperty('/PositionNISet', data.d.results)
            //                         //console.log(data.d.results)
            //                     },
            //                     error: function (error) {
            //                         var e = error;
            //                     }
            //                 });
            //                 MessageBox.success("Operazione eseguita con successo")
            //             }
            //         }
            //     })
            // },


        });
    }
);