(function (ng) {
    'use strict';

    ng.module('core.page')
        .controller('LoginCtrl', controllerFn);

    /* @ngInject */
    function controllerFn($location, $cookies, $q, $log, AppModel) {
        var vm = this,
            log = $log.getInstance('core.page::LoginCtrl');

        function init() {
            log.info('init');
        }

        function submit() {
            log.info('sumbit');
            $cookies.put('user.email', vm.model.globals.userEmail);

            vm.model.globals.user = {
                email: 'user@db.com',
                role: [
                    'Admin',
                    'Data Manager'
                ]
            };
            $location.path(vm.model.globals.pageForRedirect);

                                                                 /*
            UsersSrv.login()
                .then(function () {
                    $q.all([
                        AppSrv.loadDictionary(),
                       // AppSrv.loadColumnDescription(),
                        // get default filter (RuleSet Search Screen)

                    ])
                    .then(function (results) {
                        $location.path(vm.model.globals.pageForRedirect);
                    });
                }, function(response) {
                    if(response.status === 403) {
                        $location.path('/access-denied');
                    }
                });
                */
        }

        // Public API
        vm.model = AppModel;

        vm.init = init;
        vm.submit = submit;
    }

})(angular);
