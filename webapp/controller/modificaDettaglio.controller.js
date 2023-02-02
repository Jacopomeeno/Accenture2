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
               /*update operation*/
               var that = this
               var oggSpesa= this.getView().byId("idModificaDettaglio").mBindingInfos.items.binding.oModel.oData[0].ZoggSpesa
               MessageBox.warning("Sei sicuro di voler modificare la NI?", {
                   actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
                   emphasizedAction: MessageBox.Action.YES,
                   onClose: function (oAction) {
                       if (oAction === sap.m.MessageBox.Action.YES) {
                           var oModel = that.getView().getModel(); 
                           var editSpesa = {
                            ZoggSpesa:oggSpesa
                           };
                           oModel.update("/HeaderNISet('ZoggSpesa='" + editSpesa.ZoggSpesa +"')", editSpesa, {
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
            },


        });
    }
);