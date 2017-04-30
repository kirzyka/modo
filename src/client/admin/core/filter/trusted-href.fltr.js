(function (ng) {
    'use strict';

    ng.getModule('core.filter')
        .filter('trustedHref', filterFn);

    /* @ngInject */
    function filterFn($sce) {
        return function (url) {
            return $sce.trustAsResourceUrl(url);
        }
    }

})(angular);
