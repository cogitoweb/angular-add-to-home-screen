/**
* angularAddToHomescreen Module
*
* Description
*/
angular.module('angularAddToHomeScreen', [])
    .constant('aathsLocales', {
        'iOS': 'Installa la web app nel tuo %device: cliccando %icon e poi <strong>Aggiungi all\'Home Screen</strong>.',
        'Android': 'Installa la web app nel tuo %device: cliccando %icon, <strong>Pagina</strong> e poi <strong>Aggiungi all\'Home Screen</strong>.'
    });

'use strict';

angular.module('angularAddToHomeScreen')
    .directive('ngAddToHomeScreen', ['$homeScreenDetector', 'aathsLocales', function($homeScreenDetector, aathsLocales){
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
                };
                var hsd = new $homeScreenDetector();
                console.log(hsd);
                $scope.closeText = '×';
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
        };
    }]);



'use strict';

/**
 *
 */
angular.module('angularAddToHomeScreen')
    .factory('$homeScreenDetector', [function(){

        var parser = new UAParser();

        function getMajorVersion (version) {
            return (typeof(version) === 'undefined') ? undefined : version.split('.')[0];
        }

        var Detector = function(options) {
            angular.extend(this, options);
            if(angular.isDefined(this.customUA)) {
                parser.setUA(this.customUA);
            }
            this.result = parser.getResult();
        };

        Detector.prototype.safari = function () {
            return this.result.browser.name === 'Mobile Safari';
        };

        Detector.prototype.firefox = function () {
            return this.result.browser.name === 'Firefox';
        };

        Detector.prototype.Android = function () {
            return this.result.os.name === 'Android';
        };

        Detector.prototype.isiOS = function () {
            return this.isOldiOS() || this.isNewiOS();
        };

        Detector.prototype.isNewiOS = function () {
            return this.result.os.name === 'iOS' && parseInt(getMajorVersion(this.result.os.version)) > 6;
        };

        Detector.prototype.isOldiOS = function () {
            return this.result.os.name === 'iOS' && parseInt(getMajorVersion(this.result.os.version)) <= 6;
        };

        Detector.prototype.isBrowserOK = function () {
            return ((this.isiOS() && this.safari()) || (this.Android() && this.firefox())) && !this.fullscreen();
        };

        Detector.prototype.device = function () {
            return this.result.device.model;
        };

        Detector.prototype.fullscreen = function () {
            return (("standalone" in window.navigator) && window.navigator.standalone) ? true : false;
        };

        return Detector;

    }]);


