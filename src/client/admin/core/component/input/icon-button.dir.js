(function (ng) {
    'use strict';

    ng.getModule('core.component')
        .directive('iconButton', directiveFn);

    /* @ngInject */
    function directiveFn($rootScope, $timeout) {

        return {
            restrict: 'E',
            transclude: true,
            scope: {
                src: '@',
                label: '@',
                position: '@', //right / left / bottom
                enabled: '=?',
                action: '&?'
            },
            link: linkFn,
            templateUrl: 'html/core/component/input/icon-button.html'
        };

        function linkFn($scope, $element, $attrs, $ctrl) {
            var destroyDocumentClickListener;

            $scope.enabled = ng.isDefined($scope.enabled) ? $scope.enabled : true;

            function onDocumentClick(event, target) {
                if (!$scope.actionClicked) {
                    $scope.$apply(function () {
                        close();
                    });
                }
                $scope.actionClicked = false;
            }

            function onAction() {
                if($scope.enabled) {
                    $scope.clicked = true;
                    $timeout(function () {
                        $scope.clicked = false;
                    }, 650);
                }
                $scope.actionClicked = true;

                if(!$scope.enabled) { return }

                if ($scope.action !== undefined) {
                    $scope.action();
                } else {
                    if(!$scope.listVisible) {
                        // Open
                        $scope.listVisible = true;
                        destroyDocumentClickListener = $rootScope.$on("documentClicked", onDocumentClick);
                    } else {
                        close();
                    }
                }
            }

            function close() {
                $scope.listVisible = false;
                destroyDocumentClickListener();
            }

            $scope.listVisible = false;
            $scope.clicked = false;

            $scope.onAction = onAction;
            $scope.close = close;
        }
    }

})(angular);