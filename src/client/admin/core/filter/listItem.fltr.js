(function (ng) {
    'use strict';

    ng.getModule('core.filter')
        .filter('listItem', filterFn);

    /* @ngInject */
    function filterFn() {
        return function(input, list, inputProp, outputProp) {
            var i, item;

            if(!list || !list.length || !inputProp || !outputProp) {
                return input;
            }

            for(i = 0; i < list.length; i++) {
                item = list[i];
                if(item[inputProp] === input) {
                    return item[outputProp];
                }
            }

            return input;
        };
    }
})(angular);