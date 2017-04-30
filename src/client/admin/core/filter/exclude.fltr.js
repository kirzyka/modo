(function (ng) {
    'use strict';

    ng.getModule('core.filter')
        .filter('exclude', filterFn);

    /* @ngInject */
    function filterFn() {
        return function(input, exclude, prop) {
            var result;

            if (!ng.isArray(input)) {
                return input;
            }

            if (!ng.isArray(exclude)) {
                exclude = [];
            }

            /*if (prop) {
                exclude = exclude.map(function byProp(item) {
                    return item[prop];
                });
            }*/

            result = input.filter(function byExclude(item) {
                return exclude.indexOf(prop ? item[prop] : item) === -1;
            });

            return result;
        };
    }
})(angular);