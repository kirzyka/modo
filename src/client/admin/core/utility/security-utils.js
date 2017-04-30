(function (ng) {
    'use strict';

    ng.getModule('core.utility')
        .service('SecurityUtils', serviceFn)

    /* @ngInject */
    function serviceFn($log, AppModel, StringUtils) {
        var service = this,
            log = $log.getInstance('core.utility::SecurityUtils');

        function hasPermission() {
            return true;
        }

        function updatePermissions() {
            var permissions = AppModel.globals.user.permission,
                permission,
                maxLength, permL = [], permS = [],
                i, gap = 60;

            if(permissions.length !== Object.keys(service.permission).length) {
                // Error
                maxLength = Math.max(permissions.length, Object.keys(service.permission).length)  + 1;

                ng.forEach(service.permission, function (value, key) {
                    permL.push(key);
                });
                for (i = 0; i < permissions.length; i++) {
                    permS.push(permissions[i].label);
                }
                permL.sort();
                permL.unshift('_LOCAL_LIST_');
                permS.sort();
                permS.unshift('_SERVER_LIST_');
                log.warn('Length of Incoming Permission list and Local Permission list not match');
                for(i = 0; i < maxLength; i++) {
                    log.debug(
                        permL.length > i ? (permL[i] + StringUtils.pad(gap - permL[i].length, ' ')) : StringUtils.pad(gap, ' '),
                        permS.length > i ? (permS[i] + StringUtils.pad(gap - permS[i].length, ' ')) : StringUtils.pad(gap, ' '));
                }

                return;
            }

            for (i = 0; i < permissions.length; i++) {
                permission = permissions[i];
                if (!service.permission.hasOwnProperty(permission.label)) {
                    // Error
                    log.error('Incoming Permission not found in Local Permission list');
                    return;
                }
                service.permission[permission.label] = permission.value === 'Y';
            }
        }

        service.permission = {
            DATA_MAINTAIN_RULE_SET_SEARCH: false,
            DATA_MAINTAIN_RULE_SET_REJECT: false,
            DATA_MAINTAIN_RULE_SET_COMMENT: false,
            DATA_MAINTAIN_RULE_SET_APPROVE: false,
            DATA_MAINTAIN_RULE_SET_AMEND: false,
            DATA_MAINTAIN_RULE_SET_ADD: false,
            DATA_MAINTAIN_RULE_SET_DEACTIVATE: false,
            DATA_MAINTAIN_RULE_SET_SUBMIT: false,
            DATA_MAINTAIN_RULE_SET_COPY: false,
            DATA_MAINTAIN_RULE_SET_PASTE: false,
            DATA_MAINTAIN_RULE_SET_ANALYZE: false,
            DATA_MAINTAIN_DICTIONARY: false
        };

        service.ACTION_AMEND = 1 << 0;
        service.ACTION_SUBMIT = 1 << 1;
        service.ACTION_DEACTIVATE = 1 << 2;
        service.ACTION_APPROVE = 1 << 3;
        service.ACTION_REJECT = 1 << 4;
        service.ACTION_CLONE = 1 << 5;
        service.ACTION_ADD_COMMENT = 1 << 6;
        service.ACTION_AS_DRAFT = 1 << 7;
        service.ACTION_COPY = 1 << 8;
        service.ACTION_PASTE = 1 << 9;
        service.ACTION_ANALYZE = 1 << 10;

        service.updatePermissions = updatePermissions;
        service.hasPermission = hasPermission;
    }

})(angular);
