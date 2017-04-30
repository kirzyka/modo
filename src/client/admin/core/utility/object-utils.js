(function (ng) {
    'use strict';

    ng.getModule('core.utility')
        .service('ObjectUtils', serviceFn)

    /* @ngInject */
    function serviceFn($log, md5) {
        var service = this,
            log = $log.getInstance('core.utility::ObjectUtils');

        function removeProperties(obj, properties) {
            var result = ng.copy(obj);

            function sanitize(obj, properties) {
                var i = 0, prop;
                if(obj instanceof Array) {
                    for(; i < obj.length; i++) {
                        sanitize(obj[i], properties);
                    }
                } else if(obj instanceof Object) {
                    for(prop in obj) {
                        if(properties.indexOf(prop) > -1) {
                            delete obj[prop];
                        } else {
                            sanitize(obj[prop], properties);
                        }
                    }
                }
            }
            sanitize(result, properties);
            return result;
        }

        function isEqual(objectA, objectB) {
            var objectAStr = objectA ? JSON.stringify(objectA) : '',
                objectBStr = objectB ? JSON.stringify(objectB) : '',
                h1 = md5.createHash(objectAStr),
                h2 = md5.createHash(objectBStr);

            //log.debug(h1);
            //log.debug(h2);

            return h1 === h2;
        }

        function containsInArray(object, array, excludeProrertiesArray) {
            for (var i = 0; i < array.length; i++) {
                var obj = excludeProrertiesArray ? removeProperties(array[i], excludeProrertiesArray) : array[i];
                if(isEqual(obj, object)) {
                    return true;
                }
            }
            return false;
        }

        service.removeProperties = removeProperties;
        service.isEqual = isEqual;
        service.containsInArray = containsInArray;
    }

})(angular);
