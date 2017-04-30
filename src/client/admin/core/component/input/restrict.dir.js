(function (ng) {

    ng.getModule('core.component')
        .directive('restrict', directiveFn);

    function directiveFn() {

        return {
            restrict: 'A',
            require: 'ngModel',
            scope: {
                pattern: '=restrict'
            },
            link: linkFn
        };

        function linkFn($scope, $element, $attrs, $ngModelCtrl) {
            var prevValue = null;

            $ngModelCtrl.$parsers.unshift(function (viewValue) {
                if($scope.pattern.test(viewValue)) {
                    // valid
                    prevValue = viewValue;
                    return viewValue;
                } else {
                    // invalid
                    $ngModelCtrl.$setViewValue(prevValue);
                    $ngModelCtrl.$render();
                    return prevValue;
                }
            });

            $ngModelCtrl.$formatters.unshift(function (modelValue) {
                if($scope.pattern.test(modelValue) || !modelValue) {
                    // valid
                    prevValue = modelValue;
                    return modelValue;
                } else {
                    // valid
                    return prevValue;
                }
            });
        }
    }

})(angular);
