(function (ng) {
    'use strict';

    ng.getModule('core.component')
        .directive('popup', directiveFn);

    /* @ngInject */
    function directiveFn() {

        return {
            restrict: 'E',
            transclude: true,
            scope: {
                isModal: '@?'
            },
            templateUrl: 'html/core/component/popup/popup.html',
            compile: compileFn,
            controller: controllerFn
        };

        function compileFn(element, attrs) {
            if (!attrs.isModal) {
                attrs.isModal = false;
            } else {
                attrs.isModal = attrs.isModal == 'true' ? true : false;
            }
        }

        /* @ngInject */
        function controllerFn($scope, $http) {

        }
    }
})(angular);