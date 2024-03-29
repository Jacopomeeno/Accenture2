sap.ui.define(
    [
        "sap/ui/model/odata/v2/ODataModel",
        "./BaseController",
        "sap/ui/model/Filter",
        "sap/ui/model/FilterOperator",
        'sap/ui/model/json/JSONModel',
        'sap/ui/export/Spreadsheet',
        "sap/ui/core/library",
        "project1/model/DateFormatter",
        "sap/m/MessageBox",
    ],
    /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */
    function (ODataModel, BaseController, Filter, FilterOperator, JSONModel, Spreadsheet, CoreLibrary, DateFormatter, MessageBox) {
        "use strict";
        var EdmType = sap.ui.export.EdmType

        var ValueState = CoreLibrary.ValueState,
            oData = {
                EditEnable: false,
                AddEnable: false,
                DeleteEnable: false,
            };

        return BaseController.extend("project1.controller.inserisciInvioFirma", {
            formatter: DateFormatter,
            onInit() {
                var oProprietà = new JSONModel(),
                    oInitialModelState = Object.assign({}, oData);
                oProprietà.setData(oInitialModelState);
                this.getView().setModel(oProprietà);
                this.getOwnerComponent().getModel("temp");
                this.callVisibilità()
                this.getRouter().getRoute("inserisciInvioFirma").attachPatternMatched(this._onObjectMatched, this);

            },

            callVisibilità: function () {
                var that = this
                var filters = []
                filters.push(
                    new Filter({ path: "SEM_OBJ", operator: FilterOperator.EQ, value1: "ZS4_NOTEIMPUTAZIONI_SRV" }),
                    new Filter({ path: "AUTH_OBJ", operator: FilterOperator.EQ, value1: "Z_GEST_NI" })
                )
                // "ODataModel" required from module "sap/ui/model/odata/v2/ODataModel"
                var visibilità = new ODataModel("http://10.38.125.80:8000/sap/opu/odata/sap/ZSS4_CA_CONI_VISIBILITA_SRV/");
                visibilità.read("/ZES_CONIAUTH_SET", {
                    filters: filters,
                    urlParameters: "",
                    success: function (data) {
                        console.log("success")
                        //oMdl.setData(data.results);
                        that.getView().getModel("temp").setProperty('/Visibilità', data.results)
                        that.pulsantiVisibiltà(data.results)
                    },
                    error: function (error) {
                        console.log(error)
                        //that.getView().getModel("temp").setProperty(sProperty,[]);
                        //that.destroyBusyDialog();
                        var e = error;
                    }
                });
            },

            pulsantiVisibiltà: function (data) {
                for (var d = 0; d < data.length; d++) {
                    if (data[d].ACTV_2 == "Z02") {
                        this.getView().byId("editRow").setEnabled(true);
                    }
                    if (data[d].ACTV_4 == "Z04") {
                        this.getView().byId("pressFirma").setEnabled(true);
                    }
                    if (data[d].ACTV_4 == "Z07") {
                        this.getView().byId("AnnullaNI2").setEnabled(true);
                    }
                }
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
                this.callPositionNI()
                //this.viewHeader(oEvent)
            },

            callPositionNI: function () {

                var url = location.href
                var sUrl = url.split("/inserisciInvioFirma/")[1]
                var aValori = sUrl.split(",")

                var Bukrs = aValori[0]
                var Gjahr = aValori[1]
                var Zamministr = aValori[2]
                var ZchiaveNi = aValori[3]
                var ZidNi = aValori[4]
                var ZRagioCompe = aValori[5]

                var filtroNI = []
                var header = this.getOwnerComponent().getModel("temp").getData().HeaderNISet
                //var position = this.getView().getModel("temp").getData().PositionNISet
                for (var i = 0; i < header.length; i++) {

                    if (header[i].Bukrs == Bukrs &&
                        header[i].Gjahr == Gjahr &&
                        header[i].Zamministr == Zamministr &&
                        header[i].ZchiaveNi == ZchiaveNi &&
                        header[i].ZidNi == ZidNi &&
                        header[i].ZRagioCompe == ZRagioCompe) {

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

                                for (var dr = 0; dr < data.results.length; dr++) {
                                    if (data.results[dr].ZimpoTitolo.split(".").length > 1) {
                                        var numeroIntero = data.results[dr].ZimpoTitolo
                                        var importoPrimaVirgola = numeroIntero.split(".")
                                        var numPunti = ""
                                        var migliaia = importoPrimaVirgola[0].split('').reverse().join('').match(/.{1,3}/g).map(function (x) {
                                            return x.split('').reverse().join('')
                                        }).reverse()

                                        for (var migl = 0; migl < migliaia.length; migl++) {
                                            numPunti = (numPunti + migliaia[migl] + ".")
                                        }
                                        var indice = numPunti.split("").length
                                        var impoTitolo = numPunti.substring(0, indice - 1) + "," + importoPrimaVirgola[1]
                                        that.getView().byId("HeaderInserisci").mAggregations.items[dr].mAggregations.cells[5].setText(impoTitolo)

                                    }
                                    else {
                                        var importoPrimaVirgola = numeroIntero.split(",")
                                        var impoTitolo = importoPrimaVirgola[0] + "." + importoPrimaVirgola[1]
                                        that.getView().byId("HeaderInserisci").mAggregations.items[dr].mAggregations.cells[5].setText(impoTitolo)
                                    }
                                }
                                that.viewHeader(data.results)
                            },
                            error: function (error) {
                                var e = error;
                            }
                        });
                        this.getOwnerComponent().setModel(oMdlITB, "HeaderInserisci");
                        this.callWorkflow()

                    }
                }

            },

            viewHeader: function (position) {
                // console.log(this.getView().getModel("temp").getData(
                // "/HeaderNISet('"+ oEvent.getParameters().arguments.campo +
                // "','"+ oEvent.getParameters().arguments.campo1 +
                // "','"+ oEvent.getParameters().arguments.campo2 +
                // "','"+ oEvent.getParameters().arguments.campo3 +
                // "','"+ oEvent.getParameters().arguments.campo4 +
                // "','"+ oEvent.getParameters().arguments.campo5 + "')"))
                var url = location.href
                var sUrl = url.split("/inserisciInvioFirma/")[1]
                var aValori = sUrl.split(",")

                var Bukrs = aValori[0]
                var Gjahr = aValori[1]
                var Zamministr = aValori[2]
                var ZchiaveNi = aValori[3]
                var ZidNi = aValori[4]
                var ZRagioCompe = aValori[5]

                var header = this.getView().getModel("temp").getData().HeaderNISet
                var position = position
                var valoriNuovi = this.getView().getModel("temp").getData().ValoriNuovi
                //var ImpegniSelezionati = this.getView().getModel("temp").getData().ImpegniSelezionati

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
                        switch (mese) {
                            case "1":
                                var nMese = "Gennaio"
                                break;
                            case "2":
                                var nMese = "Febbraio"
                                break;
                            case "3":
                                var nMese = "Marzo"
                                break;
                            case "4":
                                var nMese = "Aprile"
                                break;
                            case "5":
                                var nMese = "Maggio"
                                break;
                            case "6":
                                var nMese = "Giugno"
                                break;
                            case "7":
                                var nMese = "Luglio"
                                break;
                            case "8":
                                var nMese = "Agosto"
                                break;
                            case "9":
                                var nMese = "Settembre"
                                break;
                            case "10":
                                var nMese = "Ottobre"
                                break;
                            case "11":
                                var nMese = "Novembre"
                                break;
                            case "12":
                                var nMese = "Dicembre"
                                break;
                            default: break;

                        }
                        this.getView().byId("mese1").setText(nMese)

                        for (var x = 0; x < position.length; x++) {
                            if (position[x].Bukrs == Bukrs &&
                                position[x].Gjahr == Gjahr &&
                                position[x].Zamministr == Zamministr &&
                                position[x].ZchiaveNi == ZchiaveNi &&
                                position[x].ZidNi == ZidNi &&
                                position[x].ZRagioCompe == ZRagioCompe) {

                                var comp = position[x].ZcompRes
                                if (comp == "C") var n_comp = 'Competenza'
                                if (comp == "R") var n_comp = 'Residui'       //Position
                                this.getView().byId("comp1").setText(n_comp)

                                var beneficiario = position[x].Lifnr
                                this.onCallFornitore(beneficiario)
                                this.getView().byId("Lifnr1").setText(beneficiario)

                                var centroCosto = position[x].Kostl
                                this.getView().byId("CentroCosto1").setText(centroCosto)

                                var centroCOGE = position[x].Saknr
                                this.getView().byId("ConCoGe1").setText(centroCOGE)

                                var codiceGestionale = position[x].Zcodgest
                                this.getView().byId("CodiceGes1").setText(codiceGestionale)

                                var causalePagamento = position[x].Zcauspag
                                this.getView().byId("CausalePagamento1").setText(causalePagamento)

                                var modalitàPagamento = position[x].Zwels
                                this.getView().byId("Zwels1").setText(modalitàPagamento)

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
                        this.getView().byId("ImpLiq1").setText(importoTot)


                    }
                }
            },

            onCallFornitore(beneficiario){
                var filtriFornitori = []
                var that = this
                var oMdlFor = new sap.ui.model.json.JSONModel();
                //var Lifnr = this.getView().byId("inputBeneficiario").getValue()

                // filtriFornitori.push(new Filter({
                //     path: "Lifnr",
                //     operator: FilterOperator.EQ,
                //     value1: Lifnr
                // }));

                var chiavi = this.getOwnerComponent().getModel().createKey("/FornitoreSet", {
                    Lifnr: beneficiario
                });

                this.getOwnerComponent().getModel().read(chiavi, {
                    filters: filtriFornitori,
                    success: function (data) {
                        oMdlFor.setData(data);
                        that.getView().getModel("temp").setProperty('/FornitoreSet', data)
                        that.getView().byId("Nome1").setText(data.ZzragSoc)

                    },
                    error: function (error) {
                        var e = error;
                    }
                });
            },

            callWorkflow: function () {

                var url = location.href
                var sUrl = url.split("/inserisciInvioFirma/")[1]
                var aValori = sUrl.split(",")

                var Bukrs = aValori[0]
                var Gjahr = aValori[1]
                var Zamministr = aValori[2]
                var ZchiaveNi = aValori[3]
                var ZidNi = aValori[4]
                var ZRagioCompe = aValori[5]

                var filtroNI = []
                var header = this.getView().getModel("temp").getData().HeaderNISet
                //var position = this.getView().getModel("temp").getData().PositionNISet
                for (var i = 0; i < header.length; i++) {

                    if (header[i].Bukrs == Bukrs &&
                        header[i].Gjahr == Gjahr &&
                        header[i].Zamministr == Zamministr &&
                        header[i].ZchiaveNi == ZchiaveNi &&
                        header[i].ZidNi == ZidNi &&
                        header[i].ZRagioCompe == ZRagioCompe) {

                        //filtroNI.push({Bukrs:Bukrs, Gjahr:Gjahr, Zamministr,Zamministr, ZchiaveNi:ZchiaveNi, ZidNi:ZidNi, ZRagioCompe:ZRagioCompe})
                        filtroNI.push(new Filter({
                            path: "ZchiaveNi",
                            operator: FilterOperator.EQ,
                            value1: header[i].ZchiaveNi
                        }));

                        var that = this;
                        //var oMdlITB = new sap.ui.model.json.JSONModel();
                        this.getOwnerComponent().getModel().read("/WFStateNISet", {
                            filters: filtroNI,
                            //filters: [],
                            urlParameters: "",

                            success: function (data) {
                                that.getView().getModel("temp").setProperty('/WFStateNI', data.results)

                            },
                            error: function (error) {
                                var e = error;
                            }
                        });
                    }
                }

            },

            onSelect: function (oEvent) {

                var key = oEvent.getParameters().key;

                if (key === "ListaDettagli") {
                    this.getView().byId("inserisciInvioFirmaITB").destroyContent()
                }

                else if (key === "Workflow") {
                    this.getView().byId("inserisciInvioFirmaITB").destroyContent()
                }

                else if (key === "Fascicolo") {

                }


            },

            onBackButton: function () {
                window.history.go(-1);
            },

            onEditRow: function () {
                var url = location.href
                var sUrl = url.split("/inserisciInvioFirma/")[1]
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
                        this.getOwnerComponent().getRouter().navTo("RettificaNI", { campo: header[i].Bukrs, campo1: header[i].Gjahr, campo2: header[i].Zamministr, campo3: header[i].ZchiaveNi, campo4: header[i].ZidNi, campo5: header[i].ZRagioCompe });
                    }
                }
            },

            pressFirma: function () {

                var url = location.href
                var sUrl = url.split("/inserisciInvioFirma/")[1]
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
                        this.getOwnerComponent().getRouter().navTo("inserisciFirma", { campo: header[i].Bukrs, campo1: header[i].Gjahr, campo2: header[i].Zamministr, campo3: header[i].ZchiaveNi, campo4: header[i].ZidNi, campo5: header[i].ZRagioCompe });
                    }
                }
            },


            pressRettificaNI: function () {
                //var oProprietà = this.getView().getModel();
                this.getView().byId("editRow").setEnabled(true);
            },

            onCancelNI: function () {
                var that = this

                var url = location.href
                var sUrl = url.split("/inserisciInvioFirma/")[1]
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

                        var indiceHeader = i

                        var deepEntity = {
                            HeaderNISet: null,
                            Funzionalita: 'ANNULLAMENTOPROVVISORIA',
                        }

                        //var statoNI = this.getView().byId("idModificaDettaglio").mBindingInfos.items.binding.oModel.oZcodiStatoni
                        MessageBox.warning("Sei sicuro di voler annullare la Nota d'Imputazione n° " + header[i].ZchiaveNi + "?", {
                            title: "Annullamento NI",
                            actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
                            emphasizedAction: MessageBox.Action.YES,
                            onClose: function (oAction) {
                                if (oAction === sap.m.MessageBox.Action.YES) {
                                    var oModel = that.getOwnerComponent().getModel();

                                    deepEntity.ZchiaveNi = that.getView().byId("numNI1").mProperties.text
                                    // deepEntity.Bukrs = item.Zamministr, //Passato Da BE
                                    // deepEntity.Gjahr = that.getView().byId("numNI1").mProperties.text.split("-")[0],
                                    // deepEntity.Zamministr = item.Zamministr, //Passato Da BE
                                    // deepEntity.ZidNi = item.ZidNi, //Incrementato da BE
                                    // deepEntity.ZRagioCompe = item.ZRagioCompe, //Passato Da BE

                                    deepEntity.HeaderNISet = header[indiceHeader];
                                    deepEntity.HeaderNISet.ZcodiStatoni = "01"

                                    var numeroIntero = header[indiceHeader].ZimpoTotni
                                    var numIntTot = ""
                                    if (numeroIntero.split(".").length > 1) {
                                        var numeri = numeroIntero.split(".")
                                        for (var n = 0; n < numeri.length; n++) {
                                            numIntTot = numIntTot + numeri[n]
                                            //var numeroFloat = parseFloat(numeroIntero)
                                            if (numIntTot.split(",").length > 1) {
                                                var virgole = numIntTot.split(",")
                                                var numeroInteroSM = virgole[0] + "." + virgole[1]
                                            }
                                        }
                                        var importoPrimaVirgola = numeroIntero.split(".")
                                        var numPunti = ""
                                        var migliaia = importoPrimaVirgola[0].split('').reverse().join('').match(/.{1,3}/g).map(function (x) {
                                            return x.split('').reverse().join('')
                                        }).reverse()

                                        for (var migl = 0; migl < migliaia.length; migl++) {
                                            numPunti = (numPunti + migliaia[migl] + ".")
                                        }
                                        var indice = numPunti.split("").length
                                        var numeroIntero = numPunti.substring(0, indice - 1) + "," + importoPrimaVirgola[1]
                                        header[indiceHeader].ZimpoTotni = numeroInteroSM
                                    }

                                    else {
                                        var importoPrimaVirgola = numeroIntero.split(",")
                                        var numeroInteroSM = importoPrimaVirgola[0] + "." + importoPrimaVirgola[1]
                                        header[indiceHeader].ZimpoTotni = numeroInteroSM
                                    }

                                    //deepEntity.HeaderNISet[indiceHeader].ZimpoTotni = impoTot

                                    oModel.create("/DeepZNIEntitySet", deepEntity, {
                                        //urlParameters: {'funzionalita': 'ANNULLAMENTOPREIMPOSTATA'},
                                        // method: "PUT",
                                        success: function (result) {
                                            if (result.Msgty == 'E') {
                                                console.log(result.Message)
                                                MessageBox.error("Operazione non eseguita correttamente", {
                                                    title: "Esito Operazione",
                                                    actions: [sap.m.MessageBox.Action.OK],
                                                    emphasizedAction: MessageBox.Action.OK,
                                                })
                                            }
                                            if (result.Msgty == 'S') {
                                                MessageBox.success("Nota di Imputazione " + header[indiceHeader].ZchiaveNi + " annullata correttamente", {
                                                    title: "Esito Operazione",
                                                    actions: [sap.m.MessageBox.Action.OK],
                                                    emphasizedAction: MessageBox.Action.OK,
                                                    onClose: function (oAction) {
                                                        if (oAction === sap.m.MessageBox.Action.OK) {
                                                            that.getOwnerComponent().getRouter().navTo("View1");
                                                            location.reload();
                                                        }
                                                    }
                                                })
                                            }
                                        },
                                        error: function (e) {
                                            //console.log("error");
                                            MessageBox.error("Operazione non eseguita", {
                                                title: "Esito Operazione",
                                                actions: [sap.m.MessageBox.Action.OK],
                                                emphasizedAction: MessageBox.Action.OK,
                                            })
                                        }
                                    });
                                    // var path = oModel.createKey("/HeaderNISet", {
                                    //     Bukrs:Bukrs,
                                    //     Gjahr:Gjahr,
                                    //     Zamministr:Zamministr,
                                    //     ZchiaveNi:ZchiaveNi,
                                    //     ZidNi:ZidNi,
                                    //     ZRagioCompe:ZRagioCompe,
                                    //     Funzionalita:"ANNULLAMENTOPREIMPOSTATA"
                                    //     });

                                    //     var oEntry = {};
                                    //     oEntry.ZcodiStatoni = "09";
                                    // }
                                    // oModel.update(path, oEntry, {
                                    //     //urlParameters: {'funzionalita': 'ANNULLAMENTOPREIMPOSTATA'},
                                    //     // method: "PUT",
                                    //     success: function (data) {
                                    //         //console.log("success");
                                    //         MessageBox.success("Operazione eseguita con successo")
                                    //         that.getOwnerComponent().getRouter().navTo("View1")
                                    //         location.reload();
                                    //     },
                                    //     error: function (e) {
                                    //         //console.log("error");
                                    //         MessageBox.error("Operazione non eseguita")
                                    //     }
                                    // });      
                                }
                            }
                        });
                    }
                }
            }

        });
    }
);
