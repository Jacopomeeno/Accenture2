sap.ui.define([
    "./BaseController",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    'sap/ui/model/json/JSONModel',
    "sap/m/MessageBox",
    'sap/ui/export/Spreadsheet',
    "sap/ui/core/library",
    "project1/model/DateFormatter"
],

    function (BaseController, Filter, FilterOperator, JSONModel, MessageBox, Spreadsheet, CoreLibrary, DateFormatter) {
        "use strict";
        var EdmType = sap.ui.export.EdmType

        var ValueState = CoreLibrary.ValueState,
            oButton = {
                EditEnable: false,
                AddEnable: false,
                DeleteEnable: false,
                TableVisible: false
            };

        return BaseController.extend("project1.controller.iconTabBar", {
            formatter: DateFormatter,
            onInit() {
                var oProprietà = new JSONModel(),
                    oInitialModelState = Object.assign({}, oButton);
                oProprietà.setData(oInitialModelState);
                this.getView().setModel(oProprietà);
                //this.prePosition()
                this.getOwnerComponent().getModel("temp");
                this.getRouter().getRoute("iconTabBar").attachPatternMatched(this._onObjectMatched, this);

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

            viewHeader: function (oEvent) {
                console.log(this.getView().getModel("temp").getData(
                "/HeaderNISet('"+ oEvent.getParameters().arguments.campo +
                "','"+ oEvent.getParameters().arguments.campo1 +
                "','"+ oEvent.getParameters().arguments.campo2 +
                "','"+ oEvent.getParameters().arguments.campo3 +
                "','"+ oEvent.getParameters().arguments.campo4 +
                "','"+ oEvent.getParameters().arguments.campo5 + "')"))

                var header = this.getView().getModel("temp").getData().HeaderNISet
                for (var i = 0; i < header.length; i++) {
                    if (header[i].Bukrs == oEvent.getParameters().arguments.campo &&
                        header[i].Gjahr == oEvent.getParameters().arguments.campo1 &&
                        header[i].Zamministr == oEvent.getParameters().arguments.campo2 &&
                        header[i].ZchiaveNi == oEvent.getParameters().arguments.campo3 &&
                        header[i].ZidNi == oEvent.getParameters().arguments.campo4 &&
                        header[i].ZRagioCompe == oEvent.getParameters().arguments.campo5) {

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

                        var statoNI = header[i].ZcodiStatoni
                        this.getView().byId("statoNI1").setText(statoNI)

                        var importoTot = header[i].ZimpoTotni
                        this.getView().byId("importoTot1").setText(importoTot)

                    }
                }

            },

            callPositionNI: function (oEvent) {
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
                            urlParameters: {
                                "$expand": ""
                            },
                            success: function (data) {
                                oMdlITB.setData(data.results);
                                that.getView().getModel("temp").setProperty('/PositionNISet', data.results)
                            },
                            error: function (error) {
                                var e = error;
                            }
                        });
                        this.getOwnerComponent().setModel(oMdlITB, "HeaderITB");

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
                this.getView().byId("HeaderITB").destroyItems()
                this.getOwnerComponent().getRouter().navTo("View1");
                this.getView().byId("editImporto").setEnabled(false);
                this.getView().byId("editRow").setEnabled(false);
                this.getView().byId("addRow").setEnabled(false);
                this.getView().byId("deleteRow").setEnabled(false);
                this.getView().byId("pressAssImpegno").setEnabled(true);

            },

            pressAssociaImpegno: function () {
                var url = location.href
                var sUrl = url.split("/iconTabBar/")[1]
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
                        this.getOwnerComponent().getRouter().navTo("aImpegno", { campo: header[i].Bukrs, campo1: header[i].Gjahr, campo2: header[i].Zamministr, campo3: header[i].ZchiaveNi, campo4: header[i].ZidNi, campo5: header[i].ZRagioCompe });
                    }
                }

            },

            onEditImporto: function () {
                var url = location.href
                var sUrl = url.split("/iconTabBar/")[1]
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
                        this.getOwnerComponent().getRouter().navTo("modificaImporto", { campo: header[i].Bukrs, campo1: header[i].Gjahr, campo2: header[i].Zamministr, campo3: header[i].ZchiaveNi, campo4: header[i].ZidNi, campo5: header[i].ZRagioCompe });
                    }
                }
                this.getView().byId("editImporto").setEnabled(false);
                this.getView().byId("editRow").setEnabled(false);
                this.getView().byId("addRow").setEnabled(false);
                this.getView().byId("deleteRow").setEnabled(false);
                this.getView().byId("pressAssImpegno").setEnabled(true);
            },

            onEditRow: function () {
                var url = location.href
                var sUrl = url.split("/iconTabBar/")[1]
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
                        this.getOwnerComponent().getRouter().navTo("modificaDettaglio", { campo: header[i].Bukrs, campo1: header[i].Gjahr, campo2: header[i].Zamministr, campo3: header[i].ZchiaveNi, campo4: header[i].ZidNi, campo5: header[i].ZRagioCompe });
                    }
                }
                this.getView().byId("editImporto").setEnabled(false);
                this.getView().byId("editRow").setEnabled(false);
                this.getView().byId("addRow").setEnabled(false);
                this.getView().byId("deleteRow").setEnabled(false);
                this.getView().byId("pressAssImpegno").setEnabled(true);
            },

            onAddRow: function () {
                var url = location.href
                var sUrl = url.split("/iconTabBar/")[1]
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
                        this.getOwnerComponent().getRouter().navTo("wizardInserisciRiga", { campo: header[i].Bukrs, campo1: header[i].Gjahr, campo2: header[i].Zamministr, campo3: header[i].ZchiaveNi, campo4: header[i].ZidNi, campo5: header[i].ZRagioCompe });
                    }
                }
                
            },

            pressRettificaNI: function () {
                //var oProprietà = this.getView().getModel();
                this.getView().byId("editImporto").setEnabled(true);
                this.getView().byId("editRow").setEnabled(true);
                this.getView().byId("addRow").setEnabled(true);
                this.getView().byId("deleteRow").setEnabled(true);
                this.getView().byId("pressAssImpegno").setEnabled(false);
            },

            onDeleteRow: function (oEvent) {
                var that = this;

                var url = location.href
                var sUrl = url.split("/iconTabBar/")[1]
                var aValori = sUrl.split(",")

                var Bukrs = aValori[0]
                var Gjahr = aValori[1]
                var Zamministr = aValori[2]
                var ZchiaveNi = aValori[3]
                var ZidNi = aValori[4]
                var ZRagioCompe = aValori[5]

                var position = this.getView().getModel("temp").getData().PositionNISet
                //var rows = this.getView().byId("HeaderITB").getSelectedItems()

                for (var i = 0; i < position.length; i++) {
                    if (position[i].Bukrs == Bukrs &&
                        position[i].Gjahr == Gjahr &&
                        position[i].Zamministr == Zamministr &&
                        position[i].ZchiaveNi == ZchiaveNi &&
                        position[i].ZidNi == ZidNi &&
                        position[i].ZRagioCompe == ZRagioCompe) {

                        var indice = i
                            //var ZposNi = rows[x].getBindingContext("HeaderITB").getObject().ZposNi

                            MessageBox.warning("Sei sicuro di voler rettificare la Nota d'Imputazione n° " + position[i].ZchiaveNi + "?", {
                                actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
                                emphasizedAction: MessageBox.Action.YES,
                                onClose: function (oAction) {
                                    if (oAction === sap.m.MessageBox.Action.YES) {

                                        //var oModel = that.getView().getModel("temp");
                                        var oModel = that.getOwnerComponent().getModel();

                                        var path = oModel.createKey("/PositionNISet", {
                                            Bukrs: position[indice].Bukrs,
                                            Gjahr: position[indice].Gjahr,
                                            Zamministr: position[indice].Zamministr,
                                            ZchiaveNi: position[indice].ZchiaveNi,
                                            ZidNi: position[indice].ZidNi,
                                            ZRagioCompe: position[indice].ZRagioCompe,
                                            ZposNi: position[indice].ZposNi,
                                        });

                                        oModel.remove(path, {
                                            // method: "PUT",
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
                }
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

                var header = this.getView().getModel("temp").getData().HeaderNISet
                for (var i = 0; i < header.length; i++) {
                    if (header[i].Bukrs == Bukrs &&
                        header[i].Gjahr == Gjahr &&
                        header[i].Zamministr == Zamministr &&
                        header[i].ZchiaveNi == ZchiaveNi &&
                        header[i].ZidNi == ZidNi &&
                        header[i].ZRagioCompe == ZRagioCompe) {

                        //var statoNI = this.getView().byId("idModificaDettaglio").mBindingInfos.items.binding.oModel.oData[0].ZcodiStatoni
                        MessageBox.warning("Sei sicuro di voler annullare la Nota d'Imputazione n° " + header[i].ZchiaveNi + "?", {
                            actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
                            emphasizedAction: MessageBox.Action.YES,
                            onClose: function (oAction) {
                                if (oAction === sap.m.MessageBox.Action.YES) {
                                    var oModel = that.getView().getModel("temp");

                                    for (var i = 0; i < 1; i++) {
                                        var item = header[i];
                                        var editStato = {
                                            ZcodiStatoni: item.ZcodiStatoni
                                        };

                                        oModel.update("/HeaderNISet('Bukrs='" + item.Bukrs + "',Gjahr='" + item.Gjahr + "',Zamministr='" + item.Zamministr + "',ZchiaveNi='" + item.ZchiaveNi + "',ZidNi='" + item.ZidNi + "',ZRagioCompe='" + item.ZRagioCompe + "'')", editStato, {
                                            // method: "PUT",
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
                            }
                        });
                    }
                }
            }
            // onDeleteRecord: function (oEvent) {
            //      var oSelectedItemPath = oEvent.getSource().getParent().getBindingContextPath();
            //      var oSelectedItem = this.getOwnerComponent().getModel("modelTabGestNI").getObject(oSelectedItemPath);
            //     //console.log(oSelectedItem);
            //     var sKey = oSelectedItem.ID; // campo che identifica il record
            //     var sType = "DELETE";
            //     var sUrl = "/odata/v4/EmployeeService/Request(ID=" + sKey + ")"; //url dell'odata service
            //     var that = this;
            //     var aData = jQuery.ajax({
            //         type: sType,
            //         contentType: "application/json",
            //          url: sUrl,
            //          dataType: "json",
            //          async: false,
            //         success: function (data, textStatus, jqXHR) {
            //             MessageBox.success("Record deleted correctly");
            //             that.getHRdb();
            //         },
            //         error: function (error) {
            //             MessageBox.error("Record NO deleted correctly");
            //             var e = error;
            //         }
            //     });

            // },

        })

    });
