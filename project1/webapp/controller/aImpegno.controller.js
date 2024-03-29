sap.ui.define([
    "./BaseController",
    "sap/ui/model/Filter",
    "sap/m/MessageBox",
    "sap/ui/model/FilterOperator",
    "sap/ui/core/routing/History",

],
    function (BaseController, Filter, MessageBox, FilterOperator, History) {
        "use strict";

        return BaseController.extend("project1.controller.aImpegno", {
            onInit() {
                this.getOwnerComponent().getModel("temp");
                this.getRouter().getRoute("aImpegno").attachPatternMatched(this._onObjectMatched, this);
                this.setEsercizio_Amministrazione()
                //this.onCallZdispon()
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
            },

            viewHeader: function (oEvent) {

                var header = this.getView().getModel("temp").getData().HeaderNISet
                var position = this.getView().getModel("temp").getData().PositionNISet
                for (var i = 0; i < header.length; i++) {
                    if (header[i].Bukrs == oEvent.getParameters().arguments.campo &&
                        header[i].Gjahr == oEvent.getParameters().arguments.campo1 &&
                        header[i].Zamministr == oEvent.getParameters().arguments.campo2 &&
                        header[i].ZchiaveNi == oEvent.getParameters().arguments.campo3 &&
                        header[i].ZidNi == oEvent.getParameters().arguments.campo4 &&
                        header[i].ZRagioCompe == oEvent.getParameters().arguments.campo5) {

                        var progressivoNI = header[i].ZchiaveNi
                        this.getView().byId("ProgressivoNI1").setText(progressivoNI)

                        var dataRegistrazione = header[i].ZdataCreaz
                        var dataNuova = new Date(dataRegistrazione),
                            mnth = ("0" + (dataNuova.getMonth() + 1)).slice(-2),
                            day = ("0" + dataNuova.getDate()).slice(-2);
                        var nData = [dataNuova.getFullYear(), mnth, day].join("-");
                        var nDate = nData.split("-").reverse().join(".");
                        this.getView().byId("data1").setText(nDate)

                        var strAmmResp = header[i].Fistl
                        this.getView().byId("SAR1").setText(strAmmResp)

                        var PF = header[i].Fipex
                        this.getView().byId("PF1").setText(PF)

                        var oggSpesa = header[i].ZoggSpesa
                        this.getView().byId("oggSpesaNI1").setText(oggSpesa)

                        var mese = header[i].Zmese
                        switch (mese) {
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
                        this.getView().byId("mese1").setText(nMese)

                        for (var x = 0; x < position.length; x++) {
                            if (position[x].Bukrs == oEvent.getParameters().arguments.campo &&
                                position[x].Gjahr == oEvent.getParameters().arguments.campo1 &&
                                position[x].Zamministr == oEvent.getParameters().arguments.campo2 &&
                                position[x].ZchiaveNi == oEvent.getParameters().arguments.campo3 &&
                                position[x].ZidNi == oEvent.getParameters().arguments.campo4 &&
                                position[x].ZRagioCompe == oEvent.getParameters().arguments.campo5) {

                                var comp = position[x].ZcompRes
                                if (comp == "C") var n_comp = 'Competenza'
                                if (comp == "R") var n_comp = 'Residui'       //Position
                                this.getView().byId("comp1").setText(n_comp)

                            }
                        }

                        var statoNI = header[i].ZcodiStatoni
                        this.getView().byId("statoNI1").setText(statoNI)

                        var importoTot = header[i].ZimpoTotni
                        header[i].ZimpoTotni = importoTot
                        this.getView().byId("importoTot1").setText(importoTot)

                        //var impoTot = this.getView().byId("importoTot1").getText()
                        this.getView().byId("importoAttributo").setText(importoTot)

                    }
                }
            },

            onBackButton: function () {
                this.getView().byId("HeaderNIAssImp").destroyItems()
                window.history.go(-1);
            },

            onForwardButton: function () {
                var array = []
                var url = location.href
                var sUrl = url.split("/aImpegno/")[1]
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
                        var rows = this.getView().byId("HeaderNIAssImp").getSelectedItems()
                        for (var m = 0; m < rows.length; m++) {
                            var campo = rows[m].getBindingContext("HeaderNIAssImp").getObject()
                            array.push(campo)
                        }
                        if (array) {
                            var sommaTotale = 0.00

                            for (var arr = 0; arr < array.length; arr++) {

                                sommaTotale = sommaTotale + parseFloat(array[arr].Attribuito)

                                var numeroIntero = array[arr].Attribuito
                                var numIntTot = ""
                                if (numeroIntero.split(".").length > 1) {
                                    var numeri = numeroIntero.split(".")
                                    for (var n = 0; n < numeri.length; n++) {
                                        numIntTot = numIntTot + numeri[n]
                                        //var numeroFloat = parseFloat(numeroIntero)
                                        if (numIntTot.split(",").length > 1) {
                                            var virgole = numIntTot.split(",")
                                            var numeroInteroSM = virgole[0] + "." + virgole[1]
                                        }
                                    }
                                    var importoPrimaVirgola = numeroIntero.split(".")
                                    var numPunti = ""
                                    var migliaia = importoPrimaVirgola[0].split('').reverse().join('').match(/.{1,3}/g).map(function (x) {
                                        return x.split('').reverse().join('')
                                    }).reverse()

                                    for (var migl = 0; migl < migliaia.length; migl++) {
                                        numPunti = (numPunti + migliaia[migl] + ".")
                                    }
                                    var indice = numPunti.split("").length
                                    var numeroAttribuito = numPunti.substring(0, indice - 1) + "," + importoPrimaVirgola[1]
                                }

                                else {
                                    var importoPrimaVirgola = numeroIntero.split(",")
                                    var numeroAttribuito = importoPrimaVirgola[0] + "." + importoPrimaVirgola[1]

                                }

                                var numeroIntero = rows[arr].mAggregations.cells[3].mProperties.text
                                var numIntTot = ""
                                if (numeroIntero.split(".").length > 1) {
                                    var numeri = numeroIntero.split(".")
                                    for (var n = 0; n < numeri.length; n++) {
                                        numIntTot = numIntTot + numeri[n]
                                        //var numeroFloat = parseFloat(numeroIntero)
                                        if (numIntTot.split(",").length > 1) {
                                            var virgole = numIntTot.split(",")
                                            var numeroInteroSM = virgole[0] + "." + virgole[1]
                                        }
                                    }
                                    var importoPrimaVirgola = numeroIntero.split(".")
                                    var numPunti = ""
                                    var migliaia = importoPrimaVirgola[0].split('').reverse().join('').match(/.{1,3}/g).map(function (x) {
                                        return x.split('').reverse().join('')
                                    }).reverse()

                                    for (var migl = 0; migl < migliaia.length; migl++) {
                                        numPunti = (numPunti + migliaia[migl] + ".")
                                    }
                                    var indice = numPunti.split("").length
                                    var numeroDisp = numPunti.substring(0, indice - 1) + "," + importoPrimaVirgola[1]
                                }

                                else {
                                    var importoPrimaVirgola = numeroIntero.split(",")
                                    var numeroInteroSM = importoPrimaVirgola[0] + "." + importoPrimaVirgola[1]
                                }

                                if (parseFloat(numeroAttribuito) > parseFloat(numeroInteroSM)) {
                                    MessageBox.error("Il valore del campo Importo Attribuito non può essere maggiore al campo Disponibilità Impegno", {
                                        actions: [sap.m.MessageBox.Action.OK],
                                        emphasizedAction: MessageBox.Action.OK,
                                    })
                                    break
                                }

                            }

                            var arrayVirgola = sommaTotale.toString().split(".")
                            // var importoVirgola = arrayVirgola[0]+","+arrayVirgola[1]
                            if(arrayVirgola.length>1){
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
                            sommaTotale = array[0] + "," + valoreTagliato
                        }
                        else{
                            sommaTotale = arrayVirgola+",00"
                        }

                            if (sommaTotale != header[i].ZimpoTotni) {
                                MessageBox.error("La somma dei campi Importo Attribuito deve essere uguale all'Importo Totale della nota", {
                                    actions: [sap.m.MessageBox.Action.OK],
                                    emphasizedAction: MessageBox.Action.OK,
                                })
                            }
                            else {
                                this.getView().getModel("temp").setProperty("/ImpegniSelezionati", array)
                                this.getOwnerComponent().getRouter().navTo("aImpegno2", { campo: header[i].Bukrs, campo1: header[i].Gjahr, campo2: header[i].Zamministr, campo3: header[i].ZchiaveNi, campo4: header[i].ZidNi, campo5: header[i].ZRagioCompe });
                            }
                        }

                    }
                }
            },

            setEsercizio_Amministrazione: function () {
                var url = location.href
                var sUrl = url.split("/aImpegno/")[1]
                var aValori = sUrl.split(",")

                var Bukrs = aValori[0]
                var Gjahr = aValori[1]
                var Zamministr = aValori[2]
                var ZchiaveNi = aValori[3]
                var ZidNi = aValori[4]
                var ZRagioCompe = aValori[5]

                var header = this.getOwnerComponent().getModel("temp").getData().HeaderNISet
                for (var i = 0; i < header.length; i++) {
                    if (header[i].Bukrs == Bukrs &&
                        header[i].Gjahr == Gjahr &&
                        header[i].Zamministr == Zamministr &&
                        header[i].ZchiaveNi == ZchiaveNi &&
                        header[i].ZidNi == ZidNi &&
                        header[i].ZRagioCompe == ZRagioCompe) {
                        this.getView().byId("es_gestione").setValue(header[i].Gjahr)
                        this.getView().byId("inputAmm").setValue(header[i].Zamministr)
                    }
                }
            },

            onSearch: function (oEvent) {
                // this.onCallHeader()
                var header = this.getView().getModel("temp").getData().HeaderNISet
                var url = location.href
                var sUrl = url.split("/aImpegno/")[1]
                var aValori = sUrl.split(",")

                var Bukrs = aValori[0]
                var Gjahr = aValori[1]
                var Zamministr = aValori[2]
                var ZchiaveNi = aValori[3]
                var ZidNi = aValori[4]
                var ZRagioCompe = aValori[5]

                var that = this;
                var filtriAssocia = []
                this.getView().byId("HeaderNIAssImp").setVisible(true);
                for (var i = 0; i < header.length; i++) {
                    if (header[i].Bukrs == Bukrs &&
                        header[i].Gjahr == Gjahr &&
                        header[i].Zamministr == Zamministr &&
                        header[i].ZchiaveNi == ZchiaveNi &&
                        header[i].ZidNi == ZidNi &&
                        header[i].ZRagioCompe == ZRagioCompe) {
                        // var oModel = this.getOwnerComponent().getModel();

                        // var path = oModel.createKey("/ZfmimpegniIpeSet", {
                        //     Gjahr: this.getView().byId("es_gestione").mProperties.value,
                        //     Zcoddecr: this.getView().byId("inputDecreto").mProperties.value,
                        //     Zammin: this.getView().byId("inputAmm").mProperties.value,
                        //     ZCodIpe: this.getView().byId("inputIPE").mProperties.value,
                        //     Zufficioliv1: this.getView().byId("inputaUff").mProperties.value,
                        //     Zufficioliv2: this.getView().byId("inputbUff").mProperties.value,
                        //     ZNumCla: this.getView().byId("inputClaus").mProperties.value
                        // });

                        //FILTRI COMMENTATI IN ATTESA DI VALORI CORRETTI

                        if (this.getView().byId("es_gestione").mProperties.value != "") {
                            filtriAssocia.push(new Filter({
                                path: "Gjahr",
                                operator: FilterOperator.EQ,
                                value1: this.getView().byId("es_gestione").mProperties.value
                            }));
                        }

                        if (this.getView().byId("inputDecreto").mProperties.value != "") {
                            filtriAssocia.push(new Filter({
                                path: "Zcoddecr",
                                operator: FilterOperator.EQ,
                                value1: this.getView().byId("inputDecreto").mProperties.value
                            }));
                        }

                        if (this.getView().byId("inputAmm").mProperties.value != "") {
                            filtriAssocia.push(new Filter({
                                path: "Zammin",
                                operator: FilterOperator.EQ,
                                value1: this.getView().byId("inputAmm").mProperties.value
                            }));
                        }

                        if (this.getView().byId("inputIPE").mProperties.value != "") {
                            filtriAssocia.push(new Filter({
                                path: "ZCodIpe",
                                operator: FilterOperator.EQ,
                                value1: this.getView().byId("inputIPE").mProperties.value
                            }));
                        }

                        if (this.getView().byId("inputaUff").mProperties.value != "") {
                            filtriAssocia.push(new Filter({
                                path: "Zufficioliv1",
                                operator: FilterOperator.EQ,
                                value1: this.getView().byId("inputaUff").mProperties.value
                            }));
                        }

                        if (this.getView().byId("inputbUff").mProperties.value != "") {
                            filtriAssocia.push(new Filter({
                                path: "Zufficioliv2",
                                operator: FilterOperator.EQ,
                                value1: this.getView().byId("inputbUff").mProperties.value
                            }));
                        }

                        if (this.getView().byId("inputClaus").mProperties.value != "") {
                            filtriAssocia.push(new Filter({
                                path: "ZNumCla",
                                operator: FilterOperator.EQ,
                                value1: this.getView().byId("inputClaus").mProperties.value
                            }));
                        }
                        if (header[i].Fipex != "") {
                            filtriAssocia.push(new Filter({
                                path: "Fipex",
                                operator: FilterOperator.EQ,
                                value1: header[i].Fipex
                            }));
                        }
                        if (header[i].Fistl != "") {
                            filtriAssocia.push(new Filter({
                                path: "Fistl",
                                operator: FilterOperator.EQ,
                                value1: header[i].Fistl
                            }));
                        }
                        if (header[i].Bukrs != "") {
                            filtriAssocia.push(new Filter({
                                path: "Bukrs",
                                operator: FilterOperator.EQ,
                                value1: header[i].Bukrs
                            }));
                        }


                        var oMdlAImp = new sap.ui.model.json.JSONModel();
                        this.getOwnerComponent().getModel().read("/ZfmimpegniIpeSet", {
                            filters: filtriAssocia,
                            //filters: [],
                            // urlParameters: "",
                            success: function (data) {
                                oMdlAImp.setData(data.results);
                                that.getView().getModel("temp").setProperty('/ZfmimpegniIpeSet', data.results)
                                var impoTot = that.getView().byId("importoTot1").mProperties.text
                                //var lunghezzaTab = that.getView().getModel("temp").ZfmimpegniIpeSet
                                for (var i = 0; i < data.results.length; i++) {
                                    that.getView().byId("HeaderNIAssImp").getItems()[i].mAggregations.cells[4].setValue("0,00")
                                }
                                that.onCallZdispon(data.results)
                            },
                            error: function (error) {
                                var e = error;
                            }
                        });
                        this.getOwnerComponent().setModel(oMdlAImp, "HeaderNIAssImp");
                        //this.setDisponibilità()
                        //sap.ui.getCore().TableModel = oMdlW;
                    }
                }
            },

            setDisponibilità: function (data) {
                var impegni = this.getView().getModel("temp").getData().ZfmimpegniIpeSet
                for (var po = 0; po < impegni.length; po++) {

                    if (data.Belnr == "0000000" + impegni[po].Belnr && data.Blpos == impegni[po].Blpos) {


                        //var Zdisp = this.getView().getModel("temp").getData().ZdisponSet

                        var importoPrimaVirgola = data.Wtfree.split(".")
                        //var indice = num.split("").length
                        var numPunti = ""
                        var migliaia = importoPrimaVirgola[0].split('').reverse().join('').match(/.{1,3}/g).map(function (x) {
                            return x.split('').reverse().join('')
                        }).reverse()

                        for (var v = 0; v < migliaia.length; v++) {
                            numPunti = (numPunti + migliaia[v] + ".")
                        }

                        var indice = numPunti.split("").length
                        var totale = numPunti.substring(0, indice - 1) + "," + importoPrimaVirgola[1]
                        let array = totale.split(",")
                        let valoreTagliato = array[1].substring(0, 2)
                        var totale = array[0] + "," + valoreTagliato


                        this.getView().byId("HeaderNIAssImp").getItems()[po].mAggregations.cells[3].setText(totale)

                    }
                    else {
                        if (this.getView().byId("HeaderNIAssImp").getItems()[po].mAggregations.cells[3].getText() == "")
                            this.getView().byId("HeaderNIAssImp").getItems()[po].mAggregations.cells[3].setText("0,00")
                    }
                }
            },

            onCalcolaPress: function () {
                //var somma=0.00
                var rows = this.getView().byId("HeaderNIAssImp").getSelectedItems()
                var impoTot = this.getView().byId("importoTot1").mProperties.text
                var numeroIntero = ""

                numeroIntero = impoTot

                var numIntTot = ""
                if (numeroIntero.split(".").length > 1) {
                    var numeri = numeroIntero.split(".")
                    for (var n = 0; n < numeri.length; n++) {
                        numIntTot = numIntTot + numeri[n]
                        //var numeroFloat = parseFloat(numeroIntero)
                        if (numIntTot.split(",").length > 1) {
                            var virgole = numIntTot.split(",")
                            numeroIT = virgole[0] + "." + virgole[1]
                        }
                    }
                    var importoPrimaVirgola = numeroIT.split(".")
                    var numPunti = ""
                    var migliaia = importoPrimaVirgola[0].split('').reverse().join('').match(/.{1,3}/g).map(function (x) {
                        return x.split('').reverse().join('')
                    }).reverse()

                    for (var migl = 0; migl < migliaia.length; migl++) {
                        numPunti = (numPunti + migliaia[migl] + ".")
                    }
                    var indice = numPunti.split("").length
                    var numeroInteroTotale = numPunti.substring(0, indice - 1) + "," + importoPrimaVirgola[1]
                }

                else {
                    var importoPrimaVirgola = numeroIntero.split(",")
                    var numeroIT = importoPrimaVirgola[0] + "." + importoPrimaVirgola[1]
                }

                var deltaImportoTot = parseFloat(numIntTot)
                for (var i = 0; i < rows.length; i++) {
                    if (this.getView().byId("HeaderNIAssImp").getSelectedItems()[i].mAggregations.cells[4].mProperties.value != "") {
                        var Zdisp = this.getView().byId("HeaderNIAssImp").getSelectedItems()[i].mAggregations.cells[3].mProperties.text
                        var numeroInteroDisponibilità = Zdisp
                        var numIntDisp = ""
                        if (numeroInteroDisponibilità.split(".").length > 1) {
                            var numeri = numeroInteroDisponibilità.split(".")
                            for (var n = 0; n < numeri.length; n++) {
                                numIntDisp = numIntDisp + numeri[n]
                                //var numeroFloat = parseFloat(numeroIntero)
                                if (numIntDisp.split(",").length > 1) {
                                    var virgole = numIntDisp.split(",")
                                    numeroInteroDisponibilità = virgole[0] + "." + virgole[1]
                                }
                            }
                            var importoPrimaVirgola = numeroInteroDisponibilità.split(".")
                            var numPunti = ""
                            var migliaia = importoPrimaVirgola[0].split('').reverse().join('').match(/.{1,3}/g).map(function (x) {
                                return x.split('').reverse().join('')
                            }).reverse()

                            for (var migl = 0; migl < migliaia.length; migl++) {
                                numPunti = (numPunti + migliaia[migl] + ".")
                            }
                            var indice = numPunti.split("").length
                            var Zdisp = numPunti.substring(0, indice - 1) + "," + importoPrimaVirgola[1]
                        }

                        if (parseFloat(numeroInteroDisponibilità) <= parseFloat(numeroIT)) {
                            numeroIT = parseFloat(numeroIT) - parseFloat(numeroInteroDisponibilità)
                            this.getView().byId("HeaderNIAssImp").getSelectedItems()[i].mAggregations.cells[4].setValue(Zdisp)
                            continue

                        }

                        else if (parseFloat(numeroInteroDisponibilità) > parseFloat(numeroIT) && parseFloat(numeroIT) > 0 && i != 0) {

                            this.getView().byId("HeaderNIAssImp").getSelectedItems()[i].mAggregations.cells[4].setValue(numeroIT + ",00")
                            numeroIT = parseFloat(numeroIT) - parseFloat(numeroInteroDisponibilità)
                            continue

                        }

                        else if (i == 0) {

                            this.getView().byId("HeaderNIAssImp").getSelectedItems()[i].mAggregations.cells[4].setValue(numeroIntero)
                            numeroIT = parseFloat(numeroIT) - parseFloat(numeroInteroDisponibilità)
                            continue

                        }

                        else {
                            if (parseFloat(numeroIT) < 0) {
                                this.getView().byId("HeaderNIAssImp").getSelectedItems()[i].mAggregations.cells[4].setValue("0,00")
                                continue
                            }
                            var numeroVirgola = arrayVirgola.split(".")
                            var numeroComposto = numeroVirgola[0] + "," + numeroVirgola[1]
                            this.getView().byId("HeaderNIAssImp").getSelectedItems()[i].mAggregations.cells[4].setValue(numeroComposto)
                            numeroIT = parseFloat(numeroIT) - parseFloat(numeroInteroDisponibilità)

                            //var deltaImportoTot = deltaImportoTot - parseFloat(numeroInteroDisponibilità)
                        }
                    }
                }
            },

            onCallZdispon: function (dataResults) {

                const risultati = []
                var that = this
                var filtriDispon = []
                var oModel = this.getOwnerComponent().getModel();

                for (var d = 0; d < dataResults.length; d++) {
                    if (dataResults[d].Belnr != "" && dataResults[d].Blpos != "") {

                        var chiavi = oModel.createKey("/ZdisponSet", {
                            Belnr: dataResults[d].Belnr,
                            Blpos: dataResults[d].Blpos,

                        });

                        //var oMdlDisp = new sap.ui.model.json.JSONModel();
                        this.getOwnerComponent().getModel().read(chiavi, {
                            filters: [],
                            //filters: [],
                            // urlParameters: "",
                            success: function (data) {
                                //risultati.push(data.Wtfree)             
                                //oMdlDisp.setData(risultati);
                                //that.getView().getModel("temp").setProperty('/Zdispon', risultati)
                                that.setDisponibilità(data)
                            },
                            error: function (error) {
                                var e = error;
                            }
                        });
                    }
                }
            },

            // onCallZdispon: function (dataResults) {

            //     const risultati = []
            //     var that = this
            //     var filtriDispon = []

            //     for (var d = 0; d < dataResults.length; d++) {
            //         if (dataResults[d].ZCodIpe != undefined && dataResults[d].ZNumCla != undefined) {

            //             filtriDispon.push(new Filter({
            //                 path: "ZCodIpe",
            //                 operator: FilterOperator.EQ,
            //                 value1: dataResults[d].ZCodIpe
            //             }));
            //             filtriDispon.push(new Filter({
            //                 path: "ZNumCla",
            //                 operator: FilterOperator.EQ,
            //                 value1: dataResults[d].ZNumCla
            //             }));

            //             //var oMdlDisp = new sap.ui.model.json.JSONModel();
            //             this.getOwnerComponent().getModel().read("/ZdisponSet", {
            //                 filters: filtriDispon,
            //                 //filters: [],
            //                 // urlParameters: "",
            //                 success: function (data) {
            //                     risultati.push(data.results[0].Wtfree)
            //                     if (risultati.length == dataResults.length) {
            //                         //oMdlDisp.setData(risultati);
            //                         //that.getView().getModel("temp").setProperty('/ZdisponSet', risultati)
            //                         that.setDisponibilità(risultati)
            //                     }
            //                 },
            //                 error: function (error) {
            //                     var e = error;
            //                 }
            //             });
            //         }
            //     }
            // },


        });
    },
);