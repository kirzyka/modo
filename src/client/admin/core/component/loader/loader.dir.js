(function (ng) {
    'use strict';

    ng.getModule('core.component')
        .directive('loader', directiveFn);

     /* @ngInject */
    function directiveFn(AppModel) {

        function linkFn($scope) {
            $scope.model = AppModel;
        }

        return {
            restrict: 'E',
            link: linkFn,
            templateUrl: './html/core/component/loader/loader.html'
        }
    }

})(angular);
