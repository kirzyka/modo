(function (ng) {
    'use strict';

    ng.getModule('core.messaging')
        .constant('MSG_CONST', {
            USER_LOGIN_SUCCESS:         'USER_LOGIN_SUCCESS',
            USER_LOGIN_FAIL:            'USER_LOGIN_FAIL'
    });
    
})(angular);