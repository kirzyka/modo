// Collecting list of registered modules
(function(ng, orig) {

    function module() {
        if (arguments.length > 1) {
            ng.modules.push(arguments[0]);
        }
        return orig.apply(null, arguments);
    }

    function getModule(name) {
        if(ng.modules.indexOf(name) > -1) {
            return ng.module(name);
        } else {
            return ng.module(name, []);
        }
    }

    ng.modules = [];

    ng.module = module;
    ng.getModule = getModule;

})(angular, angular.module);


(function (ng) {
    'use strict';

    var UNRESTRICTED_PAGES = ['/login', '/sso', '/access-denied'];

    return ng.module('app', [
        'ngRoute',
        'ngCookies',
        'angular-logger',
        
        'core',
        'core.component',
        'core.filter',
        'core.messaging',
        'core.model',
        'core.navigation.menu',
        'core.page',
        'core.security',
        'core.utility',

        'module.demo'
        /*
        'module.report'*/
    ])
        .config(configFn)
        .run(runFn);

    /* @ngInject */
    function configFn($locationProvider, $routeProvider, $httpProvider, logEnhancerProvider, MenuCfgServiceProvider) {

        $locationProvider.hashPrefix('');
        $routeProvider
            .when('/default', {
                templateUrl: './html/core/page/default.html',
                controller: 'DefaultPageCtrl',
                controllerAs: 'vm'
            })
            .when('/login', {
                templateUrl: './html/core/page/login.html',
                controller: 'LoginCtrl',
                controllerAs: 'page'
            })
            .otherwise({
                redirectTo: '/default'
            });

        /*
         $httpProvider.defaults.headers.put = {
         'Access-Control-Request-Origin': '*',
         'Access-Control-Request-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
         'Access-Control-Request-Headers': 'Content-Type, X-Requested-With'
         };
         $httpProvider.defaults.useXDomain = true;
        */

        logEnhancerProvider.logLevels = {
            /*'a.b.c': logEnhancerProvider.LEVEL.TRACE, // trace + debug + info + warn + error
            'a.b.d': logEnhancerProvider.LEVEL.ERROR, // error
            'a.b': logEnhancerProvider.LEVEL.DEBUG, // debug + info + warn + error
            'a': logEnhancerProvider.LEVEL.WARN, // warn + error
            '*': logEnhancerProvider.LEVEL.WARN // warn + error*/
            //'core': logEnhancerProvider.LEVEL.OFF
        };

        /*MenuCfgServiceProvider.addMenuItems([
            {link: '#', label: 'mnu 1', order: 1},
            {link: '#', label: 'mnu 2', order: 2},
            {link: '#', label: 'mnu 3', order: 3}
        ]); */
    }

    /* @ngInject */
    function runFn($rootScope, $location, $log, AppModel, MenuCfgService) {
        var KEY_BACKSPACE = 8,
            log = $log.getInstance('app');

        log.info('Application is running...');

        // build menu
        MenuCfgService.buildMenu();

        // document listeners
        // mouse
        ng.element(document).on('click', function(event) {
            $rootScope.$emit('documentClicked', ng.element(event.target));
        });

        // keyboard
        ng.element(document).on('keydown', function(event) {
            var target = event.srcElement || event.target,
                rx = /INPUT|SELECT|TEXTAREA/i;
            if(event.which === KEY_BACKSPACE) {
                if(!rx.test(target.tagName) || target.disabled || target.readOnly ){
                    event.preventDefault();
                }
            }
        });

        // change location
        $rootScope.$on('$locationChangeStart', function (event, next, current) {

            var currentPath = $location.path(),
                isRedirectToLogin = '/login' === $location.path();

            var loggedIn = !!AppModel.globals.user,
                restrictedPage = UNRESTRICTED_PAGES.indexOf($location.path()) === -1;

            log.debug($location.path(), loggedIn);

            if (restrictedPage && !loggedIn) {
                event.preventDefault();
                $location.path('/login');
            }

        });
    }
})(angular);