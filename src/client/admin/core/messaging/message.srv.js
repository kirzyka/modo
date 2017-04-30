(function (ng) {
    'use strict';

    ng.getModule('core.messaging')
        .service('MessageService', serviceFn);

    /* @ngInject */
    function serviceFn($log) {

        var logger = $log.getInstance('core.messaging::MessageService');

        var listeners = {};
        var count = 0;

        this.registerListener = registerListener;
        this.unregisterListener = unregisterListener;
        this.sendMsg = sendMsg;

        function registerListener(messageName, listener) {
            if (!listeners[messageName]) {
                listeners[messageName] = [];
            }
            listeners[messageName].push(listener);
            count++;
        };
        function unregisterListener(messageName, listener) {
            if (listeners[messageName]) {
                for (var i = 0; i < listeners[messageName].length; i++) {
                    if (listeners[messageName][i] === listener) {
                        listeners[messageName].splice(i,1);
                        count--;
                        return true;
                    }
                }
            }
            return false;
        };
        function sendMsg(message) {

            logger.debug(message.getName(), message.getData());

            for (var key in listeners) {
                if (key == message.getName()) {
                    for (var i = 0; i < listeners[key].length; i++) {
                        listeners[key][i](message);
                    }
                    return
                }
            }
        };
    }
})(angular);