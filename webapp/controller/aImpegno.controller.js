sap.ui.define([
    "./BaseController",
    "sap/ui/model/Filter",
    "sap/m/MessageBox",
    "sap/ui/model/FilterOperator",
    "sap/ui/core/routing/History",

],
    function (BaseController, Filter, MessageBox, FilterOperator, History) {
        "use strict";

        return BaseController.extend("project1.controller.aImpegno", {
            onInit() {
                this.getOwnerComponent().getModel("temp");
                this.getRouter().getRoute("aImpegno").attachPatternMatched(this._onObjectMatched, this);
                this.setEsercizio_Amministrazione()
                //this.onCallZdispon()
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

                        for (var x = 0; x < position.length; x++) {
                            if (position[x].Bukrs == oEvent.getParameters().arguments.campo &&
                                position[x].Gjahr == oEvent.getParameters().arguments.campo1 &&
                                position[x].Zamministr == oEvent.getParameters().arguments.campo2 &&
                                position[x].ZchiaveNi == oEvent.getParameters().arguments.campo3 &&
                                position[x].ZidNi == oEvent.getParameters().arguments.campo4 &&
                                position[x].ZRagioCompe == oEvent.getParameters().arguments.campo5) {

                                var comp = position[x].ZcompRes
                                if (comp == "C") var n_comp = 'Competenza'
                                if (comp == "R") var n_comp = 'Residui'       //Position
                                this.getView().byId("comp1").setText(n_comp)

                            }
                        }

                        var statoNI = header[i].ZcodiStatoni
                        this.getView().byId("statoNI1").setText(statoNI)

                        var importoTot = header[i].ZimpoTotni
                        this.getView().byId("importoTot1").setText(importoTot)

                        //var impoTot = this.getView().byId("importoTot1").getText()
                        this.getView().byId("importoAttributo").setText(importoTot)

                    }
                }
            },

            onBackButton: function () {
                this.getView().byId("HeaderNIAssImp").destroyItems()
                window.history.go(-1);
            },

            onForwardButton: function () {
                var array = []
                var url = location.href
                var sUrl = url.split("/aImpegno/")[1]
                var aValori = sUrl.split(",")

                var Bukrs = aValori[0]
                var Gjahr = aValori[1]
                var Zamministr = aValori[2]
                var ZchiaveNi = aValori[3]
                var ZidNi = aValori[4]
                var ZRagioCompe = aValori[5]

                var header = this.getView().getModel("temp").getData().HeaderNISet
                for (var i = 0; i < header.length; i++) {
                    if (header[i].Bukrs == Bukrs &&
                        header[i].Gjahr == Gjahr &&
                        header[i].Zamministr == Zamministr &&
                        header[i].ZchiaveNi == ZchiaveNi &&
                        header[i].ZidNi == ZidNi &&
                        header[i].ZRagioCompe == ZRagioCompe) {
                        var rows = this.getView().byId("HeaderNIAssImp").getSelectedItems()
                        for (var m = 0; m < rows.length; m++) {
                            var campo = rows[m].getBindingContext("HeaderNIAssImp").getObject()
                            array.push(campo)
                        }
                        if (array) {
                            this.getView().getModel("temp").setProperty("/ImpegniSelezionati", array)
                            this.getOwnerComponent().getRouter().navTo("aImpegno2", { campo: header[i].Bukrs, campo1: header[i].Gjahr, campo2: header[i].Zamministr, campo3: header[i].ZchiaveNi, campo4: header[i].ZidNi, campo5: header[i].ZRagioCompe });
                        }

                    }
                }
            },

            setEsercizio_Amministrazione: function () {
                var url = location.href
                var sUrl = url.split("/aImpegno/")[1]
                var aValori = sUrl.split(",")

                var Bukrs = aValori[0]
                var Gjahr = aValori[1]
                var Zamministr = aValori[2]
                var ZchiaveNi = aValori[3]
                var ZidNi = aValori[4]
                var ZRagioCompe = aValori[5]

                var header = this.getOwnerComponent().getModel("temp").getData().HeaderNISet
                for (var i = 0; i < header.length; i++) {
                    if (header[i].Bukrs == Bukrs &&
                        header[i].Gjahr == Gjahr &&
                        header[i].Zamministr == Zamministr &&
                        header[i].ZchiaveNi == ZchiaveNi &&
                        header[i].ZidNi == ZidNi &&
                        header[i].ZRagioCompe == ZRagioCompe) {
                        this.getView().byId("es_gestione").setValue(header[i].Gjahr)
                        this.getView().byId("inputAmm").setValue(header[i].Zamministr)
                    }
                }
            },

            onSearch: function (oEvent) {
                // this.onCallHeader()

                var that = this;
                var filtriAssocia = []
                this.getView().byId("HeaderNIAssImp").setVisible(true);
                // var oModel = this.getOwnerComponent().getModel();

                // var path = oModel.createKey("/ZfmimpegniIpeSet", {
                //     Gjahr: this.getView().byId("es_gestione").mProperties.value,
                //     Zcoddecr: this.getView().byId("inputDecreto").mProperties.value,
                //     Zammin: this.getView().byId("inputAmm").mProperties.value,
                //     ZCodIpe: this.getView().byId("inputIPE").mProperties.value,
                //     Zufficioliv1: this.getView().byId("inputaUff").mProperties.value,
                //     Zufficioliv2: this.getView().byId("inputbUff").mProperties.value,
                //     ZNumCla: this.getView().byId("inputClaus").mProperties.value
                // });

                //FILTRI COMMENTATI IN ATTESA DI VALORI CORRETTI

                if (this.getView().byId("es_gestione").mProperties.value != "") {
                    filtriAssocia.push(new Filter({
                        path: "Gjahr",
                        operator: FilterOperator.EQ,
                        value1: this.getView().byId("es_gestione").mProperties.value
                    }));
                }

                if (this.getView().byId("inputDecreto").mProperties.value != "") {
                    filtriAssocia.push(new Filter({
                        path: "Zcoddecr",
                        operator: FilterOperator.EQ,
                        value1: this.getView().byId("inputDecreto").mProperties.value
                    }));
                }

                if (this.getView().byId("inputAmm").mProperties.value != "") {
                    filtriAssocia.push(new Filter({
                        path: "Zammin",
                        operator: FilterOperator.EQ,
                        value1: this.getView().byId("inputAmm").mProperties.value
                    }));
                }

                if (this.getView().byId("inputIPE").mProperties.value != "") {
                    filtriAssocia.push(new Filter({
                        path: "ZCodIpe",
                        operator: FilterOperator.EQ,
                        value1: this.getView().byId("inputIPE").mProperties.value
                    }));
                }

                if (this.getView().byId("inputaUff").mProperties.value != "") {
                    filtriAssocia.push(new Filter({
                        path: "Zufficioliv1",
                        operator: FilterOperator.EQ,
                        value1: this.getView().byId("inputaUff").mProperties.value
                    }));
                }

                if (this.getView().byId("inputbUff").mProperties.value != "") {
                    filtriAssocia.push(new Filter({
                        path: "Zufficioliv2",
                        operator: FilterOperator.EQ,
                        value1: this.getView().byId("inputbUff").mProperties.value
                    }));
                }

                if (this.getView().byId("inputClaus").mProperties.value != "") {
                    filtriAssocia.push(new Filter({
                        path: "ZNumCla",
                        operator: FilterOperator.EQ,
                        value1: this.getView().byId("inputClaus").mProperties.value
                    }));
                }

                var oMdlAImp = new sap.ui.model.json.JSONModel();
                this.getOwnerComponent().getModel().read("/ZfmimpegniIpeSet", {
                    //filters: filtriAssocia,
                    filters: [],
                    // urlParameters: "",
                    success: function (data) {
                        oMdlAImp.setData(data.results);
                        that.getView().getModel("temp").setProperty('/ZfmimpegniIpeSet', data.results)
                        var impoTot = that.getView().byId("importoTot1").mProperties.text
                        //var lunghezzaTab = that.getView().getModel("temp").ZfmimpegniIpeSet
                        for (var i = 0; i < data.results.length; i++) {
                            that.getView().byId("HeaderNIAssImp").getItems()[i].mAggregations.cells[4].setValue("0.00")
                        }
                        that.onCallZdispon(data.results)
                    },
                    error: function (error) {
                        var e = error;
                    }
                });
                this.getOwnerComponent().setModel(oMdlAImp, "HeaderNIAssImp");
                //this.setDisponibilità()
                //sap.ui.getCore().TableModel = oMdlW;
            },

            setDisponibilità: function (Zdisp) {
                //var Zdisp = this.getView().getModel("temp").getData().ZdisponSet
                for (var q = 0; q < Zdisp.length; q++) {
                    this.getView().byId("HeaderNIAssImp").getItems()[q].mAggregations.cells[3].setText(Zdisp[q])
                }
            },

            onCalcolaPress: function () {
                //var somma=0.00
                var rows = this.getView().byId("HeaderNIAssImp").getSelectedItems()
                var impoTot = this.getView().byId("importoTot1").mProperties.text
                var deltaImportoTot = impoTot
                for (var i = 0; i < rows.length; i++) {
                    if (this.getView().byId("HeaderNIAssImp").getSelectedItems()[i].mAggregations.cells[4].mProperties.value != "") {
                        var Zdisp = parseFloat(this.getView().byId("HeaderNIAssImp").getSelectedItems()[i].mAggregations.cells[3].mProperties.text)
                        //var impoAttributo = parseFloat(this.getView().byId("HeaderNIAssImp").getSelectedItems()[i].mAggregations.cells[4].mProperties.value)
                        //somma = somma + impoAttributo
                        if (impoAttributo <= Zdisp) {
                            this.getView().byId("HeaderNIAssImp").getSelectedItems()[i].mAggregations.cells[4].setValue(impoAttributo)
                            break;
                        }
                        else if (impoAttributo > Zdisp) {
                            this.getView().byId("HeaderNIAssImp").getSelectedItems()[i].mAggregations.cells[4].setText(Zdisp)
                            deltaImportoTot = deltaImportoTot - Zdisp
                            continue;
                        }
                    }
                }
            },

            onCallZdispon: function (dataResults) {

                const risultati = []
                var that = this
                var filtriDispon = []
                var oModel = this.getOwnerComponent().getModel();

                for (var d = 0; d < dataResults.length; d++) {
                    if (dataResults[d].Belnr != undefined && dataResults[d].Blpos != undefined || dataResults[d].Belnr != "" && dataResults[d].Blpos != "") {

                        var chiavi = oModel.createKey("/ZdisponSet", {
                            Belnr: dataResults[d].Belnr,
                            Blpos: dataResults[d].Blpos,

                        });

                        //var oMdlDisp = new sap.ui.model.json.JSONModel();
                        this.getOwnerComponent().getModel().read(chiavi, {
                            filters: [],
                            //filters: [],
                            // urlParameters: "",
                            success: function (data) {
                                risultati.push(data.Wtfree)
                                if (risultati.length == dataResults.length) {
                                    //oMdlDisp.setData(risultati);
                                    //that.getView().getModel("temp").setProperty('/Zdispon', risultati)
                                    that.setDisponibilità(risultati)
                                }
                            },
                            error: function (error) {
                                var e = error;
                            }
                        });
                    }
                }
            },

            // onCallZdispon: function (dataResults) {

            //     const risultati = []
            //     var that = this
            //     var filtriDispon = []

            //     for (var d = 0; d < dataResults.length; d++) {
            //         if (dataResults[d].ZCodIpe != undefined && dataResults[d].ZNumCla != undefined) {

            //             filtriDispon.push(new Filter({
            //                 path: "ZCodIpe",
            //                 operator: FilterOperator.EQ,
            //                 value1: dataResults[d].ZCodIpe
            //             }));
            //             filtriDispon.push(new Filter({
            //                 path: "ZNumCla",
            //                 operator: FilterOperator.EQ,
            //                 value1: dataResults[d].ZNumCla
            //             }));

            //             //var oMdlDisp = new sap.ui.model.json.JSONModel();
            //             this.getOwnerComponent().getModel().read("/ZdisponSet", {
            //                 filters: filtriDispon,
            //                 //filters: [],
            //                 // urlParameters: "",
            //                 success: function (data) {
            //                     risultati.push(data.results[0].Wtfree)
            //                     if (risultati.length == dataResults.length) {
            //                         //oMdlDisp.setData(risultati);
            //                         //that.getView().getModel("temp").setProperty('/ZdisponSet', risultati)
            //                         that.setDisponibilità(risultati)
            //                     }
            //                 },
            //                 error: function (error) {
            //                     var e = error;
            //                 }
            //             });
            //         }
            //     }
            // },


        });
    },
);