(function (ng) {
    'use strict';
    
    ng.getModule('core.messaging')
        .factory('MessageFactory', factoryFn);

    function factoryFn() {

        return function(name, data){

            var _name = name || '';
            var _data = data || null;

            var Message = function() {};

            Message.prototype.getName = getName;
            Message.prototype.getData = getData;
            Message.prototype.setData = setData;

            return new Message();

            function getName() {
                return _name;
            }

            function getData() {
                return _data;
            }
            function setData(value) {
                _data = value;
            }
        };
    }
})(angular);