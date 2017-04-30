(function (ng) {
    'use strict';

    ng.getModule('core.component')
        .directive('checkbox', directiveFn);

    /* @ngInject */
    function directiveFn() {

        return {
            restrict: 'E',
            scope: {
                value: '=ngModel',
                label: '@',
                position: '@', //right / left / bottom
                isThreeState: '=?',
                enabled: '=?'
            },
            compile: compileFn,
            templateUrl: 'html/core/component/input/checkbox.html'
        };

        function genId() {
            function s4() {
                return Math.floor((1 + Math.random()) * 0x10000)
                    .toString(16)
                    .substring(1);
            }
            return 'chk' + s4() + s4() + s4();
        }

        function compileFn($element, $attrs){
            if('isThreeState' in $attrs && $attrs.isThreeState === 'true') {
                ng.element($element[0].children[0]).attr('three-state-checkbox', '');
            }
            return linkFn;
        }

        function linkFn($scope, $element, $attrs, $ctrl) {
            $scope.id = genId();
            $scope.enabled = ng.isUndefined($scope.enabled) ? true : $scope.enabled;
        }
    }

})(angular);