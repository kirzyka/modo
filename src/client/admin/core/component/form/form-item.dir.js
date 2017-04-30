(function (ng) {
    'use strict';

    function directiveFn() {
        var DEFAULT_LABEL_WIDTH = 170;

        ng.getModule('core.component')
            .directive('formItem', directiveFn);

        return {
            restrict: 'E',
            transclude: true,
            scope: {
                label: '@',
                labelWidth: '=?'
            },
            templateUrl: 'html/core/component/form/form-item.html',
            link: linkFn
        };

        function linkFn($scope, $element, $attrs, $ctrl) {
            if (!$scope.labelWidth) {
                $scope.labelWidth = DEFAULT_LABEL_WIDTH;
            }
            $scope.labelStyle = {width: $scope.labelWidth + 'px'};
        }
    }

})(angular);