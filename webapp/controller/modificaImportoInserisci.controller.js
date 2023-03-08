sap.ui.define(
    [
        "./BaseController",
        "sap/ui/model/Filter",
        "sap/ui/model/FilterOperator",
        "sap/m/MessageBox",
        "sap/ui/core/routing/History",
        'project1/model/DateFormatter'
    ],
    function (BaseController, Filter, FilterOperator, MessageBox, History, DateFormatter) {
        "use strict";

        return BaseController.extend("project1.controller.modificaImportoInserisci", {
            formatter: DateFormatter,
            onInit() {
                this.onModificaNI()
                this.getOwnerComponent().getModel("temp");
                this.getRouter().getRoute("modificaImportoInserisci").attachPatternMatched(this._onObjectMatched, this);
            },

            onBackButton: function () {
                this.getView().byId("PositionNIMI").destroyItems()
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

                var that = this
                var url = location.href
                var sUrl = url.split("/modificaImportoInserisci/")[1]
                var aValori = sUrl.split(",")

                var Bukrs = aValori[0]
                var Gjahr = aValori[1]
                var Zamministr = aValori[2]
                var ZchiaveNi = aValori[3]
                var ZidNi = aValori[4]
                var ZRagioCompe = aValori[5]

                //var that = this
                var header = this.getView().getModel("temp").getData().HeaderNISet
                //var position = this.getView().getModel("temp").getData().PositionNISet
                var impegni = this.getView().getModel("temp").getData().ImpegniSelezionati
                var valoriNuovi = this.getView().getModel("temp").getData().ValoriNuovi
                for (var i = 0; i < header.length; i++) {
                    if (header[i].Bukrs == Bukrs &&
                        header[i].Gjahr == Gjahr &&
                        header[i].Zamministr == Zamministr &&
                        header[i].ZchiaveNi == ZchiaveNi &&
                        header[i].ZidNi == ZidNi &&
                        header[i].ZRagioCompe == ZRagioCompe) {

                        var progressivoNI = header[i].ZchiaveNi
                        this.getView().byId("numNI1").setText(progressivoNI)

                        var dataRegistrazione = header[i].ZdataCreaz
                        var dataNuova = new Date(dataRegistrazione),
                            mnth = ("0" + (dataNuova.getMonth() + 1)).slice(-2),
                            day = ("0" + dataNuova.getDate()).slice(-2);
                        var nData = [dataNuova.getFullYear(), mnth, day].join("-");
                        var nDate = nData.split("-").reverse().join(".");
                        this.getView().byId("dataReg1").setText(nDate)

                        var strAmmResp = header[i].Fistl
                        this.getView().byId("SARWH2").setText(strAmmResp)

                        var PF = header[i].Fipex
                        this.getView().byId("pos_FinWH2").setText(PF)

                        var oggSpesa = header[i].ZoggSpesa
                        this.getView().byId("oggSpesa1").setText(oggSpesa)

                        var mese = header[i].Zmese
                        this.getView().byId("mese1").setText(mese)

                        for (var x = 0; x < data.length; x++) {
                            if (data[x].Bukrs == Bukrs &&
                                data[x].Gjahr == Gjahr &&
                                data[x].Zamministr == Zamministr &&
                                data[x].ZchiaveNi == ZchiaveNi &&
                                data[x].ZidNi == ZidNi &&
                                data[x].ZRagioCompe == ZRagioCompe) {

                                var comp = data[x].ZcompRes
                                if (comp == "C") var n_comp = 'Competenza'
                                if (comp == "R") var n_comp = 'Residui'       //Position
                                this.getView().byId("comp1").setText(n_comp)

                                // var Zcodgest = data[x].Zcodgest
                                // this.getView().byId("CodiceGes1").setText(Zcodgest)

                                // var Zcauspag = data[x].Zcauspag
                                // this.getView().byId("CausalePagamento1").setText(Zcauspag)
                            }
                        }

                        var statoNI = header[i].ZcodiStatoni
                        this.getView().byId("statoNI1").setText(statoNI)

                        var importoTot = header[i].ZimpoTotni
                        this.getView().byId("importoTot1").setText(importoTot)

                        for (var o = 0; o < impegni.length; o++) {
                            var beneficiario = impegni[o].Lifnr
                            this.getView().byId("Lifnr1").setText(beneficiario)
                            //var Zattribuito = impegni[o].Zattribuito
                            this.getView().byId("ImpLiq1").setText(importoTot)
                        }

                        var centroCosto = valoriNuovi[1]
                        this.getView().byId("CentroCosto1").setText(centroCosto)
                        var centroCOGE = valoriNuovi[3]
                        this.getView().byId("ConCoGe1").setText(centroCOGE)
                        var codiceGestionale = valoriNuovi[5]
                        this.getView().byId("CodiceGes1").setText(codiceGestionale)
                        var causalePagamento = valoriNuovi[6]
                        this.getView().byId("CausalePagamento1").setText(causalePagamento)
                        var modalitàPagamento = valoriNuovi[7]
                        this.getView().byId("Zwels1").setText(modalitàPagamento)

                    }
                }

            },

            onModificaNI: function () {
                var filtroNI = []
                var url = location.href
                var sUrl = url.split("/modificaImporto/")[1]
                var aValori = sUrl.split(",")

                var Bukrs = aValori[0]
                var Gjahr = aValori[1]
                var Zamministr = aValori[2]
                var ZchiaveNi = aValori[3]
                var ZidNi = aValori[4]
                var ZRagioCompe = aValori[5]

                //filtroNI.push({Bukrs:Bukrs, Gjahr:Gjahr, Zamministr,Zamministr, ZchiaveNi:ZchiaveNi, ZidNi:ZidNi, ZRagioCompe:ZRagioCompe})
                filtroNI.push(new Filter({
                    path: "Bukrs",
                    operator: FilterOperator.EQ,
                    value1: Bukrs
                }));
                filtroNI.push(new Filter({
                    path: "Gjahr",
                    operator: FilterOperator.EQ,
                    value1: Gjahr
                }));
                filtroNI.push(new Filter({
                    path: "Zamministr",
                    operator: FilterOperator.EQ,
                    value1: Zamministr
                }));
                filtroNI.push(new Filter({
                    path: "ZchiaveNi",
                    operator: FilterOperator.EQ,
                    value1: ZchiaveNi
                }));
                filtroNI.push(new Filter({
                    path: "ZRagioCompe",
                    operator: FilterOperator.EQ,
                    value1: ZRagioCompe
                }));

                var that = this;
                var oMdlM = new sap.ui.model.json.JSONModel();
                this.getOwnerComponent().getModel().read("/PositionNISet", {
                    filters: filtroNI,
                    urlParameters: "",
                    success: function (data) {
                        oMdlM.setData(data.results);
                        that.getView().getModel("temp").setProperty('/PositionNISetFiltrata', data.results)
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
                var oItems = that.getView().byId("PositionNIMI").getBinding("items").oList;

                var deepEntity = {
                    Funzionalita:"RETTIFICANIPREIMPOSTATA",
                    PositionNISet: []
                }
                //var dataOdierna = new Date()
                MessageBox.warning("Sei sicuro di voler modificare la NI?", {
                    actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
                    emphasizedAction: MessageBox.Action.YES,
                    onClose: function (oAction) {
                        if (oAction === sap.m.MessageBox.Action.YES) {
                            var oModel = that.getView().getModel();

                            for (var i = 0; i < oItems.length; i++) {
                                var item = oItems[i];

                                deepEntity.Bukrs = item.Bukrs,
                                    deepEntity.Gjahr = item.Gjahr,
                                    deepEntity.Zamministr = item.Zamministr,
                                    deepEntity.ZchiaveNi = item.ZchiaveNi,
                                    deepEntity.ZidNi = item.ZidNi,
                                    deepEntity.ZRagioCompe = item.ZRagioCompe,
                                    deepEntity.Operation = "U",

                                    deepEntity.PositionNISet.push({
                                        ZposNi: item.ZposNi,
                                        Bukrs: item.Bukrs,
                                        Gjahr: item.Gjahr,
                                        Zamministr: item.Zamministr,
                                        ZchiaveNi: item.ZchiaveNi,
                                        ZidNi: item.ZidNi,
                                        ZRagioCompe: item.ZRagioCompe,

                                        ZimpoTitolo: item.ZimpoTitolo
                                    })
                            }
                            // var oEntry = {};
                            // oEntry.ZimpoTitolo = item.ZimpoTitolo;
                            //oEntry.ZimpoRes = item.ZimpoRes

                            oModel.create("/DeepPositionNISet", deepEntity, {
                                // method: "PUT",
                                success: function (data) {
                                    //console.log("success");
                                    MessageBox.success("Modifica Importo eseguito con successo", {
                                        actions: [sap.m.MessageBox.Action.OK],
                                        emphasizedAction: MessageBox.Action.OK,
                                        onClose: function (oAction) {
                                            if (oAction === sap.m.MessageBox.Action.OK) {
                                                that.getOwnerComponent().getRouter().navTo("View1");
                                                location.reload();
                                            }
                                        }
                                    })
                                },
                                error: function (e) {
                                    //console.log("error");
                                    MessageBox.error("Modifica Importo non eseguito")
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