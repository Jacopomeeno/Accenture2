sap.ui.define([
    "./BaseController",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/core/routing/History",

],
    function (BaseController, Filter, FilterOperator, History) {
        "use strict";
        return BaseController.extend("project1.controller.aImpegno2", {
            onInit() {
                this.onCallImpegni()
                this.getOwnerComponent().getModel("temp");
                this.onCallKostl()
                this.onCallLtextIc()
                this.onCallTxt50Ic()
                this.getRouter().getRoute("aImpegno2").attachPatternMatched(this._onObjectMatched, this);
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
                this.viewFiltri(oEvent)
            },

            onCallImpegni: function () {
                var that = this
                var oMdlAImp = new sap.ui.model.json.JSONModel();
                this.getOwnerComponent().getModel().read("/ZfmimpegniIpeSet", {
                    //filters: filtriAssocia,
                    filters: [],
                    // urlParameters: "",
                    success: function (data) {
                        oMdlAImp.setData(data.results);
                        that.getView().getModel("temp").setProperty('/ZfmimpegniIpeSet', data.results)
                    },
                    error: function (error) {
                        var e = error;
                    }
                });
            },

            onCallKostl: function () {
                var that = this
                var oMdlZhfKostl = new sap.ui.model.json.JSONModel();
                this.getOwnerComponent().getModel().read("/ZhfKostlSet", {
                    //filters: filtriAssocia,
                    filters: [],
                    // urlParameters: "",
                    success: function (data) {
                        oMdlZhfKostl.setData(data.results);
                        that.getView().getModel("temp").setProperty('/ZhfKostlSet', data.results)
                    },
                    error: function (error) {
                        var e = error;
                    }
                });
            },

            onCallLtextIc: function () {
                var filtriLtextIc = []
                var position = this.getOwnerComponent().getModel("temp").getData().PositionNISet
                var Kokrs = position[0].Bukrs
                var Kostl = "A04017ZZZZ"

                filtriLtextIc.push(new Filter({
                    path: "Kokrs",
                    operator: FilterOperator.EQ,
                    value1: Kokrs
                }));
                filtriLtextIc.push(new Filter({
                    path: "Kostl",
                    operator: FilterOperator.EQ,
                    value1: Kostl
                }));

                var that = this
                var oMdlText = new sap.ui.model.json.JSONModel();
                this.getOwnerComponent().getModel().read("/LtextIcSet", {
                    filters: filtriLtextIc,
                    //filters: [],
                    // urlParameters: "",
                    success: function (data) {
                        oMdlText.setData(data.results);
                        that.getView().getModel("temp").setProperty('/LtextIcSet', data.results)
                    },
                    error: function (error) {
                        var e = error;
                    }
                });
            },


            onCallTxt50Ic: function () {
                var filtriTxt50Ic = []
                var that = this
                var oMdlText = new sap.ui.model.json.JSONModel();
                var Saknr = "1021049999"

                filtriTxt50Ic.push(new Filter({
                    path: "Saknr",
                    operator: FilterOperator.EQ,
                    value1: Saknr
                }));

                this.getOwnerComponent().getModel().read("/Txt50IcSet", {
                    filters: filtriTxt50Ic,
                    success: function (data) {
                        oMdlText.setData(data.results);
                        that.getView().getModel("temp").setProperty('/Txt50IcSet', data.results)
                    },
                    error: function (error) {
                        var e = error;
                    }
                });
            },

            getOtherData: function (value) {
                var oMdlVN = new sap.ui.model.json.JSONModel();
                //var oModel= this.getView().getModel("comboBox")
                //var codiceGestionale = this.getView().byId("inputCodiceGest").getValue()
                var oTempModel = this.getView().getModel("temp")
                
                var KOSTL = _.findWhere(oTempModel.getProperty("/LtextIcSet"), { Kostl: value })
                if (KOSTL != undefined) {
                    var centroCosto = _.findWhere(oTempModel.getProperty("/LtextIcSet"), { id: KOSTL.Kostl });
                    this.getView().byId("DescCentroCosto").setValue(KOSTL.Ltext);
                    //valoriNuovi.push(KOSTL.Kostl)
                }
                var SAKNR = _.findWhere(oTempModel.getProperty("/Txt50IcSet"), { Saknr: value })
                if (SAKNR != undefined) {
                    var contoCOGE = _.findWhere(oTempModel.getProperty("/Txt50IcSet"), { id: SAKNR.Saknr });
                    this.getView().byId("DescCoGe").setValue(SAKNR.Txt50);
                    //valoriNuovi.push(SAKNR.Saknr)
                }

                //oMdlVN.setData(valoriNuovi)

            },

            viewFiltri: function (oEvent) {

                var header = this.getView().getModel("temp").getData().HeaderNISet
                var position = this.getView().getModel("temp").getData().PositionNISet
                //var LtextIcSet = this.getView().getModel("temp").getData().LtextIcSet
                var impegni = this.getView().getModel("temp").getData().ImpegniSelezionati
                console.log(this.getView().getModel("temp").getData())
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

                        this.getView().byId("InputImpLiq").setValue(importoTot)

                        for (var m = 0; m < impegni.length; m++) {
                            var beneficiario = impegni[m].Lifnr
                            this.getView().byId("inputBeneficiario").setValue(beneficiario)
                        }
                    }
                }
            },


            onBackButton: function () {
                window.history.go(-1);
            },

            onSaveButton: function () {
                var beneficiario = this.getView().byId("inputBeneficiario").getValue()
                var valoriNuovi = []
                valoriNuovi.push(beneficiario)
                if (beneficiario && this.getView().byId("DescCentroCosto").getValue() && this.getView().byId("DescCoGe").getValue() && this.getView().byId("inputCodiceGest").getValue()) {
                    var centroCosto = this.getView().byId("inputCentroCosto").getValue()
                    valoriNuovi.push(centroCosto)
                    var contoCOGE = this.getView().byId("inputCoGe").getValue()
                    valoriNuovi.push(contoCOGE)
                    var codiceGestionale = this.getView().byId("inputCodiceGest").getValue()
                    valoriNuovi.push(codiceGestionale)
                    var causalePagamento = this.getView().byId("inputCausPagamento").getValue()
                    valoriNuovi.push(causalePagamento)

                    this.getView().getModel("temp").setProperty('/ValoriNuovi', valoriNuovi)
                    //console.log("eh")
                }
                var url = location.href
                var sUrl = url.split("/aImpegno2/")[1]
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
                        this.getOwnerComponent().getRouter().navTo("salvaImpegno", { campo: header[i].Bukrs, campo1: header[i].Gjahr, campo2: header[i].Zamministr, campo3: header[i].ZchiaveNi, campo4: header[i].ZidNi, campo5: header[i].ZRagioCompe });
                    }
                }

            }
        })
    }
)