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
                this.getOwnerComponent().getModel("temp");
                //this.prePosition()
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
                var sUrl = url.split("/iconTabBar/")[1]
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

                            }
                        }

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
                this.getView().byId("editImporto").setEnabled(false);
                this.getView().byId("editRow").setEnabled(false);
                this.getView().byId("addRow").setEnabled(false);
                this.getView().byId("deleteRow").setEnabled(false);
                this.getView().byId("pressAssImpegno").setEnabled(true);
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
                //var position = this.getView().getModel("temp").getData().PositionNISet
                var selectedPosition = this.getView().byId("HeaderITB").getSelectedItems()

                var deepEntity = {
                    Funzionalita: "RETTIFICANIPREIMPOSTATA",
                    PositionNISet: []
                }

                for (var i = 0; i < selectedPosition.length; i++) {

                    var item = selectedPosition[i].getBindingContext("HeaderITB").getObject();
                    //var indice = i
                    var oModel = that.getOwnerComponent().getModel();

                    deepEntity.Bukrs = item.Bukrs,
                        deepEntity.Gjahr = item.Gjahr,
                        deepEntity.Zamministr = item.Zamministr,
                        deepEntity.ZchiaveNi = item.ZchiaveNi,
                        deepEntity.ZidNi = item.ZidNi,
                        deepEntity.ZRagioCompe = item.ZRagioCompe,
                        deepEntity.Operation = "D",

                        deepEntity.PositionNISet.push({
                            ZposNi: item.ZposNi,
                            Bukrs: item.Bukrs,
                            Gjahr: item.Gjahr,
                            Zamministr: item.Zamministr,
                            ZchiaveNi: item.ZchiaveNi,
                            ZidNi: item.ZidNi,
                            ZRagioCompe: item.ZRagioCompe,
                        })
                }
                MessageBox.warning("Sei sicuro di voler rettificare la Nota d'Imputazione n° " + item.ZchiaveNi + "?", {
                    title:"Elimina Riga",
                    actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
                    emphasizedAction: MessageBox.Action.YES,
                    onClose: function (oAction) {
                        if (oAction === sap.m.MessageBox.Action.YES) {

                            oModel.create("/DeepPositionNISet", deepEntity, {
                                // method: "PUT",
                                success: function (data) {
                                    //console.log("success");
                                    MessageBox.success("Operazione eseguita con successo", {
                                        title:"Esito Operazione",
                                        actions: [sap.m.MessageBox.Action.OK],
                                        emphasizedAction: MessageBox.Action.OK,
                                        onClose: function (oAction) {
                                            if (oAction === sap.m.MessageBox.Action.OK) {
                                                that.getOwnerComponent().getRouter().navTo("View1")
                                                location.reload();
                                            }
                                        }
                                    })

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
                        }

                    }
                });
            },
            //deepHeaderNISet
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
                            title:"Annullamento NI",
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
                                            ZchiaveNi : ZchiaveNi,
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
                                                MessageBox.success("Operazione eseguita con successo", {
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
