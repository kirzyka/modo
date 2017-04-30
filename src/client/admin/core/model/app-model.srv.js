(function (ng) {
    'use strict';

    ng.getModule('core.model')
        .service('AppModel', serviceFn);

    /* @ngInject */
    function serviceFn($log) {
        var log = $log.getInstance('core.model::AppModel'),
            srv = this;

        srv.globals = {
            appTitle: 'Angular SPA Modular Template',
            ssoEnabled: false,
            pageForRedirect: 'default',
            userEmail: '',
            user: null
        };
    }
})(angular);