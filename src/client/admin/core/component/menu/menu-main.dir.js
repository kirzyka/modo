(function (ng) {
    'use strict';

    ng.getModule('core.component')
        .directive('mainMenu', directiveFn);

    /* @ngInject */
    function directiveFn($rootScope, $log, AppModel, SecurityUtils, MenuCfgService) {
        var log = $log.getInstance('core.component::MainMenu');

        return {
            restrict: 'E',
            templateUrl: 'html/core/component/menu/menu-main.html',
            scope: {},
            controller: controllerFn,
            controllerAs: 'vm',
            link: linkFn
        };

        /* @ngInject */
        function controllerFn($scope, $element, $attrs) {
            var vm = this;

            function init() {
                closeAll();
                vm.mnuItems = MenuCfgService.getMenuItems();
            }

            function  openDataMnu(event, mnuItem) {
                event.stopImmediatePropagation();
                mnuItem.isOpen = true;
            }

            function closeAll() {
                var i;

                for(i = 0; i < vm.mnuItems.length; i++) {
                    vm.mnuItems[i].isOpen = false;
                }
            }

            $rootScope.$on('documentClicked', function (event, target) {
                $scope.$apply(function (){
                    closeAll();
                });
            });

            // Public API
            vm.model = AppModel;
            vm.scope = $scope;
            vm.security = SecurityUtils;
            vm.mnuItems = [];

            vm.init = init;
            vm.openDataMnu = openDataMnu;
        }

        function linkFn($scope, $element, $attrs, $ctrl) {

        }

    }
})(angular);
