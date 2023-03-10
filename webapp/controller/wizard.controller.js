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

                var oPropriet√† = new JSONModel(),
                    oInitialModelState = Object.assign({}, oData);
                oPropriet√†.setData(oInitialModelState);
                this.getView().setModel(oPropriet√†);

                this._iSelectedStepIndex = 0;
                this._wizard = this.byId("CreateProductWizard");
                this._oNavContainer = this.byId("wizardNavContainer");
                this._oWizardContentPage = this.byId("wizardContentPage");

                this.controlPreNI()
                this.controlHeader()
                this.esercizioGestione()
                this.strutturaAmministrativa()
                this.posizioneFinanziaria()
                //this.onSearch()

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

            strutturaAmministrativa: function () {
                var that = this;
                var oMdl = new sap.ui.model.json.JSONModel();
                this.getOwnerComponent().getModel().read("/FistlNiSet", {
                    filters: [],
                    urlParameters: "",
                    success: function (data) {
                        oMdl.setData(data.results);
                        that.getView().getModel("temp").setProperty('/FistlNiSet', data.results)
                    },
                    error: function (error) {
                        //that.getView().getModel("temp").setProperty(sProperty,[]);
                        //that.destroyBusyDialog();
                        var e = error;
                    }
                });
            },

            posizioneFinanziaria: function () {
                var that = this;
                var oMdl = new sap.ui.model.json.JSONModel();
                this.getOwnerComponent().getModel().read("/FipexNiSet", {
                    filters: [],
                    urlParameters: "",
                    success: function (data) {
                        oMdl.setData(data.results);
                        that.getView().getModel("temp").setProperty('/FipexNiSet', data.results)
                    },
                    error: function (error) {
                        //that.getView().getModel("temp").setProperty(sProperty,[]);
                        //that.destroyBusyDialog();
                        var e = error;
                    }
                });
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
                    //var campo = parseFloat(rows[i].getBindingContext("HeaderNIW").getObject().ZimpoTitolo)
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
                    //var campo = parseFloat(rows[i].getBindingContext("HeaderNIW").getObject().ZimpoTitolo)
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
                this.getView().byId("desc_PGWH2").setText("SOMMA DA ACCREDITARE ALLA CONTABILITA' SPECIALE 17")
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
                //     oPropriet√†.setProperty("/HeaderNIWstep3Visible", false);
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
                var oModelP = new sap.ui.model.json.JSONModel("../mockdata/tabRendicontazione.json");
                this.getView().setModel(oModelP, "HeaderNIW");
                // var that = this;
                this.getView().byId("HeaderNIW").setVisible(true);

                // var that = this;
                // var oMdlW = new sap.ui.model.json.JSONModel();
                // this.getOwnerComponent().getModel().read("/PositionNISet", {
                //     success: function (data) {
                //         oMdlW.setData(data.results);
                //         that.getView().getModel("temp").setProperty('/PositionNISet', data.results)
                //     },
                //     error: function (error) {
                //         var e = error;
                //     }
                // });

                // this.getOwnerComponent().setModel(oMdlW, "HeaderNIW");
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

                
                if(N_oggSpesa == ""){
                    MessageBox.error("Oggetto della spesa non inserito!", {
                        actions: [sap.m.MessageBox.Action.OK],
                        emphasizedAction: MessageBox.Action.OK,
                    })
                }
                else{

                var oDataModel = self.getOwnerComponent().getModel();
                //var sommaImporto = 0.00

                var oItems = self.getView().byId("HeaderNIWstep3").getBinding("items").oList;
                var deepEntity = {
                    HeaderNISet: null,
                    PositionNISet: [],
                    Funzionalita: "PREIMPOSTAZIONE"
                }

                for (var i = 0; i < oItems.length; i++) {
                    var item = oItems[i];

                    deepEntity.PositionNISet.push({
                        //Bukrs Passato Da BE
                        Gjahr: N_es_gestione,
                        //Zamministr: item.Zamministr, Passato Da BE
                        //ZidNi: Valore Incrementato da BE
                        //ZRagioCompe: item.ZRagioCompe, Passato Da BE

                        ZposNi: item.ZposNi,
                        ZgjahrEng: N_es_gestione,
                        Ztipo: N_Tipologia,
                        Zsottotipo: N_Sottotipologia,
                        ZcompRes: N_CR,

                        ZimpoTitolo: item.ZimpoTitolo,                 //aggiornare mock
                        Zdescrizione: item.Zdescrizione,                //aggiornare mock 
                        ZcodIsin: item.ZcodIsin,                       //aggiornare mock
                        ZdataPag: new Date(),
                    });
                }

                deepEntity.HeaderNISet = {
                    //Bukrs Passato Da BE
                    Gjahr: N_es_gestione,
                    //Zamministr: item.Zamministr, Passato Da BE
                    //ZidNi: Valore Incrementato da BE
                    //ZRagioCompe: item.ZRagioCompe, Passato Da BE
                    ZcodiStatoni: "00",
                    ZimpoTotni: N_ImportoTot,
                    ZzGjahrEngPos: N_es_gestione,
                    Zmese: N_Mese,
                    ZoggSpesa: N_oggSpesa,
                    Fipex: N_esercizioPF,
                    Fistl: N_strAmmResp,
                    ZdataCreaz: new Date(),
                    //ZutenteCreazione: sap.ushell.Container.getService("UserInfo").getId(),
                    ZdataModiNi: new Date(),
                    //ZutenteModifica: sap.ushell.Container.getService("UserInfo").getId()
                };

                var sommaImporto = 0.00
                for (var x = 0; x < deepEntity.PositionNISet.length; x++) {
                    sommaImporto = sommaImporto + parseFloat(deepEntity.PositionNISet[x].ZimpoTitolo)
                }
                if (parseFloat(deepEntity.HeaderNISet.ZimpoTotni) != sommaImporto) {

                    MessageBox.warning("L‚Äôimporto relativo ai seguenti codici ISIN √® stato coperto parzialmente dalla Nota di Imputazione. Si intende procedere con l‚Äôoperazione?", {
                        actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
                        emphasizedAction: MessageBox.Action.YES,
                        onClose: function (oAction) {
                            if (oAction === sap.m.MessageBox.Action.YES) {

                                MessageBox.warning("Sei sicuro di voler preimpostare la NI?", {
                                    actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
                                    emphasizedAction: MessageBox.Action.YES,
                                    onClose: function (oAction) {
                                        if (oAction === sap.m.MessageBox.Action.YES) {

                                            oDataModel.create("/DeepZNIEntitySet", deepEntity, {
                                                // urlParameters: {
                                                //     'funzionalita': "PREIMPOSTAZIONE"
                                                // },
                                                success: function (result) {
                                                    if (result.Msgty == 'E') {
                                                        console.log(result.Message)
                                                        MessageBox.error("Nota d'imputazione non creata correttamente", {
                                                            actions: [sap.m.MessageBox.Action.OK],
                                                            emphasizedAction: MessageBox.Action.OK,
                                                        })
                                                    }
                                                    if (result.Msgty == 'S') {
                                                        MessageBox.success("Nota d'imputazione creata correttamente", {
                                                            actions: [sap.m.MessageBox.Action.OK],
                                                            emphasizedAction: MessageBox.Action.OK,
                                                            onClose: function (oAction) {
                                                                if (oAction === sap.m.MessageBox.Action.OK) {
                                                                    self.getOwnerComponent().getRouter().navTo("View1");
                                                                    location.reload();
                                                                }
                                                            }
                                                        })
                                                    }
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
                                        }
                                    }
                                })


                            }
                        }
                    })
                }
                else {
                    MessageBox.warning("Sei sicuro di voler preimpostare la NI?", {
                        actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
                        emphasizedAction: MessageBox.Action.YES,
                        onClose: function (oAction) {
                            if (oAction === sap.m.MessageBox.Action.YES) {

                                oDataModel.create("/DeepZNIEntitySet", deepEntity, {
                                    // urlParameters: {
                                    //     "funzionalita": "PREIMPOSTAZIONE"
                                    // },
                                    success: function (result) {
                                        if (result.Msgty == 'E') {
                                            console.log(result.Message)
                                            MessageBox.error("Nota d'imputazione non creata correttamente", {
                                                actions: [sap.m.MessageBox.Action.OK],
                                                emphasizedAction: MessageBox.Action.OK,
                                            })
                                        }
                                        if (result.Msgty == 'S') {
                                            MessageBox.success("Nota d'imputazione creata correttamente", {
                                                actions: [sap.m.MessageBox.Action.OK],
                                                emphasizedAction: MessageBox.Action.OK,
                                                onClose: function (oAction) {
                                                    if (oAction === sap.m.MessageBox.Action.OK) {
                                                        self.getOwnerComponent().getRouter().navTo("View1");
                                                        location.reload();
                                                    }
                                                }
                                            })
                                        }
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
                            
                            }
                        }
                    })
                }
            }
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
                var es_gestione=this.getView().byId("es_gestione").getSelectedKey()
                var mese=this.getView().byId("mese").getSelectedItem()
                if(es_gestione == "" && mese == null){
                    MessageBox.error("Esercizio di Gestione e Mese non inseriti!", {
                        actions: [sap.m.MessageBox.Action.OK],
                        emphasizedAction: MessageBox.Action.OK,
                    })
                }
                else if(es_gestione == ""){
                    MessageBox.error("Esercizio di Gestione non inserito!", {
                        actions: [sap.m.MessageBox.Action.OK],
                        emphasizedAction: MessageBox.Action.OK,
                    })
                }
                else if(mese == null){
                    MessageBox.error("Mese non inserito!", {
                        actions: [sap.m.MessageBox.Action.OK],
                        emphasizedAction: MessageBox.Action.OK,
                    })
                }
                else{
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
            }
            },


            controlPreNI: function () {
                var oPropriet√† = this.getView().getModel();
                switch (this._iSelectedStepIndex) {
                    case 0:
                        oPropriet√†.setProperty("/BackButtonVisible", true);
                        oPropriet√†.setProperty("/NextButtonVisible", true);
                        oPropriet√†.setProperty("/PNIButtonVisible", false);
                        break;
                    case 1:
                        oPropriet√†.setProperty("/BackButtonVisible", true);
                        oPropriet√†.setProperty("/NextButtonVisible", true);
                        oPropriet√†.setProperty("/PNIButtonVisible", false);
                        break;
                    case 2:
                        oPropriet√†.setProperty("/BackButtonVisible", true);
                        oPropriet√†.setProperty("/NextButtonVisible", false);
                        oPropriet√†.setProperty("/PNIButtonVisible", true);
                        break;
                    default: break;
                }
            },

            controlHeader: function () {
                var oPropriet√† = this.getView().getModel();
                switch (this._iSelectedStepIndex) {
                    case 0:
                        oPropriet√†.setProperty("/header1Visible", false);
                        oPropriet√†.setProperty("/header2Visible", false);
                        break;
                    case 1:
                        oPropriet√†.setProperty("/header1Visible", true);
                        oPropriet√†.setProperty("/header2Visible", false);
                        this.viewHeader1()
                        this.filtriStep1()
                        break;
                    case 2:
                        oPropriet√†.setProperty("/header1Visible", false);
                        oPropriet√†.setProperty("/header2Visible", true);
                        this.viewHeader2()
                        this.filtriStep2()
                        this.selectedRow()
                        break;
                    default: break;
                }
            },

          

        });
    });