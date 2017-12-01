'use strict';

angular.module('angularAddToHomeScreen')
    .directive('ngAddToHomeScreen', ['$homeScreenDetector', '$cookies','aathsLocales', function($homeScreenDetector, $cookies, aathsLocales){
        var hydrateInstructions = function (hsdInstance) {
            //tipo di dispositivo
            var device = hsdInstance.device() || 'dispositivo';
            var instructions;
            var icon = 'iOS8';
            
            //se è su iOS
            if(hsdInstance.isiOS()) {
                instructions = aathsLocales.iOS;

                //scelgo l'iconda da visualizzare
                if (hsdInstance.isOldiOS()) {
                    icon = 'iOS6';
                }
            }
            
            //se è su Android
            if(hsdInstance.Android()) {
                icon = 'android';
                instructions = aathsLocales.Android;
            }
            
            //formatto il messaggio con le informazioni del dispositivo
            instructions = instructions
                .replace('%icon', function () {
                    return '<span class="aaths-' + icon + '-icon"></span>';
                })
                .replace('%device', device);
            
            return '<div class="aaths-instructions">' + instructions + '</div>';
        };

        // Runs during compile
        return {
            // name: '',
            // priority: 1,
            // terminal: true,
            scope: {
                closeCallback: '=closeCallback'
            }, 
            // {} = isolate, true = child, false/undefined = no change
            // controller: function($scope, $element, $attrs, $transclude) {},
            // require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
            // restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
            template: '<a class="aaths-close" ng-click="aathsClose()">{{ closeText }}</a><div ng-transclude></div>',
            // templateUrl: '',
            // replace: true,
            transclude: true,
            // compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
            link: function($scope, iElm) {
                $scope.aathsClose = function () {
                    iElm.remove();
                    if(angular.isFunction($scope.closeCallback)) {
                        $scope.closeCallback();
                    }
                    var expireDate = new Date();
                    expireDate.setDate(expireDate.getDate() + 7);
                    $cookies.put('a2HSCookie', 'true', {'expires': expireDate});
                };
                var hsd = new $homeScreenDetector();
                $scope.closeText = '×';
                //controllo i cookies
                if($cookies.get('a2HSCookie') === undefined) {
                    //controllo che il dispositivo sia iOS o Android
                    if(hsd.isBrowserOK()) {
                        iElm
                            .addClass('aaths-container')
                            .append(hydrateInstructions(hsd));
                    }
                    else {
                        iElm.remove();
                    }
                }
            }
        };
    }]);


