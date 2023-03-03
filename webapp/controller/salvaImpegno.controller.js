sap.ui.define([
    "./BaseController",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    'sap/ui/model/json/JSONModel',
    "sap/m/MessageBox",
    'sap/ui/export/Spreadsheet',
    "sap/ui/core/library",
    "project1/model/DateFormatter",
    "sap/ui/core/routing/History",

],

    function (BaseController, Filter, FilterOperator, JSONModel, MessageBox, Spreadsheet, CoreLibrary, DateFormatter, History) {
        "use strict";
        var EdmType = sap.ui.export.EdmType

        var ValueState = CoreLibrary.ValueState,
            oButton = {
                TableVisible: false
            };

        return BaseController.extend("project1.controller.salvaImpegno", {
            formatter: DateFormatter,
            onInit() {
                var oProprietà = new JSONModel(),
                    oInitialModelState = Object.assign({}, oButton);
                oProprietà.setData(oInitialModelState);
                this.getView().setModel(oProprietà);
                this.getOwnerComponent().getModel("temp");
                //this.prePosition()
                this.getRouter().getRoute("salvaImpegno").attachPatternMatched(this._onObjectMatched, this);

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
                this.callPositionNI(oEvent)
            },

            // prePosition: function(){
            //     var that = this;
            //     var oMdlITB = new sap.ui.model.json.JSONModel();
            //     this.getOwnerComponent().getModel().read("/PositionNISet", {
            //         filters: [],
            //         urlParameters: "",
            //         success: function (data) {
            //             oMdlITB.setData(data.results);
            //             that.getView().getModel("temp").setProperty('/PositionNISet', data.results)
            //         },
            //         error: function (error) {
            //             var e = error;
            //         }
            //     });
            // },  

            viewHeader: function (data) {

                var that = this
                var url = location.href
                var sUrl = url.split("/salvaImpegno/")[1]
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
                        var centroCOGE = valoriNuovi[2]
                        this.getView().byId("ConCoGe1").setText(centroCOGE)
                        var codiceGestionale = valoriNuovi[3]
                        this.getView().byId("CodiceGes1").setText(codiceGestionale)
                        var causalePagamento = valoriNuovi[4]
                        this.getView().byId("CausalePagamento1").setText(causalePagamento)



                    }
                }

            },

            controlloAttributo: function () {
                var position = this.getView().getModel("temp").getData().PositionNISet
                var ImpegniSelezionati = this.getView().getModel("temp").getData().ImpegniSelezionati
                for (var y = 0; y < ImpegniSelezionati.length; y++) {
                    for (var x = 0; x < position.length; x++) {

                        if (parseFloat(ImpegniSelezionati[y].Zattribuito) > parseFloat(position[x].ZimpoTitolo)) {

                            var DELTAATTRIBUITO = "" + parseFloat(ImpegniSelezionati[y].Zattribuito) - parseFloat(position[x].ZimpoTitolo) + ""
                            var DELTAIMPO_TITOLO = 0
                            var ZCodCla = ImpegniSelezionati[y].ZCodCla
                            ImpegniSelezionati[y].Zattribuito = DELTAATTRIBUITO
                        }

                        else if (parseFloat(ImpegniSelezionati[y].Zattribuito) == parseFloat(position[x].ZimpoTitolo)) {

                            position[x].ZimpoTitolo = parseFloat(ImpegniSelezionati[y].Zattribuito)
                            var DELTAIMPO_TITOLO = parseFloat(position[x].ZimpoTitolo) - parseFloat(ImpegniSelezionati[y].Zattribuito)
                            var ZCodCla = ImpegniSelezionati[y].ZCodCla
                            ImpegniSelezionati[y+1].Zattribuito = 0
                            break;
                        }

                        else if (parseFloat(ImpegniSelezionati[y].Zattribuito) < parseFloat(position[x].ZimpoTitolo)) {

                            position[x].ZimpoTitolo = parseFloat(ImpegniSelezionati[y].Zattribuito)
                            var DELTAIMPO_TITOLO = parseFloat(position[x].ZimpoTitolo) - parseFloat(ImpegniSelezionati[y].Zattribuito)
                            var ZCodCla = ImpegniSelezionati[y].ZCodCla
                            if (DELTAIMPO_TITOLO > 0) {
                                console.log("creazione")
                            }
                            //ImpegniSelezionati[y].Zattribuito = 0     
                        }
                    }
                }
            },

            callPositionNI: function (oEvent) {
                this.controlloAttributo()
                var filtroNI = []
                var header = this.getView().getModel("temp").getData().HeaderNISet
                //var position = this.getView().getModel("temp").getData().PositionNISet
                for (var i = 0; i < header.length; i++) {

                    if (header[i].Bukrs == oEvent.getParameters().arguments.campo &&
                        header[i].Gjahr == oEvent.getParameters().arguments.campo1 &&
                        header[i].Zamministr == oEvent.getParameters().arguments.campo2 &&
                        header[i].ZchiaveNi == oEvent.getParameters().arguments.campo3 &&
                        header[i].ZidNi == oEvent.getParameters().arguments.campo4 &&
                        header[i].ZRagioCompe == oEvent.getParameters().arguments.campo5) {

                        //filtroNI.push({Bukrs:Bukrs, Gjahr:Gjahr, Zamministr,Zamministr, ZchiaveNi:ZchiaveNi, ZidNi:ZidNi, ZRagioCompe:ZRagioCompe})
                        filtroNI.push(new Filter({
                            path: "Bukrs",
                            operator: FilterOperator.EQ,
                            value1: header[i].Bukrs
                        }));
                        filtroNI.push(new Filter({
                            path: "Gjahr",
                            operator: FilterOperator.EQ,
                            value1: header[i].Gjahr
                        }));
                        filtroNI.push(new Filter({
                            path: "Zamministr",
                            operator: FilterOperator.EQ,
                            value1: header[i].Zamministr
                        }));
                        filtroNI.push(new Filter({
                            path: "ZchiaveNi",
                            operator: FilterOperator.EQ,
                            value1: header[i].ZchiaveNi
                        }));
                        filtroNI.push(new Filter({
                            path: "ZidNi",
                            operator: FilterOperator.EQ,
                            value1: header[i].ZidNi
                        }));
                        filtroNI.push(new Filter({
                            path: "ZRagioCompe",
                            operator: FilterOperator.EQ,
                            value1: header[i].ZRagioCompe
                        }));
                        // filtroNI.push(new Filter({
                        //     path: "ZposNi",
                        //     operator: FilterOperator.EQ,
                        //     value1: ZposNi
                        // }));


                        var that = this;
                        var oMdlITB = new sap.ui.model.json.JSONModel();
                        this.getOwnerComponent().getModel().read("/PositionNISet", {
                            filters: filtroNI,
                            //filters: [],
                            urlParameters: "",

                            success: function (data) {
                                oMdlITB.setData(data.results);
                                that.getView().getModel("temp").setProperty('/PositionNISet', data.results)
                                that.viewHeader(data.results)
                            },
                            error: function (error) {
                                var e = error;
                            }
                        });
                        this.getOwnerComponent().setModel(oMdlITB, "HeaderSalva");

                    }
                }

            },

            onSelect: function (oEvent) {
                var key = oEvent.getParameters().key;
                if (key === "dettagliNI") {
                    //this.callPositionNI()
                    this.getView().byId("idIconTabBar").destroyContent()


                }

                else if (key === "Workflow") {
                    this.getView().byId("idIconTabBar").destroyContent()

                }
                else if (key === "Fascicolo") {

                }


            },

            onBackButton: function () {
                window.history.go(-1);
            },

            onCancelNI: function () {

                var that = this

                var url = location.href
                var sUrl = url.split("/iconTabBar/")[1]
                var aValori = sUrl.split(",")

                var Bukrs = aValori[0]
                var Gjahr = aValori[1]
                var Zamministr = aValori[2]
                var ZchiaveNi = aValori[3]
                var ZidNi = aValori[4]
                var ZRagioCompe = aValori[5]

                //var oItems = that.getView().byId("").getBinding("items").oList;
                var header = this.getView().getModel("temp").getData().HeaderNISet
                for (var i = 0; i < header.length; i++) {
                    if (header[i].Bukrs == Bukrs &&
                        header[i].Gjahr == Gjahr &&
                        header[i].Zamministr == Zamministr &&
                        header[i].ZchiaveNi == ZchiaveNi &&
                        header[i].ZidNi == ZidNi &&
                        header[i].ZRagioCompe == ZRagioCompe) {

                        var deepEntity = {
                            HeaderNISet: null,
                            Funzionalita: 'ANNULLAMENTOPREIMPOSTATA',
                        }

                        //var statoNI = this.getView().byId("idModificaDettaglio").mBindingInfos.items.binding.oModel.oZcodiStatoni
                        MessageBox.warning("Sei sicuro di voler annullare la Nota d'Imputazione n° " + header[i].ZchiaveNi + "?", {
                            actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
                            emphasizedAction: MessageBox.Action.YES,
                            onClose: function (oAction) {
                                if (oAction === sap.m.MessageBox.Action.YES) {
                                    var oModel = that.getOwnerComponent().getModel();

                                    for (var i = 0; i < header.length; i++) {
                                        var item = header[i];
                                        var scompostaZamministr = that.getView().byId("numNI1").mProperties.text.split("-")[1]
                                        var Zamministr = scompostaZamministr.split(".")[0]

                                        deepEntity.ZchiaveNi = that.getView().byId("numNI1").mProperties.text
                                        // deepEntity.Bukrs = item.Zamministr, //Passato Da BE
                                        // deepEntity.Gjahr = that.getView().byId("numNI1").mProperties.text.split("-")[0],
                                        // deepEntity.Zamministr = item.Zamministr, //Passato Da BE
                                        // deepEntity.ZidNi = item.ZidNi, //Incrementato da BE
                                        // deepEntity.ZRagioCompe = item.ZRagioCompe, //Passato Da BE


                                        deepEntity.HeaderNISet = {
                                            Bukrs: Bukrs, //Passato Da BE
                                            Gjahr: Gjahr,
                                            Zamministr: Zamministr, //Passato Da BE
                                            ZidNi: ZidNi, //Incrementato da BE
                                            ZRagioCompe: ZRagioCompe, //Passato Da BE
                                            //ZcodiStatoni: "00",
                                            ZchiaveNi: ZchiaveNi,
                                            ZimpoTotni: that.getView().byId("importoTot1").mProperties.text,
                                            ZzGjahrEngPos: that.getView().byId("numNI1").mProperties.text.split("-")[0],
                                            Zmese: that.getView().byId("mese1").mProperties.text,
                                            ZoggSpesa: that.getView().byId("oggSpesa1").mProperties.text,
                                            Fipex: that.getView().byId("SARWH2").mProperties.text,
                                            Fistl: that.getView().byId("pos_FinWH2").mProperties.text,
                                        };
                                    }
                                    oModel.create("/DeepZNIEntitySet", deepEntity, {
                                        //urlParameters: {'funzionalita': 'ANNULLAMENTOPREIMPOSTATA'},
                                        // method: "PUT",
                                        success: function (data) {
                                            //console.log("success");
                                            MessageBox.success("Operazione eseguita con successo")
                                            that.getOwnerComponent().getRouter().navTo("View1")
                                            location.reload();
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
                }
            }
        })

    });
