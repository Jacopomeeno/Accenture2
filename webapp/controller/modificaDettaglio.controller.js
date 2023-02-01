sap.ui.define(
    [
        "./BaseController",
        "sap/m/MessageBox",
        "sap/ui/core/routing/History",
        'project1/model/DateFormatter'
    ],
    function (BaseController, MessageBox, History, DateFormatter) {
        "use strict";

        return BaseController.extend("project1.controller.modificaDettaglio", {
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
                this.getOwnerComponent().getModel().read("/HeaderNISet", {
                    filters: [],
                    urlParameters: "",
                    success: function (data) {
                        oMdlM.setData(data.results);
                        that.getView().getModel("temp").setProperty('/HeaderNISet', data.results)
                    },
                    error: function (error) {
                        var e = error;
                    }
                });
                this.getOwnerComponent().setModel(oMdlM, "HeaderNIM");
            },

            onSaveDati: function () {
                //aggiunge dati
                var oMdlM = new sap.ui.model.json.JSONModel();
                var spesa= this.getView().byId("HeaderNIM")
                MessageBox.warning("Sei sicuro di voler modificare la NI?", {
                    actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
                    emphasizedAction: MessageBox.Action.YES,
                    onClose: function (oAction) {
                        if (oAction === sap.m.MessageBox.Action.YES) {
                            //var oggSpesa = this.getView().byId("oggSpesa").getValue()
                            var that = this;
                            var aData = jQuery.ajax({
                                type: "PATCH",
                                contentType: "application/json",
                                url: "/sap/opu/odata/sap/ZS4_NOTEIMPUTAZIONI_SRV/HeaderNISet",
                                dataType: "json",
                                async: false,
                                body: JSON.stringify({
                                    ZoggSpesa: oggSpesa
                                  }),
                                success: function (data, textStatus, jqXHR) {
                                    // resolve(data.value)
                                    //console.log(data)
                                    oMdlITB.setData(data.d.results);
                                    //that.getView().getModel("temp").setProperty('/PositionNISet', data.d.results)
                                    //console.log(data.d.results)
                                },
                                error: function (error) {
                                    var e = error;
                                }
                            });
                            MessageBox.success("Operazione eseguita con successo")
                        }
                    }
                })
            },


        });
    }
);