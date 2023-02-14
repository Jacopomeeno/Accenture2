sap.ui.define([
    "./BaseController",
    "sap/ui/model/Filter",
    "sap/m/MessageBox",
    'sap/ui/model/json/JSONModel',
    "sap/ui/core/library",
    "project1/model/DateFormatter"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (BaseController, Filter, MessageBox, JSONModel, CoreLibrary, DateFormatter) {
        "use strict";

        var ValueState = CoreLibrary.ValueState,
            oData = {
                BackButtonVisible: true,
                NextButtonVisible: true,
                PNIButtonVisible: false,
                header1Visible: true,
                header2Visible: true,
                // HeaderNIWstep3Visible: true
            };

        return BaseController.extend("project1.controller.wizard", {
            formatter: DateFormatter,
            onInit: async function () {

                var oProprietà = new JSONModel(),
                    oInitialModelState = Object.assign({}, oData);
                oProprietà.setData(oInitialModelState);
                this.getView().setModel(oProprietà);

                this._iSelectedStepIndex = 0;
                this._wizard = this.byId("CreateProductWizard");
                this._oNavContainer = this.byId("wizardNavContainer");
                this._oWizardContentPage = this.byId("wizardContentPage");

                this.controlPreNI()
                this.controlHeader()
                //this.onSearch()

            },

            onCallHeader: function (oEvent) {
                var that = this;
                var oMdl = new sap.ui.model.json.JSONModel();
                this.getOwnerComponent().getModel().read("/HeaderNISet", {
                    filters: [],
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
            },

            viewHeader1: function () {
                var oModelHeader = new sap.ui.model.json.JSONModel();
                var rows = this.getView().byId("HeaderNIW").getSelectedItems()
                //console.log(rows)
                var lunghezza = rows.length
                //var arrayHeader=[]
                var importoTot = 0
                for (var i = 0; i < rows.length; i++) {
                    var campo = parseFloat(rows[i].getBindingContext("HeaderNIW").getObject().ZimpoTitolo)
                    importoTot = importoTot + campo
                }
                //console.log(importoTot)
                var es_gestione = this.getView().byId("es_gestione").getSelectedKey();
                //console.log(es_gestione)
                var Mese = this.getView().byId("mese").getSelectedItem().mProperties.text;
                var competenza = this.getView().byId("competenza").getValue()
                //console.log(Mese)
                this.getView().byId("es_gestioneWH1").setText(es_gestione)
                this.getView().byId("meseWH1").setText(Mese)
                this.getView().byId("n_righeTotWH1").setText(lunghezza + " per un totale di " + importoTot)
                if (competenza == 'C') competenza = 'Competenza'
                if (competenza == 'R') competenza = 'Residui'
                this.getView().byId("compWH1").setText(competenza)


                oModelHeader.setData();
                this.getView().setModel(oModelHeader, "h1");
                //console.log(oModelHeader)
            },

            filtriStep1: function () {
                //console.log(oMdl)

                var that = this;
                var oMdl = new sap.ui.model.json.JSONModel();
                this.getOwnerComponent().getModel().read("/HeaderNISet", {
                    filters: [],
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
            },

            viewHeader2: function () {
                //var oModelHeader = new sap.ui.model.json.JSONModel();
                var rows = this.getView().byId("HeaderNIW").getSelectedItems()
                var lunghezza = rows.length
                //var arrayHeader=[]
                var importoTot = 0
                for (var i = 0; i < rows.length; i++) {
                    var campo = parseFloat(rows[i].getBindingContext("HeaderNIW").getObject().ZimpoTitolo)
                    importoTot = importoTot + campo
                }
                //console.log(importoTot)
                var es_gestione = this.getView().byId("es_gestione").getSelectedKey();
                //console.log(es_gestione)
                var Mese = this.getView().byId("mese").getSelectedItem().mProperties.text;
                var PF = this.getView().byId("input_PF").getValue();
                var Sottotipologia = this.getView().byId("sottotipologia").getSelectedItem().mProperties.text;
                var SAR = this.getView().byId("strAmmResp").getValue()
                var competenza = this.getView().byId("competenza").getValue()

                //console.log(Mese)

                this.getView().byId("es_gestioneWH2").setText(es_gestione)
                this.getView().byId("meseWH2").setText(Mese)
                this.getView().byId("n_righeTotWH2").setText(lunghezza + " per un totale di " + importoTot)
                this.getView().byId("desc_CapWH2").setText("Nota di Imputazione")
                this.getView().byId("pos_FinWH2").setText(PF)
                this.getView().byId("SARWH2").setText(SAR)
                this.getView().byId("desc_PGWH2").setText(Sottotipologia)
                if (competenza == 'C') competenza = 'Competenza'
                if (competenza == 'R') competenza = 'Residui'
                this.getView().byId("compWH2").setText(competenza)





                // oModelHeader.setData();
                // this.getView().setModel(oModelHeader, "h1");
                //console.log(oModelHeader)
            },

            filtriStep2: function () {
                var oModelHeader = new sap.ui.model.json.JSONModel();
                var Mese = this.getView().byId("mese").getSelectedItem().mProperties.text;

                switch (Mese) {
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

                this.getView().byId("oggSpesa").setValue("Pagamenti interessi BTP di " + nMese)

                oModelHeader.setData();
                //console.log(oModelHeader)
            },

            selectedRow: function () {
                var rows = this.getView().byId("HeaderNIW").getSelectedItems()
                // if(rows){
                //     oProprietà.setProperty("/HeaderNIWstep3Visible", false);
                // }
                var array = []
                var oMdlWstep3 = new sap.ui.model.json.JSONModel();
                for (var i = 0; i < rows.length; i++) {
                    var campo = rows[i].getBindingContext("HeaderNIW").getObject()
                    array.push(campo)
                }
                oMdlWstep3.setData(array);
                this.getView().setModel(oMdlWstep3, "HeaderNIWstep3");
                // console.log(oMdlWstep3)
            },

            onSearch: function (oEvent) {
                this.onCallHeader()

                var that = this;
                this.getView().byId("HeaderNIW").setVisible(true);

                var that = this;
                var oMdlW = new sap.ui.model.json.JSONModel();
                this.getOwnerComponent().getModel().read("/PositionNISet", {
                    success: function (data) {
                        oMdlW.setData(data.results);
                        that.getView().getModel("temp").setProperty('/PositionNISet', data.results)
                    },
                    error: function (error) {
                        var e = error;
                    }
                });

                this.getOwnerComponent().setModel(oMdlW, "HeaderNIW");
                //sap.ui.getCore().TableModel = oMdlW;

            },

            onPreimpNI: function (oEvent) {
                var self = this;
                //var rows= this.getView().byId("HeaderNIW").getSelectedItem()

                var N_es_gestione = this.getView().byId("es_gestione").getSelectedKey(); //header
                var N_Mese = this.getView().byId("mese").getSelectedItem().mProperties.text; //header
                var N_Tipologia = this.getView().byId("tipologia").getValue();  //position
                var N_Sottotipologia = this.getView().byId("sottotipologia").getSelectedItem().mProperties.text;  //position
                var N_CR = this.getView().byId("competenza").mProperties.value  //position
                var N_ImportoTot = this.getView().byId("n_righeTotWH2").getText().split(" ")[5];  //header
                var N_oggSpesa = this.getView().byId("oggSpesa").getValue();  //header
                var N_esercizioPF = this.getView().byId("input_PF").getValue();  //header
                var N_strAmmResp = this.getView().byId("strAmmResp").getValue();  //header

                MessageBox.warning("Sei sicuro di voler preimpostare la NI?", {
                    actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
                    emphasizedAction: MessageBox.Action.YES,
                    onClose: function (oAction) {
                        if (oAction === sap.m.MessageBox.Action.YES) {

                            // var newRecordHeader = {
                            //     ZgjahrEng: N_es_gestione,
                            //     Zmese: N_Mese,
                            //     ZimpoTotni: N_ImportoTot,
                            //     ZoggSpesa: N_oggSpesa,
                            //     Fipex: N_esercizioPF,
                            //     Fistl: N_strAmmResp
                            // };

                            // var newRecordPosition = {
                            //     Ztipo: N_Tipologia,
                            //     Zsottotipo: N_Sottotipologia,
                            //     ZcompRes: N_CR
                            // };

                            var oDataModel = self.getOwnerComponent().getModel();

                            var deepEntity = {
                                ZchiaveNi: '12534', //da incrementare / uguale agli altri 2
                                HeaderNISet: null,
                                PositionNISet: []
                            }
                            deepEntity.HeaderNISet = {
                                Bukrs: 'c127',
                                Gjahr: '2023',
                                Zamministr: 'aaa',
                                ZchiaveNi: '12534', //da incrementare / uguale agli altri 2
                                ZidNi: '16',
                                ZRagioCompe: '16',
                                ZcodiStatoni: "00",
                                ZimpoTotni: N_ImportoTot,
                                ZzGjahrEngPos: N_es_gestione,
                                Zmese: N_Mese,
                                ZoggSpesa: N_oggSpesa,
                                Fipex: N_esercizioPF,
                                Fistl: N_strAmmResp
                            };

                            deepEntity.PositionNISet.push({
                                Bukrs: 'c127',
                                Gjahr: '2023',
                                Zamministr: 'aaa',
                                ZchiaveNi: '12534', //da incrementare / uguale agli altri 2
                                ZidNi: '16',
                                ZRagioCompe: '16',
                                ZposNi: '5', //incrementare
                                Ztipo: N_Tipologia,
                                Zsottotipo: N_Sottotipologia,
                                ZcompRes: N_CR
                            });

                            oDataModel.create("/DeepZNIEntitySet", deepEntity, {
                                success: function (result) {
                                    console.log(result.Message)
                                    console.log('success');
                                    MessageBox.success("Nota d'imputazione creata correttamente", {
                                        actions: [sap.m.MessageBox.Action.OK],
                                        emphasizedAction: MessageBox.Action.OK,
                                        onClose: function (oAction) {
                                            if (oAction === sap.m.MessageBox.Action.OK) {
                                                self.getOwnerComponent().getRouter().navTo("View1");
                                            }
                                        }
                                    })

                                },
                                error: function (err) {
                                    console.log(err);
                                    MessageBox.error("Nota d'imputazione non creata correttamente", {
                                        actions: [sap.m.MessageBox.Action.OK],
                                        emphasizedAction: MessageBox.Action.OK,
                                    })
                                },
                                async: true,  // execute async request to not stuck the main thread
                                urlParameters: {}  // send URL parameters if required 
                            });

                            // MessageBox.success("Nota d'imputazione creata correttamente", {
                            //     actions: [sap.m.MessageBox.Action.OK],
                            //     emphasizedAction: MessageBox.Action.OK,
                            //     onClose: function (oAction) {
                            //         if (oAction === sap.m.MessageBox.Action.OK) {
                            //             self.getOwnerComponent().getRouter().navTo("View1");
                            //         }
                            //     }
                            // })
                        }
                    }
                })
            },

            onBackButton: function () {
                this._oWizard = this.byId("CreateProductWizard");
                this._oSelectedStep = this._oWizard.getSteps()[this._iSelectedStepIndex];
                this._iSelectedStepIndex = this._oWizard.getSteps().indexOf(this._oSelectedStep);
                //console.log(this._iSelectedStepIndex)
                if (this._iSelectedStepIndex == 0) {
                    //console.log(this.getOwnerComponent().getRouter().navTo("View1"))
                    this._iSelectedStepIndex = 0
                    window.history.go(-1);
                    this.getView().byId("HeaderNIW").setVisible(false);
                    return;
                }
                var oNextStep = this._oWizard.getSteps()[this._iSelectedStepIndex - 1];
                if (this._oSelectedStep && !this._oSelectedStep.bLast) {
                    this._oWizard.goToStep(oNextStep, true);
                } else {
                    this._oWizard.previousStep();
                }
                this._iSelectedStepIndex--
                this._oSelectedStep = oNextStep;
                this.controlPreNI();
                this.controlHeader()
            },

            onNextButton: function () {
                // this.onSearch()
                // this.onCommunicationPress()
                // var oModelP = new sap.ui.model.json.JSONModel("../mockdata/tabGestNI.json");
                // this.getView().setModel(oModelP, "HeaderNIW");
                this._oWizard = this.byId("CreateProductWizard");
                this._oSelectedStep = this._oWizard.getSteps()[this._iSelectedStepIndex];
                this._iSelectedStepIndex = this._oWizard.getSteps().indexOf(this._oSelectedStep);
                var oNextStep = this._oWizard.getSteps()[this._iSelectedStepIndex + 1];

                if (this._oSelectedStep && !this._oSelectedStep.bLast) {
                    this._oWizard.goToStep(oNextStep, true);
                } else {
                    this._oWizard.nextStep();
                }

                this._iSelectedStepIndex++;
                this._oSelectedStep = oNextStep;

                this.controlPreNI()
                this.controlHeader()

            },


            controlPreNI: function () {
                var oProprietà = this.getView().getModel();
                switch (this._iSelectedStepIndex) {
                    case 0:
                        oProprietà.setProperty("/BackButtonVisible", true);
                        oProprietà.setProperty("/NextButtonVisible", true);
                        oProprietà.setProperty("/PNIButtonVisible", false);
                        break;
                    case 1:
                        oProprietà.setProperty("/BackButtonVisible", true);
                        oProprietà.setProperty("/NextButtonVisible", true);
                        oProprietà.setProperty("/PNIButtonVisible", false);
                        break;
                    case 2:
                        oProprietà.setProperty("/BackButtonVisible", true);
                        oProprietà.setProperty("/NextButtonVisible", false);
                        oProprietà.setProperty("/PNIButtonVisible", true);
                        break;
                    default: break;
                }
            },

            controlHeader: function () {
                var oProprietà = this.getView().getModel();
                switch (this._iSelectedStepIndex) {
                    case 0:
                        oProprietà.setProperty("/header1Visible", false);
                        oProprietà.setProperty("/header2Visible", false);
                        break;
                    case 1:
                        oProprietà.setProperty("/header1Visible", true);
                        oProprietà.setProperty("/header2Visible", false);
                        this.viewHeader1()
                        this.filtriStep1()
                        break;
                    case 2:
                        oProprietà.setProperty("/header1Visible", false);
                        oProprietà.setProperty("/header2Visible", true);
                        this.viewHeader2()
                        this.filtriStep2()
                        this.selectedRow()
                        break;
                    default: break;
                }
            },
        });
    });