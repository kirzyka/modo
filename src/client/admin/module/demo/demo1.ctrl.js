(function (ng) {
    'use strict';

    ng.getModule('module.demo')
        .controller('Demo1Ctrl', controllerFn);

    /* @ngInject */
    function controllerFn($log) {

        var vm = this,
            logger = $log.getInstance('module.demo::Demo2Ctrl');

        vm.init = function() {
            logger.info('init');
        };
    }
})(angular);