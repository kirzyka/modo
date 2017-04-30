(function (ng) {
    'use strict';

    ng.getModule('core.filter')
        .filter('category', filterFn);

    /* @ngInject */
    function filterFn(AppModel) {
        return function (input, category) {
            if (!AppModel.STATIC_DATA.MAP.hasOwnProperty(category) || !AppModel.STATIC_DATA.MAP[category].hasOwnProperty(input)) {
                return input;
            }
            return AppModel.STATIC_DATA.MAP[category][input].value;
        };
    }
})(angular);