(function (ng) {
    'use strict';

    ng.getModule('core.page')
        .controller('DefaultPageCtrl', controllerFn);

    /* @ngInject */
    function controllerFn($log) {

        var vm = this,
            logger = $log.getInstance('core.page::DefaultPageCtrl');

        vm.init = function() {
            logger.info('init');
        };
    }
})(angular);