sap.ui.define([
    // "sap/ui/core/mvc/Controller",
    "./BaseController",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageBox",
    'sap/ui/export/Spreadsheet',
    'project1/model/DateFormatter'

],

    function (BaseController, Filter, FilterOperator, MessageBox, Spreadsheet, DateFormatter) {
        "use strict";
        var EdmType = sap.ui.export.EdmType

        //popupino warning
        return BaseController.extend("project1.controller.View1", {
            formatter: DateFormatter,

            onInit: function () {
                //console.log("onInit View1 controller")
                this.esercizioGestione()
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

            esercizioGestione: function () {
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
                if(row.ZcodiStatoni == "00")
                this.getOwnerComponent().getRouter().navTo("iconTabBar", { campo: row.Bukrs, campo1: row.Gjahr, campo2: row.Zamministr, campo3: row.ZchiaveNi, campo4: row.ZidNi, campo5: row.ZRagioCompe })
                if(row.ZcodiStatoni == "01")
                this.getOwnerComponent().getRouter().navTo("inserisciInvioFirma", { campo: row.Bukrs, campo1: row.Gjahr, campo2: row.Zamministr, campo3: row.ZchiaveNi, campo4: row.ZidNi, campo5: row.ZRagioCompe })
                if(row.ZcodiStatoni == "02")
                this.getOwnerComponent().getRouter().navTo("revocaFirma", { campo: row.Bukrs, campo1: row.Gjahr, campo2: row.Zamministr, campo3: row.ZchiaveNi, campo4: row.ZidNi, campo5: row.ZRagioCompe })
                // if(row.ZcodiStatoni == "03")
                // this.getOwnerComponent().getRouter().navTo("passaggioStato", { campo: row.Bukrs, campo1: row.Gjahr, campo2: row.Zamministr, campo3: row.ZchiaveNi, campo4: row.ZidNi, campo5: row.ZRagioCompe })
                if(row.ZcodiStatoni == "03")
                this.getOwnerComponent().getRouter().navTo("richiamaNI", { campo: row.Bukrs, campo1: row.Gjahr, campo2: row.Zamministr, campo3: row.ZchiaveNi, campo4: row.ZidNi, campo5: row.ZRagioCompe })
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

            onSearch: function (oEvent) {
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
                        if (filtro.mProperties.dateValue instanceof Date || !isNaN(filtro.mProperties.dateValue)) {
                            if (i == 5) {
                                if (oEvent.getParameters().selectionSet[5].mProperties.value != '') {
                                    datiNI.push(new Filter({
                                        path: "ZdataCreaz",
                                        operator: FilterOperator.BT,
                                        value1: oEvent.getParameters().selectionSet[5].mProperties.value,
                                        value2: oEvent.getParameters().selectionSet[6].mProperties.value
                                    }));
                                }
                            }
                            if (i == 18) {
                                if (oEvent.getParameters().selectionSet[18].mProperties.value != '') {
                                    datiNI.push(new Filter({
                                        path: "ZdataFirmNi",
                                        operator: FilterOperator.BT,
                                        value1: oEvent.getParameters().selectionSet[18].mProperties.value,
                                        value2: oEvent.getParameters().selectionSet[19].mProperties.value
                                    }));
                                }
                            }
                            if (i == 20) {
                                if (oEvent.getParameters().selectionSet[20].mProperties.value != '') {
                                    datiNI.push(new Filter({
                                        path: "ZdataProtAmm",
                                        operator: FilterOperator.BT,
                                        value1: oEvent.getParameters().selectionSet[20].mProperties.value,
                                        value2: oEvent.getParameters().selectionSet[21].mProperties.value
                                    }));
                                }
                            }
                            if (i == 23) {
                                if (oEvent.getParameters().selectionSet[23].mProperties.value != '') {
                                    datiNI.push(new Filter({
                                        path: "ZdataProtRag",
                                        operator: FilterOperator.BT,
                                        value1: oEvent.getParameters().selectionSet[23].mProperties.value,
                                        value2: oEvent.getParameters().selectionSet[24].mProperties.value
                                    }));
                                }
                            }
                        }
                        else if (oEvent.getParameters().selectionSet[i].mProperties.value != '') {
                            datiNI.push(new Filter({
                                path: path.sorter.sPath,
                                operator: FilterOperator.EQ,
                                value1: filtro.getValue()
                            }));
                            //datiNI.push("?$filter= "+path.sorter.sPath+" eq '" + filtro.getValue() + "'");
                        }
                        else if (i == 6 || i == 19 || i == 21 || i == 24) {
                            continue
                        }
                    }
                }
                //console.log(datiNI)

                var that = this;
                var oMdl = new sap.ui.model.json.JSONModel();
                this.getView().getModel().read("/HeaderNISet", {
                    filters: datiNI,
                    urlParameters: "",
                    success: function (data) {
                        oMdl.setData(data.results);
                        that.getView().getModel("temp").setProperty('/HeaderNISet', data.results)
                    },
                    error: function (error) {
                        //that.getView().getModel("temp").setProperty(sProperty,[]);
                        //that.destroyBusyDialog();
                        var e = error;
                    }
                });



                this.getOwnerComponent().setModel(oMdl, "HeaderNI");
                //sap.ui.getCore().TableModel = oMdlW;
                this.getView().byId("Esporta").setEnabled(true);
                this.getView().byId("DettagliNI").setEnabled(false);
                this.getView().byId("PreimpostazioneNI").setEnabled(true);

                //this.checkItemCB(oEvent)
            },

            navToWizard: function (oEvent) {
                this.getOwnerComponent().getRouter().navTo("wizard");
            },

            onRowSelectionChange: function (oEvent) {
                this.getView().byId("PreimpostazioneNI").setEnabled(false);
                this.getView().byId("DettagliNI").setEnabled(true);
            },
        });
    });