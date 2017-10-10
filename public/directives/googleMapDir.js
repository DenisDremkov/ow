'use strict';

(() => {
    
    // let getLocation = (showMap, error) => {
    //     navigator.geolocation.getCurrentPosition(
    //         (position) => { showMap(position) },
    //         () => {error()}
    //     )
    // }
    
    myAppModule.directive('myGoogleMapDir', ['$window', '$http', '$state', function ($window, $http, $state) {
        return {
            restrict: 'E',
            controller: function ($scope, $element, $attrs) {},  
            link: function (scope, element, attrs) {
                // function showMap (opt) {
                //     console.log(opt)
                    let map = new google.maps.Map(element[0], {
                        center: {lat: -34.397, lng: 150.644},
                        zoom: 8
                    });
                // }
                // function error() {console.log('error')} 
                // getLocation(showMap, error)
            },                    
        }
    }]);  
})()
