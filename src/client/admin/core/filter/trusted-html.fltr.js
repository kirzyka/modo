(function (ng) {
    'use strict';

    ng.getModule('core.filter')
        .filter('trustedHTML', filterFn);

    /* @ngInject */
    function filterFn($sce) {
        return function (src) {
            return $sce.trustAsHtml(src);
        }
    }

})(angular);
