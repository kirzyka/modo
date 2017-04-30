(function (ng) {
    'use strict';

    ng.getModule('core.utility')
        .service('StringUtils', serviceFn);

    /* @ngInject */
    function serviceFn($log, AppModel) {
        var service = this,
            log = $log.getInstance('core.utility::SecurityUtils');

        function pad(count, symbol) {
            symbol = symbol || ' ';
            count = (isNaN(count) || count < 0) ? 0 : count;
            return new Array(count + 1).join(symbol);
        }

        function toCamelCase( string ){
            return string.toLowerCase().replace(/_([a-z])/g, function (s) {
                return s[1].toUpperCase();
            } );
        }

        function substitute(str, data) {
            if(data && data.length) {
                return str.replace(/%(\d+)/g, function (_, m) {
                    var index = --m;
                    if(index < data.length) {
                        return data[index];
                    } else {
                        return _;
                    }
                });
            } else {
                return str;
            }
        }

        function getMsg(code, data) {
            var msgs = AppModel.STATIC_DATA.MAP.UI_MESSAGES,
                prop, msg;

            for(prop in msgs) {
                msg = msgs[prop];
                if(msg.code === code) {
                    return substitute(msg.label, data);
                }
            }
            return '-- MSG NOT FOUND --';
        }

        service.pad = pad;
        service.toCamelCase = toCamelCase;
        service.substitute = substitute;
        service.getMsg = getMsg;
    }

})(angular);
