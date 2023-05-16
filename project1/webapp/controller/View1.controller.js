sap.ui.define([
    "sap/ui/model/odata/v2/ODataModel",
    // "sap/ui/core/mvc/Controller",
    "./BaseController",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageBox",
    'sap/ui/export/Spreadsheet',
    'project1/model/DateFormatter'

],

    function (ODataModel, BaseController, Filter, FilterOperator, MessageBox, Spreadsheet, DateFormatter) {
        "use strict";
        var EdmType = sap.ui.export.EdmType

        //popupino warning
        return BaseController.extend("project1.controller.View1", {
            formatter: DateFormatter,

            onInit: function () {
                //console.log("onInit View1 controller")
                this.callVisibilità()
                this.esercizioDecreto()
                //this.chiaveNI()
                this.Zamministr()
                //this.ZRagioCompe()
                this.mese()
                this.esercizioGestione()
                this.EsercizioPosizioneFinanziaria()
                this.onCallStateNI()
            },

            onWarning2MessageBoxPress: function () {
                MessageBox.warning("Sei sicuro di voler completare la Nota di Imputazione n.X?", {
                    actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
                    emphasizedAction: MessageBox.Action.OK,
                    onClose: function (oAction) {
                        MessageBox.warning("Conferma", {
                            actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL]
                        }
                        )
                    }
                })
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
                    if (data[d].ACTV_1 == "Z01") {
                        this.getView().byId("PreimpostazioneNI").setEnabled(true);
                    }
                    if (data[d].ACTV_3 == "Z03") {
                        this.getView().byId("DettagliNI").setEnabled(true);
                    }
                }
            },

            mese: function () {
                var that = this;
                var oMdl = new sap.ui.model.json.JSONModel();
                this.getOwnerComponent().getModel().read("/ZmeseSet", {
                    filters: [],
                    urlParameters: "",
                    success: function (data) {
                        oMdl.setData(data.results);
                        that.getView().getModel("temp").setProperty('/ZmeseSet', data.results)
                    },
                    error: function (error) {
                        //that.getView().getModel("temp").setProperty(sProperty,[]);
                        //that.destroyBusyDialog();
                        var e = error;
                    }
                });
            },

            Zamministr: function(){
                var that = this;
                var oMdl = new sap.ui.model.json.JSONModel();
                this.getOwnerComponent().getModel().read("/ZamministrNiSet", {
                    filters: [],
                    urlParameters: "",
                    success: function (data) {
                        oMdl.setData(data.results);
                        that.getView().getModel("temp").setProperty('/ZamministrNiSet', data.results)
                        that.getView().byId("amministrazioneEG1").setValue(data.results[0].Zamministr)
                    },
                    error: function (error) {
                        //that.getView().getModel("temp").setProperty(sProperty,[]);
                        //that.destroyBusyDialog();
                        var e = error;
                    }
                });
            },

            ZRagioCompe: function(){
                var that = this;
                var oModel = this.getOwnerComponent().getModel();
                var oMdl = new sap.ui.model.json.JSONModel();
                var ZamministrNiSet = this.getView().getModel("temp").getData().ZamministrNiSet
                var Gjahr = this.getView().byId("es_gestione").getSelectedItem().mProperties.text
                var Zamministr = ZamministrNiSet[0].Zamministr

                //var datiNI = []

                // datiNI.push(new Filter({
                //     path: "Gjahr",
                //     operator: FilterOperator.EQ,
                //     value1: Gjahr,
                // }));
                // datiNI.push(new Filter({
                //     path: "Zamministr",
                //     operator: FilterOperator.EQ,
                //     value1: Zamministr,
                // }));

                 var path = oModel.createKey("/ZRagioCompeSet", {
                        Gjahr:Gjahr,
                        Zamministr:Zamministr
                        });
                
                this.getOwnerComponent().getModel().read(path, {
                    filters: [],
                    urlParameters: "",
                    success: function (data) {
                        oMdl.setData(data);
                        that.getView().getModel("temp").setProperty('/ZRagioCompeSet', data)
                        that.getView().byId("ragioneria1").setValue(data.CodiceRagioneria)
                    },
                    error: function (error) {
                        //that.getView().getModel("temp").setProperty(sProperty,[]);
                        //that.destroyBusyDialog();
                        var e = error;
                    }
                });
            },

            esercizioDecreto: function () {
                var that = this;
                var oMdl = new sap.ui.model.json.JSONModel();
                this.getOwnerComponent().getModel().read("/ZgjahrEngNiSet", {
                    filters: [],
                    urlParameters: "",
                    success: function (data) {
                        oMdl.setData(data.results);
                        that.getView().getModel("temp").setProperty('/ZgjahrEngNiSet', data.results)
                    },
                    error: function (error) {
                        //that.getView().getModel("temp").setProperty(sProperty,[]);
                        //that.destroyBusyDialog();
                        var e = error;
                    }
                });
            },

            esercizioGestione: function () {
                var that = this;
                var oMdl = new sap.ui.model.json.JSONModel();
                this.getOwnerComponent().getModel().read("/GjahrNiSet", {
                    filters: [],
                    urlParameters: "",
                    success: function (data) {
                        oMdl.setData(data.results);
                        that.getView().getModel("temp").setProperty('/GjahrNiSet', data.results)
                    },
                    error: function (error) {
                        //that.getView().getModel("temp").setProperty(sProperty,[]);
                        //that.destroyBusyDialog();
                        var e = error;
                    }
                });
            },

            createColumnConfig: function () {
                var aCols = [];

                aCols.push({
                    property: 'ZchiaveNi',
                    type: EdmType.String
                });

                aCols.push({
                    property: 'Fistl',
                    type: EdmType.String
                });

                aCols.push({
                    property: 'Fipex',
                    type: EdmType.String
                });

                aCols.push({
                    property: 'ZoggSpesa',
                    type: EdmType.String
                });

                aCols.push({
                    property: 'Zmese',
                    type: EdmType.String
                });

                aCols.push({
                    property: 'ZcodiStatoni',
                    type: EdmType.String
                });

                aCols.push({
                    property: 'ZimpoTotni',
                    type: EdmType.Number
                });

                return aCols;
            },

            onExport: function () {
                //console.log("onExport")
                var aCols, oRowBinding, oSettings, oSheet, oTable;

                if (!this._oTable) {
                    this._oTable = this.byId('HeaderNI');
                }

                oTable = this._oTable;


                // var oSelectedItemPath = oEvent.getSource().getParent().getBindingContextPath();
                // var oSelectedItem = this.getOwnerComponent().getModel("booksMdl").getObject(oSelectedItemPath);

                //console.log("table1: " + oTable)
                oRowBinding = oTable.getBinding('items');
                //console.log("row binding: " + oRowBinding);
                aCols = this.createColumnConfig();

                oSettings = {
                    workbook: {
                        columns: aCols,
                        hierarchyLevel: 'Level'
                    },
                    dataSource: oRowBinding,
                    fileName: 'Esportazione NI',
                    worker: false // We need to disable worker because we are using a MockServer as OData Service
                };

                oSheet = new sap.ui.export.Spreadsheet(oSettings);
                oSheet.build().finally(function () {
                    oSheet.destroy();
                });
            },

            onNavToIconTB: function () {
                var row = this.getView().byId("HeaderNI").getSelectedItem().getBindingContext("HeaderNI").getObject()
                if (row.ZcodiStatoni == "NI Preimpostata")
                    this.getOwnerComponent().getRouter().navTo("iconTabBar", { campo: row.Bukrs, campo1: row.Gjahr, campo2: row.Zamministr, campo3: row.ZchiaveNi, campo4: row.ZidNi, campo5: row.ZRagioCompe })
                if (row.ZcodiStatoni == "NI Provvisoria")
                    this.getOwnerComponent().getRouter().navTo("inserisciInvioFirma", { campo: row.Bukrs, campo1: row.Gjahr, campo2: row.Zamministr, campo3: row.ZchiaveNi, campo4: row.ZidNi, campo5: row.ZRagioCompe })
                if (row.ZcodiStatoni == "NI Inviata alla firma")
                    this.getOwnerComponent().getRouter().navTo("revocaFirma", { campo: row.Bukrs, campo1: row.Gjahr, campo2: row.Zamministr, campo3: row.ZchiaveNi, campo4: row.ZidNi, campo5: row.ZRagioCompe })
                if (row.ZcodiStatoni == "")
                    this.getOwnerComponent().getRouter().navTo("passaggioStato", { campo: row.Bukrs, campo1: row.Gjahr, campo2: row.Zamministr, campo3: row.ZchiaveNi, campo4: row.ZidNi, campo5: row.ZRagioCompe })
                if (row.ZcodiStatoni == "NI In Verifica")
                    this.getOwnerComponent().getRouter().navTo("richiamaNI", { campo: row.Bukrs, campo1: row.Gjahr, campo2: row.Zamministr, campo3: row.ZchiaveNi, campo4: row.ZidNi, campo5: row.ZRagioCompe })
                if (row.ZcodiStatoni == "NI Confermata")
                    this.getOwnerComponent().getRouter().navTo("conferma", { campo: row.Bukrs, campo1: row.Gjahr, campo2: row.Zamministr, campo3: row.ZchiaveNi, campo4: row.ZidNi, campo5: row.ZRagioCompe })
                if (row.ZcodiStatoni == "NI Validata RGS")
                    this.getOwnerComponent().getRouter().navTo("richiamoNIRGS", { campo: row.Bukrs, campo1: row.Gjahr, campo2: row.Zamministr, campo3: row.ZchiaveNi, campo4: row.ZidNi, campo5: row.ZRagioCompe })
                if (row.ZcodiStatoni == "NI con Rilievo Registrato")
                    this.getOwnerComponent().getRouter().navTo("richiamoRilievoRegistrato", { campo: row.Bukrs, campo1: row.Gjahr, campo2: row.Zamministr, campo3: row.ZchiaveNi, campo4: row.ZidNi, campo5: row.ZRagioCompe })
                if (row.ZcodiStatoni == "NI Annullata")
                    this.getOwnerComponent().getRouter().navTo("annullataNI", { campo: row.Bukrs, campo1: row.Gjahr, campo2: row.Zamministr, campo3: row.ZchiaveNi, campo4: row.ZidNi, campo5: row.ZRagioCompe })
                if (row.ZcodiStatoni == "NI Annullata per Richiamo")
                    this.getOwnerComponent().getRouter().navTo("annullataNIRichiamo", { campo: row.Bukrs, campo1: row.Gjahr, campo2: row.Zamministr, campo3: row.ZchiaveNi, campo4: row.ZidNi, campo5: row.ZRagioCompe })
                if (row.ZcodiStatoni == "NI Annullata per Rilievo")
                    this.getOwnerComponent().getRouter().navTo("annullataNIRilievo", { campo: row.Bukrs, campo1: row.Gjahr, campo2: row.Zamministr, campo3: row.ZchiaveNi, campo4: row.ZidNi, campo5: row.ZRagioCompe })
            },

            navToDettagliNI: function (oEvent) {
                this.onNavToIconTB()
            },


            //CONTROLLO PER FAR VISUALIZZARE SOLO UN FILTRO NELLE COMBOBOX

            // checkItemCB: function (oEvent) {
            //     //this.getView().byId("filterbar").mAggregations.filterGroupItems
            //     var listaDoppEG = []
            //     var listaEG = []
            //     var numFilter = oEvent.getParameters().selectionSet.length;
            //     for (var i = 0; i < numFilter; i++) {
            //         var valore = oEvent.getParameters().selectionSet[i].mProperties.value
            //         if (valore && valore != "null") {
            //             if (!listaEG.includes(valore)) {
            //                 listaEG.push({
            //                     code: valore
            //                 });
            //                 listaDoppEG.push(valore)
            //             }

            //         }

            //     }
            //     var esGestioneModel = new sap.ui.model.json.JSONModel(listaEG);
            //     this.getOwnerComponent().setModel(esGestioneModel, "esGestioneModel");
            // },

            //ZgjahrEngNi

            chiaveNI: function () {
                this.chiaveSubNI()
                this.ZRagioCompe()
                var that = this
                var datiNI = []
                var visibilità = this.getView().getModel("temp").getData().Visibilità[0]
                var Gjahr = this.getView().byId("es_gestione").getSelectedItem().mProperties.text

                datiNI.push(new Filter({
                    path: "Gjahr",
                    operator: FilterOperator.EQ,
                    value1: Gjahr,
                }));

                this.getView().getModel().read("/ZhfNotabozzaSet", {
                    filters: datiNI,
                    urlParameters: { "AutorityRole": visibilità.AGR_NAME, "AutorityFikrs": visibilità.FIKRS, "AutorityPrctr": visibilità.PRCTR },
                    success: function (data) {
                        //oMdl.setData(data.results);
                        that.getView().getModel("temp").setProperty('/ZhfNotabozzaSet', data.results)
                        //that.setDescrizioneStato(data.results)
                    },
                    error: function (error) {
                        //that.getView().getModel("temp").setProperty(sProperty,[]);
                        //that.destroyBusyDialog();
                        var e = error;
                    }
                })
            },

            chiaveSubNI: function () {
                var that = this
                var datiNI = []
                var visibilità = this.getView().getModel("temp").getData().Visibilità[0]
                var Gjahr = this.getView().byId("es_gestione").getSelectedItem().mProperties.text

                datiNI.push(new Filter({
                    path: "Gjahr",
                    operator: FilterOperator.EQ,
                    value1: Gjahr,
                }));

                this.getView().getModel().read("/ZhfNotaimpSet", {
                    filters: datiNI,
                    urlParameters: { "AutorityRole": visibilità.AGR_NAME, "AutorityFikrs": visibilità.FIKRS, "AutorityPrctr": visibilità.PRCTR },
                    success: function (data) {
                        //oMdl.setData(data.results);
                        that.getView().getModel("temp").setProperty('/ZhfNotaimpSet', data.results)
                        //that.setDescrizioneStato(data.results)
                    },
                    error: function (error) {
                        //that.getView().getModel("temp").setProperty(sProperty,[]);
                        //that.destroyBusyDialog();
                        var e = error;
                    }
                })
            },

            EsercizioPosizioneFinanziaria: function () {
                var that = this;
                var oMdl = new sap.ui.model.json.JSONModel();
                this.getOwnerComponent().getModel().read("/EsercizioNiSet", {
                    filters: [],
                    urlParameters: "",
                    success: function (data) {
                        oMdl.setData(data.results);
                        that.getView().getModel("temp").setProperty('/EsercizioNiSet', data.results)
                    },
                    error: function (error) {
                        //that.getView().getModel("temp").setProperty(sProperty,[]);
                        //that.destroyBusyDialog();
                        var e = error;
                    }
                });
            },



            onSearch: function (oEvent) {
                this.getView().byId("PreimpostazioneNI").setEnabled(true);
                var visibilità = this.getView().getModel("temp").getData().Visibilità[0]

                var that = this;
                var datiNI = [];

                // var abc=this.getView().byId("filterbar").getAllFilterItems();

                var bindingInfo = ""
                var path = ""

                var numFilter = oEvent.getParameters().selectionSet.length;

                for (let i = 0; i < numFilter; i++) {

                    bindingInfo = "items"
                    path = oEvent.getParameters().selectionSet[i].getBindingInfo(bindingInfo)
                    if (path == undefined) {
                        bindingInfo = "suggestionItems"
                        path = oEvent.getParameters().selectionSet[i].getBindingInfo(bindingInfo)
                    }
                    var filtro = oEvent.getParameters().selectionSet[i]

                    if (filtro) {
                        if (i == 4) {
                            if (oEvent.getParameters().selectionSet[4].mProperties.value != '') {
                                datiNI.push(new Filter({
                                    path: "ZchiaveNi",
                                    operator: FilterOperator.BT,
                                    value1: oEvent.getParameters().selectionSet[4].mProperties.value,
                                    value2: oEvent.getParameters().selectionSet[5].mProperties.value
                                }));
                            }
                        }
                        if (i == 6) {
                            if (oEvent.getParameters().selectionSet[6].mProperties.value != '') {
                                datiNI.push(new Filter({
                                    path: "ZzChiaveSubniPos",
                                    operator: FilterOperator.BT,
                                    value1: oEvent.getParameters().selectionSet[6].mProperties.value,
                                    value2: oEvent.getParameters().selectionSet[7].mProperties.value
                                }));
                            }
                        }
                        if (i == 16) {
                            if (oEvent.getParameters().selectionSet[16].mProperties.value != '') {
                                datiNI.push(new Filter({
                                    path: "Zcoddecr",
                                    operator: FilterOperator.BT,
                                    value1: oEvent.getParameters().selectionSet[16].mProperties.value,
                                    value2: oEvent.getParameters().selectionSet[17].mProperties.value
                                }));
                            }
                        }
                        if (i == 18) {
                            if (oEvent.getParameters().selectionSet[18].mProperties.value != '') {
                                datiNI.push(new Filter({
                                    path: "ZzCodIpePos",
                                    operator: FilterOperator.BT,
                                    value1: oEvent.getParameters().selectionSet[18].mProperties.value,
                                    value2: oEvent.getParameters().selectionSet[19].mProperties.value
                                }));
                            }
                        }
                        if (i == 20) {
                            if (oEvent.getParameters().selectionSet[20].mProperties.value != '') {
                                datiNI.push(new Filter({
                                    path: "ZzNumClaPos",
                                    operator: FilterOperator.BT,
                                    value1: oEvent.getParameters().selectionSet[20].mProperties.value,
                                    value2: oEvent.getParameters().selectionSet[21].mProperties.value
                                }));
                            }
                        }



                        else if (i == 5 || i == 7 || i == 17 || i == 19 || i == 21) {
                            continue
                        }

                        if (filtro.mProperties.dateValue instanceof Date || !isNaN(filtro.mProperties.dateValue)) {
                            if (i == 8) {
                                if (oEvent.getParameters().selectionSet[8].mProperties.value != '') {
                                    datiNI.push(new Filter({
                                        path: "ZdataCreaz",
                                        operator: FilterOperator.BT,
                                        value1: oEvent.getParameters().selectionSet[8].mProperties.value,
                                        value2: oEvent.getParameters().selectionSet[9].mProperties.value
                                    }));
                                }
                            }
                            if (i == 20) {
                                if (oEvent.getParameters().selectionSet[18].mProperties.value != '') {
                                    datiNI.push(new Filter({
                                        path: "ZdataFirmNi",
                                        operator: FilterOperator.BT,
                                        value1: oEvent.getParameters().selectionSet[20].mProperties.value,
                                        value2: oEvent.getParameters().selectionSet[21].mProperties.value
                                    }));
                                }
                            }
                            if (i == 22) {
                                if (oEvent.getParameters().selectionSet[20].mProperties.value != '') {
                                    datiNI.push(new Filter({
                                        path: "ZdataProtAmm",
                                        operator: FilterOperator.BT,
                                        value1: oEvent.getParameters().selectionSet[22].mProperties.value,
                                        value2: oEvent.getParameters().selectionSet[23].mProperties.value
                                    }));
                                }
                            }
                            if (i == 25) {
                                if (oEvent.getParameters().selectionSet[23].mProperties.value != '') {
                                    datiNI.push(new Filter({
                                        path: "ZdataProtRag",
                                        operator: FilterOperator.BT,
                                        value1: oEvent.getParameters().selectionSet[25].mProperties.value,
                                        value2: oEvent.getParameters().selectionSet[26].mProperties.value
                                    }));
                                }
                            }
                        }
                        else if (oEvent.getParameters().selectionSet[i].mProperties.value != '' && i != 4 && i != 6 && i != 11 && i != 10 && i != 16 && i != 18 && i != 20) {
                            datiNI.push(new Filter({
                                path: path.sorter.sPath,
                                operator: FilterOperator.EQ,
                                value1: filtro.getValue()
                            }));
                            //datiNI.push("?$filter= "+path.sorter.sPath+" eq '" + filtro.getValue() + "'");
                        }
                        else if (i == 9 || i == 21 || i == 23 || i == 26) {
                            continue
                        }

                        else if (i == 0) {
                            if (oEvent.getParameters().selectionSet[i].mProperties.value == '') {
                                MessageBox.error("Valorizzare Esercizio di gestione", {
                                    actions: [sap.m.MessageBox.Action.OK],
                                    emphasizedAction: MessageBox.Action.OK,
                                })
                            }
                        }
                        else if (i == 11) {
                            var stati = this.getView().getModel("temp").getData().StateNI
                            for (var st = 0; st < stati.length; st++) {
                                if (oEvent.getParameters().selectionSet[i].mProperties.value == stati[st].ZstatoDescNi) {
                                    datiNI.push(new Filter({
                                        path: "ZcodiStatoni",
                                        operator: FilterOperator.EQ,
                                        value1: stati[st].ZcodiStatoni
                                    }));
                                }

                            }

                        }
                        else if (i == 10) {
                            var mese = this.getView().getModel("temp").getData().ZmeseSet
                            for (var me = 0; me < mese.length; me++) {
                                if (oEvent.getParameters().selectionSet[i].mProperties.value == mese[me].Descrizione) {
                                    switch (mese[me].Descrizione) {
                                        case "Gennaio":
                                            var nMese = "1"
                                            break;
                                        case "Febbraio":
                                            var nMese = "2"
                                            break;
                                        case "Marzo":
                                            var nMese = "3"
                                            break;
                                        case "Aprile":
                                            var nMese = "4"
                                            break;
                                        case "Maggio":
                                            var nMese = "5"
                                            break;
                                        case "Giugno":
                                            var nMese = "6"
                                            break;
                                        case "Luglio":
                                            var nMese = "7"
                                            break;
                                        case "Agosto":
                                            var nMese = "8"
                                            break;
                                        case "Settembre":
                                            var nMese = "9"
                                            break;
                                        case "Ottobre":
                                            var nMese = "10"
                                            break;
                                        case "Novembre":
                                            var nMese = "11"
                                            break;
                                        case "Dicembre":
                                            var nMese = "12"
                                            break;
                                        default: break;
                                    }

                                    datiNI.push(new Filter({
                                        path: "Zmese",
                                        operator: FilterOperator.EQ,
                                        value1: nMese
                                    }));
                                }

                            }

                        }
                    }
                }
                if (datiNI.length != 0 && datiNI[0].sPath == "Gjahr") {
                    //console.log(datiNI)
                    var that = this;
                    var oMdl = new sap.ui.model.json.JSONModel();

                    // var path = this.getView().getModel().createKey("/HeaderNISet", {
                    //     AutorityRole:visibilità.AGR_NAME,
                    //     AutorityFikrs:visibilità.FIKRS,
                    //     AutorityPrctr:visibilità.PRCTR,
                    //     });

                    this.getView().getModel().read("/HeaderNISet", {
                        filters: datiNI,
                        urlParameters: { "AutorityRole": visibilità.AGR_NAME, "AutorityFikrs": visibilità.FIKRS, "AutorityPrctr": visibilità.PRCTR },
                        success: function (data) {
                            oMdl.setData(data.results);
                            that.getView().getModel("temp").setProperty('/HeaderNISet', data.results)
                            that.setVirgolaMigliaia(data.results)
                            that.setDescrizioneStato(data.results)
                        },
                        error: function (error) {
                            MessageBox.error("Errore durante l'estrazione della tabella", {
                                actions: [sap.m.MessageBox.Action.OK],
                                emphasizedAction: MessageBox.Action.OK,
                            })
                        }
                    });

                }

                this.getOwnerComponent().setModel(oMdl, "HeaderNI");
                //sap.ui.getCore().TableModel = oMdlW;
                this.getView().byId("Esporta").setEnabled(true);

                //this.checkItemCB(oEvent)
            },

            setVirgolaMigliaia: function (header) {
                for (var x = 0; x < header.length; x++) {
                    var arrayVirgola = header[x].ZimpoTotni.split(".")
                    // var importoVirgola = arrayVirgola[0]+","+arrayVirgola[1]

                    var numPunti = ""
                    var migliaia = arrayVirgola[0].split('').reverse().join('').match(/.{1,3}/g).map(function (x) {
                        return x.split('').reverse().join('')
                    }).reverse()
                    for (var i = 0; i < migliaia.length; i++) {
                        numPunti = (numPunti + migliaia[i] + ".")
                    }

                    var indice = numPunti.split("").length
                    var totale = numPunti.substring(0, indice - 1) + "," + arrayVirgola[1]
                    let array = totale.split(",")
                    let valoreTagliato = array[1].substring(0, 2)
                    header[x].ZimpoTotni = array[0] + "," + valoreTagliato
                }

                var oMdl = new sap.ui.model.json.JSONModel();
                this.getView().getModel("temp").setProperty('/HeaderNISet', header)
                oMdl.setData(header);
                this.getOwnerComponent().setModel(oMdl, "HeaderNI");
            },

            setDescrizioneStato: function (header) {
                var that = this
                for (var x = 0; x < header.length; x++) {
                    switch (header[x].ZcodiStatoni) {
                        case "00":
                            that.getView().byId("HeaderNI").getItems()[x].mAggregations.cells[5].setText("NI Preimpostata")
                            break;
                        case "01":
                            that.getView().byId("HeaderNI").getItems()[x].mAggregations.cells[5].setText("NI Provvisoria")
                            break;
                        case "02":
                            that.getView().byId("HeaderNI").getItems()[x].mAggregations.cells[5].setText("NI Inviata alla firma")
                            break;
                        case "03":
                            that.getView().byId("HeaderNI").getItems()[x].mAggregations.cells[5].setText("NI Firmata Amm.")
                            break;
                        case "04":
                            that.getView().byId("HeaderNI").getItems()[x].mAggregations.cells[5].setText("NI In Verifica")
                            break;
                        case "05":
                            that.getView().byId("HeaderNI").getItems()[x].mAggregations.cells[5].setText("NI Confermata")
                            break;
                        case "06":
                            that.getView().byId("HeaderNI").getItems()[x].mAggregations.cells[5].setText("NI Validata RGS")
                            break;
                        case "07":
                            that.getView().byId("HeaderNI").getItems()[x].mAggregations.cells[5].setText("NI con Rilievo Registrato")
                            break;
                        case "08":
                            that.getView().byId("HeaderNI").getItems()[x].mAggregations.cells[5].setText("NI con Rilievo Validato RGS")
                            break;
                        case "09":
                            that.getView().byId("HeaderNI").getItems()[x].mAggregations.cells[5].setText("NI Annullata")
                            break;
                        case "10":
                            that.getView().byId("HeaderNI").getItems()[x].mAggregations.cells[5].setText("NI Annullata per Richiamo")
                            break;
                        case "11":
                            that.getView().byId("HeaderNI").getItems()[x].mAggregations.cells[5].setText("NI Annullata per Rilievo")
                            break;
                        case "12":
                            that.getView().byId("HeaderNI").getItems()[x].mAggregations.cells[5].setText("NI Inviata a BKI")
                            break;
                    }
                }
            },

            navToWizard: function (oEvent) {
                this.getOwnerComponent().getRouter().navTo("wizard");
            },

            onRowSelectionChange: function (oEvent) {
                this.getView().byId("PreimpostazioneNI").setEnabled(false);
                this.getView().byId("DettagliNI").setEnabled(true);
            },

            onCallStateNI: function () {
                var that = this;
                //var oMdlITB = new sap.ui.model.json.JSONModel();
                this.getOwnerComponent().getModel().read("/StateNISet", {
                    filters: [],
                    //filters: [],
                    urlParameters: "",

                    success: function (data) {
                        that.getView().getModel("temp").setProperty('/StateNI', data.results)

                    },
                    error: function (error) {
                        var e = error;
                    }
                });
            }
        });
    });