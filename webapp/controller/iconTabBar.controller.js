sap.ui.define([
    "./BaseController",
    'sap/ui/model/json/JSONModel',
    'sap/ui/export/Spreadsheet',
    "sap/ui/core/library",
    "project1/model/DateFormatter"
],

    function (BaseController, JSONModel, Spreadsheet, CoreLibrary, DateFormatter) {
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
                this.callPositionNI()
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
                this.viewHeader()
            },

            viewHeader: function () {
                this.getView().getModel().getProperty("/HeaderNISet('S001','2022','020','2022-020.08401378.0000000002','0000000002','0840')")

                // var numeroNI = modelH.oData.selectedRow[0].mProperties.text
                // //var dataReg = modelH.oData.selectedRow[1].mProperties.text
                // var SAR = modelH.oData.selectedRow[1].mProperties.text
                // var PF = modelH.oData.selectedRow[2].mProperties.text
                // var oggSpesa = modelH.oData.selectedRow[3].mProperties.text
                // var mese = modelH.oData.selectedRow[4].mProperties.text
                // var statoNI = modelH.oData.selectedRow[5].mProperties.text
                // var impTotNI = modelH.oData.selectedRow[6].mProperties.text

                // this.getView().byId("numNI1").setText(numeroNI)
                // //this.getView().byId("dataReg1").setText(dataReg)
                // this.getView().byId("SARWH2").setText(SAR)
                // this.getView().byId("pos_FinWH2").setText(PF)
                // this.getView().byId("oggSpesa1").setText(oggSpesa)
                // this.getView().byId("mese1").setText(mese)
                // this.getView().byId("statoNI1").setText(statoNI)
                // this.getView().byId("importoTot1").setText(impTotNI)
                //console.log(modelH)
            },

            callPositionNI: function () {
                var that = this;
                var oMdlITB = new sap.ui.model.json.JSONModel();
                this.getOwnerComponent().getModel().read("/PositionNISet", {
                    filters: [],
                    urlParameters: "",
                    success: function (data) {
                        oMdlITB.setData(data.results);
                        that.getView().getModel("temp").setProperty('/PositionNISet', data.results)
                    },
                    error: function (error) {
                        var e = error;
                    }
                });
                this.getOwnerComponent().setModel(oMdlITB, "HeaderITB");
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
                this.getOwnerComponent().getRouter().navTo("View1");
                this.getView().byId("editImporto").setEnabled(false);
                this.getView().byId("editRow").setEnabled(false);
                this.getView().byId("addRow").setEnabled(false);
                this.getView().byId("deleteRow").setEnabled(false);
                this.getView().byId("pressAssImpegno").setEnabled(true);

            },

            pressAssociaImpegno: function () {
                this.getOwnerComponent().getRouter().navTo("aImpegno");
            },

            onEditImporto: function () {
                this.getOwnerComponent().getRouter().navTo("modificaImporto");
                this.getView().byId("editImporto").setEnabled(false);
                this.getView().byId("editRow").setEnabled(false);
                this.getView().byId("addRow").setEnabled(false);
                this.getView().byId("deleteRow").setEnabled(false);
                this.getView().byId("pressAssImpegno").setEnabled(true);
            },

            onEditRow: function () {
                this.getOwnerComponent().getRouter().navTo("modificaDettaglio");
                this.getView().byId("editImporto").setEnabled(false);
                this.getView().byId("editRow").setEnabled(false);
                this.getView().byId("addRow").setEnabled(false);
                this.getView().byId("deleteRow").setEnabled(false);
                this.getView().byId("pressAssImpegno").setEnabled(true);
            },

            onAddRow: function () {
                this.getOwnerComponent().getRouter().navTo("wizard");
            },

            pressRettificaNI: function () {
                //var oProprietà = this.getView().getModel();
                this.getView().byId("editImporto").setEnabled(true);
                this.getView().byId("editRow").setEnabled(true);
                this.getView().byId("addRow").setEnabled(true);
                this.getView().byId("deleteRow").setEnabled(true);
                this.getView().byId("pressAssImpegno").setEnabled(false);
            },

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


        });
    }
);
