// Initialize Firebase

function getLocation(){

    var options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
    };
    function error(err) {
        toastr.options.timeOut = 5000;
        toastr.error('ERROR(' + err.code + '): ' + err.message);
    };

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(success, error, options);

    } else {
        toastr.options.timeOut = 5000;
        toastr.error("Geolocation is not supported by this browser.");
    }


    function success(pos) {
        var crd = pos.coords;
        /*
         console.log('Your current position is:');
         console.log('Latitude : ' + crd.latitude);
         console.log('Longitude: ' + crd.longitude);
         console.log('More or less ' + crd.accuracy + ' meters.');
         */
        App._location.setLocation(crd);
        return crd;
    };


}

/* DATASETS */
//DATA: Bibliotheek
function getBookLocations(){
    this.API_URL_PREFIX = 'https://datatank.stad.gent/4/';
    this.API_URL_SUFFIX = 'cultuursportvrijetijd/bibliotheek.geojson?callback=json_callback';
    // The results within the JSON-object
    this.results;
    var that = this;
    var API_URL = this.API_URL_PREFIX + this.API_URL_SUFFIX;
    //console.log(API_URL);
    Utils.getJSONByPromise(API_URL).then(
        function(data) {
            that.results = data.coordinates;
            //console.log('Weather be like',that.results);
            //console.log('RESULTS', that.results);
            App._locations.book = that.results;
            return that.results;
        },
        function(error) {
            console.log(error);
        }
    );
}

//DATA: Park
function getParks(){
    this.API_URL_PREFIX = '/assets/files/';
    this.API_URL_SUFFIX = 'parken.json?callback=json_callback';
    // The results within the JSON-object
    this.results;
    var that = this;
    var API_URL = this.API_URL_PREFIX + this.API_URL_SUFFIX;
    //console.log(API_URL);
    Utils.getJSONByPromise(API_URL).then(
        function(data) {
            console.log(data);
            that.results = data.features;
            for (var i = 0; i < that.results.length; i++) {

                if(that.results[i].geometry.type == "Point"){
                    that.results[i] = that.results[i].geometry.coordinates;
                }else if(that.results[i].geometry.type == "Polygon") {
                    that.results[i] = that.results[i].geometry.coordinates[0][0];
                }
            }


            App._locations.parken = that.results;
            return that.results;
        },
        function(error) {
            console.log(error);
        }
    );
}