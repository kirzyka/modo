(function (ng) {
    'use strict';

    ng.getModule('core')
        .controller('MainCtrl', controllerFn);
    
     /* @ngInject */
    function controllerFn($log, MessageService, MSG_CONST) {

        var vm = this,
            logger = $log.getInstance('core::MainCtrl');

        vm.init = init;
        vm.mnuItems = [];
        vm.user = null;

        function init() {
            logger.info('init');
            MessageService.registerListener(MSG_CONST.USER_LOGIN_SUCCESS, userListener);
        }

        function userListener(msg) {
            vm.user = msg.getData();
            MessageService.unregisterListener(MSG_CONST.USER_LOGIN_SUCCESS, userListener);
        }
    }
})(angular);

