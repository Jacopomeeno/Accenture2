sap.ui.define(
    [
        "./BaseController",
        "sap/m/MessageBox",
        "sap/ui/core/routing/History",
        'project1/model/DateFormatter'
    ],
    function (BaseController, MessageBox, History, DateFormatter) {
        "use strict";

        return BaseController.extend("project1.controller.modificaImporto", {
            formatter: DateFormatter,
            onInit() {
                this.onModificaNI()
            },

            onBackButton: function () {
                window.history.go(-1);
            },

            onModificaNI: function () {
                var that = this;
                var oMdlM = new sap.ui.model.json.JSONModel();
                this.getOwnerComponent().getModel().read("/PositionNISet", {
                    filters: [],
                    urlParameters: "",
                    success: function (data) {
                        oMdlM.setData(data.results);
                        that.getView().getModel("temp").setProperty('/PositionNISet', data.results)
                    },
                    error: function (error) {
                        var e = error;
                    }
                });
                this.getOwnerComponent().setModel(oMdlM, "PositionNIMI");
            },

            onUpdateImporto: function () {
                /*update operation*/
                var that = this
                MessageBox.warning("Sei sicuro di voler modificare la NI?", {
                    actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
                    emphasizedAction: MessageBox.Action.YES,
                    onClose: function (oAction) {
                        if (oAction === sap.m.MessageBox.Action.YES) {
                            var oModel = that.getView().getModel();
                            var editImp = {};
                            editImp.importoNI = that.getView().byId("importoNI").getValue();
                            editImp.importoRes = that.getView().byId("importoRes").getValue();

                            oModel.update("/PositionNISet('" + editImp.importoNI + "',)", editImp, {
                                method: "PUT",
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

            // onSaveDati: function () {
            //     //aggiunge dati
            //     var oMdlM = new sap.ui.model.json.JSONModel();
            //     var spesa= this.getView().byId("HeaderNIM")
            //     MessageBox.warning("Sei sicuro di voler modificare la NI?", {
            //         actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
            //         emphasizedAction: MessageBox.Action.YES,
            //         onClose: function (oAction) {
            //             if (oAction === sap.m.MessageBox.Action.YES) {
            //                 //var oggSpesa = this.getView().byId("oggSpesa").getValue()
            //                 var that = this;
            //                 var aData = jQuery.ajax({
            //                     type: "PATCH",
            //                     contentType: "application/json",
            //                     url: "/sap/opu/odata/sap/ZS4_NOTEIMPUTAZIONI_SRV/HeaderNISet",
            //                     dataType: "json",
            //                     async: false,
            //                     body: JSON.stringify({
            //                         ZoggSpesa: oggSpesa
            //                       }),
            //                     success: function (data, textStatus, jqXHR) {
            //                         // resolve(data.value)
            //                         //console.log(data)
            //                         oMdlITB.setData(data.d.results);
            //                         //that.getView().getModel("temp").setProperty('/PositionNISet', data.d.results)
            //                         //console.log(data.d.results)
            //                     },
            //                     error: function (error) {
            //                         var e = error;
            //                     }
            //                 });
            //                 MessageBox.success("Operazione eseguita con successo")
            //             }
            //         }
            //     })
            // },


        });
    }
);