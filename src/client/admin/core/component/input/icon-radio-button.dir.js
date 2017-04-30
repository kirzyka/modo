(function (ng) {
    'use strict';

    ng.getModule('core.component')
        .directive('iconRadioButton', directiveFn);

    function directiveFn() {

        return {
            restrict: 'E',
            scope: {
                name: '@',
                src: '@',
                label: '@',
                model: '=',
                value: '='
            },
            link: linkFn,
            templateUrl: 'html/core/component/input/icon-radio-button.html'
        };

        function linkFn($scope, $element, $attrs, $ctrl) {
            function onClick() {
                $scope.model = $scope.value;
            }

            $scope.onClick = onClick;
        }
    }

})(angular);