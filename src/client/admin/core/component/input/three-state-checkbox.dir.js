(function (ng) {
    'use strict';

    ng.getModule('core.component')
        .directive('threeStateCheckbox', directiveFn);

    function directiveFn() {

        return {
            restrict: 'A',
            require: '?ngModel',
            link: linkFn
        };

        function linkFn($scope, $element, $attrs, $ctrl) {
            var truthy = true,
                falsy = false,
                nully = null;

            function render() {
                var d = $ctrl.$viewValue;
                $element.data('checked', d);
                switch(d){
                    case truthy:
                        $element.prop('indeterminate', false);
                        $element.prop('checked', true);
                        $element.removeClass('indeterminate');
                        break;
                    case falsy:
                        $element.prop('indeterminate', false);
                        $element.prop('checked', false);
                        $element.removeClass('indeterminate');
                        break;
                    default:
                        $element.prop('indeterminate', true);
                        $element.addClass('indeterminate');
                }
            }

            function onClick() {
                var value;
                switch($element.data('checked')){
                    case falsy:
                        value = truthy;
                        break;
                    /*case truthy:
                        value = nully;
                        break;*/
                    default:
                        value = falsy;
                }
                $ctrl.$setViewValue(value);
                $scope.$apply($ctrl.$render);
            }


            $ctrl.$formatters = [];
            $ctrl.$parsers = [];
            $ctrl.$render = render;
            $element.bind('click', onClick);
        }
    }

})(angular);