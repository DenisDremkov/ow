'use strict';

(() => {
    
    let getLocation = (createMap, error) => {
        navigator.geolocation.getCurrentPosition(
            (position) => { createMap(position) },
            () => {error()}
        )
    }
    
    myAppModule.directive('myGoogleMapDir', ['$window', '$http', '$state', function ($window, $http, $state) {
        return {
            restrict: 'E',
            controller: function ($scope, $element, $attrs) {},  
            link: function (scope, element, attrs) {
                let map; 
                function createMap (opt) {
                    map = new google.maps.Map(element[0], {
                        center: {lat: opt.coords.latitude, lng: opt.coords.longitude},
                        zoom: 16
                    });
                }
                function error() {console.log('error')} 
                
                getLocation(createMap, error)
            },                    
        }
    }]);  
})()
