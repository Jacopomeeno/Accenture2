sap.ui.define([], function () {
    return {

        convert: function(str) {
            var date = new Date(str),
              mnth = ("0" + (date.getMonth() + 1)).slice(-2),
              day = ("0" + date.getDate()).slice(-2);
             var nData= [date.getFullYear(), mnth, day].join("-");
             var nDate = nData.split("-").reverse().join(".");
             return nDate
          },
          
          


        formatDate: function (sDate) {
            //sDate = sDate.split('.').join('/');
            if (sDate && sDate !== undefined && sDate !== null && sDate !== '') {
                var date = new Date(parseInt(sDate.substr(6))).toISOString().slice(0, 10);
                var nDate = date.split("-").reverse().join(".");

                // var date = sDate.getDate().toString().padStart(2,'0') + "/" + (sDate.getMonth() + 1).toString().padStart(2,'0') + "/" + sDate.getFullYear()  
                return nDate;
            }
            return '';
        },
        formatDateTwoParams: function (sDate, sHour) {
            //sDate = sDate.split('.').join('/');
            if (sDate && sDate !== undefined && sDate !== null && sDate !== '') {
                var date =
                    sDate.getDate().toString().padStart(2, '0') + "/" +
                    (sDate.getMonth() + 1).toString().padStart(2, '0') + "/" +
                    sDate.getFullYear()
                return date + "\n" + sHour;
            }
        },
        getMonthName: function (monthNumber) {
            const date = new Date();
            date.setMonth(monthNumber - 1);
            var mese= date.toLocaleString('it-IT', { month: 'long' });
            const meseG = mese.charAt(0).toUpperCase() + mese.slice(1);
            return meseG
        }
    }
})