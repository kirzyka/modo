(function (ng) {

    ng.getModule('core.component')
        .directive('textInput', directiveFn);

    function directiveFn() {
        var MAX_LEN = 25;

        return {
            restrict: 'E',
            require: 'ngModel',
            scope: {
                text: '=ngModel',
                maxLen: '=?',
                enabled: '=?',
                pattern: '=?'
            },
            templateUrl: 'html/core/component/input/text-input.html',
            controller: controllerFn,
            controllerAs: 'vm',
            link: linkFn
        };

        /* @ngInject */
        function controllerFn($scope, $element, $attrs) {
            var vm = this;

            function clear() {
                vm.scope.text = '';
            }

            vm.scope = $scope;

            vm.clear = clear;
        }

        function linkFn($scope, $element, $attrs, $ctrl) {
            $scope.maxLen = $scope.maxLen || MAX_LEN;
            $scope.enabled = ng.isUndefined($scope.enabled) ? true : $scope.enabled;

            $scope.defaultPattern = /.*/;
            $scope.pattern = $scope.pattern || $scope.defaultPattern;
            $scope.currentPattern = $scope.pattern;
        }

    }

})(angular);
