sap.ui.define(
    [
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
    function (BaseController, Filter, FilterOperator, JSONModel, Spreadsheet, CoreLibrary, DateFormatter, MessageBox) {
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
                this.getRouter().getRoute("inserisciInvioFirma").attachPatternMatched(this._onObjectMatched, this);

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
                //var valoriNuovi = this.getView().getModel("temp").getData().ValoriNuovi
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
                        this.getView().byId("mese1").setText(mese)

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

                                //var Zattribuito = impegni[o].Zattribuito

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

            onCancelNI: function(){
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
                            title:"Annullamento NI",
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
                                            

                                        var numeroIntero = that.getView().byId("importoTot1").mProperties.text
                                        if (numeroIntero.split(".").length > 1) {
                                            var importoPrimaVirgola = numeroIntero.split(".")
                                            var numPunti = ""
                                            var migliaia = importoPrimaVirgola[0].split('').reverse().join('').match(/.{1,3}/g).map(function (x) {
                                                return x.split('').reverse().join('')
                                            }).reverse()

                                            for (var migl = 0; migl < migliaia.length; migl++) {
                                                numPunti = (numPunti + migliaia[migl] + ".")
                                            }
                                            var indice = numPunti.split("").length
                                            var impoTot = numPunti.substring(0, indice - 1) + "," + importoPrimaVirgola[1]

                                        }
                                        else {
                                            var importoPrimaVirgola = numeroIntero.split(",")
                                            var impoTot = importoPrimaVirgola[0] + "." + importoPrimaVirgola[1]
                                        }

                                        header[indiceHeader].ZimpoTotni = impoTot
                                        deepEntity.HeaderNISet = header[indiceHeader];
                                        //deepEntity.HeaderNISet[indiceHeader].ZimpoTotni = impoTot
                                    
                                        oModel.create("/DeepZNIEntitySet", deepEntity, {
                                            //urlParameters: {'funzionalita': 'ANNULLAMENTOPREIMPOSTATA'},
                                            // method: "PUT",
                                            success: function (result) {
                                                if (result.Msgty == 'E') {
                                                    console.log(result.Message)
                                                    MessageBox.error("Operazione non eseguita correttamente", {
                                                        title:"Esito Operazione",
                                                        actions: [sap.m.MessageBox.Action.OK],
                                                        emphasizedAction: MessageBox.Action.OK,
                                                    })
                                                }
                                                if (result.Msgty == 'S') {
                                                    MessageBox.success("Operazione eseguita correttamente", {
                                                        title:"Esito Operazione",
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
                                                    title:"Esito Operazione",
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
