(function (ng) {
    'use strict';

    ng.getModule('core.component')
        .directive('panel', directiveFn);

    function directiveFn() {

        return {
            restrict: 'E',
            transclude: true,
            scope: {
                caption: '@'
            },
            templateUrl: 'html/core/component/container/panel.html'
        }
    }

})(angular);
