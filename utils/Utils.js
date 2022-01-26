class Utils{

    static formatDate(date){

        let day = date.getDate();
        let month = date.getMonth()+1;
        let year = date.getFullYear();
        let dateFormated = `${day}/${month}/${year}`;

        return dateFormated;
    }
}