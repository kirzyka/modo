(function (ng) {
    'use strict';

    ng.getModule('core.component')
        .directive('fileUpload', directiveFn);

    /* @ngInject */
    function directiveFn($parse, $log) {

        return {
            restrict: 'A',
            scope: {
                fileSelect: "=fileSelect"
            },
            link: linkFn
        };

        function linkFn($scope, $element, $attrs) {

            $element.bind('change', function(){
                $scope.fileSelect($element[0].files[0]);
            });
        }
    }

})(angular);
