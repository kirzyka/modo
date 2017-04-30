(function (ng) {
    'use strict';

    ng.getModule('core.component')
        .directive('numberInput', directiveFn);

    function directiveFn() {

        var DEF_VAL = null,
            MIN_VAL = -1 / 0, // -Infinity
            MAX_VAL = 1 / 0, // +Infinity
            SCALE_DEFAULT = 9,
            PRECISION_DEFAULT = 2;

        return {
            restrict: 'E',
            require: 'ngModel',
            scope: {
                value: '=ngModel',
                defaultVal: '=?',
                minVal: '=?',
                maxVal: '=?',
                maxLen: '=?',
                scale: '=?',
                precision: '=?',
                enabled: '=?'
            },
            templateUrl: 'html/core/component/input/number-input.html',
            controller: controllerFn,
            controllerAs: 'vm',
            link: linkFn
        };

        /* @ngInject */
        function controllerFn($scope, $element, $attrs) {
            var vm = this;

            function clear() {
                vm.scope.value = vm.scope.defaultVal;
            }

            function validateValue() {
                if (isNaN(vm.scope.value) || vm.scope.value === null || vm.scope.value === '') {
                    vm.scope.value = vm.scope.defaultVal;
                }
            }

            function isNumber(value) {
                return !isNaN(value) && value !== null;
            }

            vm.scope = $scope;

            vm.clear = clear;
            vm.validateValue = validateValue;
            vm.isNumber = isNumber;
        }

        function linkFn($scope, $element, $attrs, $ctrl) {
            var oldValue;

            $scope.enabled = ng.isUndefined($scope.enabled) ? true : $scope.enabled;
            $scope.onlyInt = $attrs.hasOwnProperty('int') ? true : false;
            $scope.allowNegative = $attrs.hasOwnProperty('negative') ? true : false;
            $scope.defaultVal = $scope.defaultVal || DEF_VAL;
            $scope.minVal = $scope.minVal || MIN_VAL;
            $scope.maxVal = $scope.maxVal || MAX_VAL;
            $scope.maxLen = $scope.maxLen || (SCALE_DEFAULT + 1 + PRECISION_DEFAULT);
            $scope.scale = $scope.scale || SCALE_DEFAULT;
            $scope.precision = $scope.precision || PRECISION_DEFAULT;

            $scope.$watch('value', function (newVal, oldVal) {
                var pattern;

                if (newVal == undefined || newVal == null) return $scope.value = $scope.defaultVal;
                if (newVal.length > $scope.maxLen || isNaN(newVal) || parseInt(newVal) > $scope.maxVal) return $scope.value = parseInt(oldVal);

                if ($scope.onlyInt) {
                    if ($scope.allowNegative) {
                        pattern = /^\-?\d*$/;
                    } else {
                        pattern = /^\d*$/;
                    }
                } else {
                    if ($scope.allowNegative) {
                        pattern = new RegExp('^\\-?[0-9]{0,' + $scope.scale + '}(\\.[0-9]{0,' + $scope.precision + '})?$');
                    } else {
                        pattern = new RegExp('^[0-9]{0,' + $scope.scale + '}(\\.[0-9]{0,' + $scope.precision + '})?$');
                    }
                }

                if (!pattern.test(newVal)) {
                    $scope.value = parseInt(oldVal);
                } else {
                    $scope.value = parseInt(newVal);
                }
            });
        }
    }

})(angular);