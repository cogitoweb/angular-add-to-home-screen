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
            return  ((("standalone" in window.navigator) && window.navigator.standalone) || (screen.height-document.documentElement.clientHeight<40)) ? true : false;
        };

        return Detector;

    }]);


