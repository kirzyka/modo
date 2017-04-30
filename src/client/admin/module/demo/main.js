(function (ng) {
    'use strict';

    var NAME = 'module.demo';

    ng.getModule(NAME, [
            'core',
            'core.navigation.menu'
        ])
        .config(configFn)
        .run(runFn);

    /* @ngInject */
    function configFn($routeProvider, MenuCfgServiceProvider) {

        $routeProvider
            .when('/demo-1', {
                templateUrl: 'html/module/demo/demo1.html',
                controller: 'Demo1Ctrl',
                controllerAs: 'page'
            })
            .when('/demo-2', {
                templateUrl: 'html/module/demo/demo2.html',
                controller: 'Demo2Ctrl',
                controllerAs: 'page'
            });


        MenuCfgServiceProvider.addMenuItems([
            {link: 'demo-1', label: 'Demo item 1', order: 0, group: 'Demo'},
            {link: 'demo-2', label: 'Demo item 2', order: 0, group: 'Demo'},
            {link: 'report-demo-1', label: 'Report 1', order: 0, group: 'Reports'}
        ]);
    }

    /* @ngInject */
    function runFn($log) {
        var log = $log.getInstance(NAME);

        log.info('is running...');
    }
})(angular);