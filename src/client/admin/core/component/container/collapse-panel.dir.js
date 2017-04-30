(function (ng) {

    ng.getModule('core.component')
        .directive('cp', directiveFn);

    function directiveFn() {
        var COLLAPSED_STATE = 'cp-collapsed',
            EXPANDED_STATE = 'cp-expanded',
            HAS_ERROR_STATE = 'has-error',
            NO_ERROR_STATE = 'no-error';

        return {
            restrict: 'E',
            transclude: true,
            scope: {
                caption: '@',
                isOpened: '=?',
                errors: '=?',
                buttons: '=?',
                freeze: '=?'
            },
            templateUrl: 'html/core/component/container/collapse-panel.html',
            link: linkFn,
            controller: controllerFn
        };

        function linkFn($scope, $element, $attrs, $ctrl) {
            if(!$attrs.errors) {
                $scope.errors = [];
            }
            $scope.$watch('isOpened', function(newVal, oldVal){
                $scope.updateView();
            }, true);
            $scope.$watch('freeze', function(newVal, oldVal){
                if(newVal === true) {
                    $scope.isOpened = true;
                } else {
                    $scope.updateView();
                }
            }, true);
        }

        /* @ngInject */
        function controllerFn($scope, $http) {

            function onChangeState() {
                $scope.isOpened = !$scope.isOpened;
                $scope.updateView();
            }

            function updateView() {
                if($scope.isOpened) {
                    $scope.panelState = EXPANDED_STATE;
                } else {
                    $scope.panelState = COLLAPSED_STATE;
                }

                if($scope.errors && $scope.errors.length > 0) {
                    $scope.errorState = HAS_ERROR_STATE;
                } else {
                    $scope.errorState = NO_ERROR_STATE;
                }
            }

            function buttonsFilter(item) {
                return item.settings.visible;
            }

            $scope.panelState = COLLAPSED_STATE;
            $scope.errorState = NO_ERROR_STATE;

            $scope.onChangeState = onChangeState;
            $scope.updateView = updateView;
            $scope.buttonsFilter = buttonsFilter;
        }
    }


})(angular );
