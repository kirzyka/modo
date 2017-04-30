(function (ng) {
    'use strict';

    ng.getModule('core.component')
        .directive('appHeader', directiveFn);

    /* @ngInject */
    function directiveFn($location, AppModel) {


        /* @ngInject */
        function controllerFn($scope, $element, $attrs) {
            var vm = this;

            function exit() {
                vm.model.globals.user = null;
                $location.path('/');
            }

            vm.model = AppModel;

            vm.exit = exit;
        }

        function linkFn($scope, $element, $attrs, $ctrl) {

        }

        return {
            restrict: 'E',
            templateUrl: 'html/core/component/app-header/app-header.html',
            controller: controllerFn,
            controllerAs: 'vm',
            link: linkFn
        };
    }

})(angular);
