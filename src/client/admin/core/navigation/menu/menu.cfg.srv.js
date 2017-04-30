(function (ng) {
    'use strict';

    ng.getModule('core.navigation.menu')
        .provider('MenuCfgService', providerFn);

    function providerFn() {
        //var menuItemList = [{link:'#', label:'default', order: 0, group: ''}];
        var menuItemList = [],
            menu = [];

        this.addMenuItems = addMenuItems;
        this.$get = MenuService;

        function addMenuItems(value) {
            menuItemList = menuItemList.concat(value);
        }

        function MenuService() {

            var service = {};

            function labelToId(str) {
                return str.replace(/\s/g, '_').toLowerCase();
            }

            function buildMenu () {
                var i, j,
                    menuGroup, menuItem,
                    isGroupExists;

                for(i = 0; i < menuItemList.length; i++) {
                    menuItem = menuItemList[i];
                    menuItem.groupId = labelToId(menuItem.group);
                    isGroupExists = false;

                    for(j = 0; j < menu.length; j++) {
                        menuGroup = menu[j];
                        if(menuGroup.groupId == menuItem.groupId) {
                            isGroupExists = true;
                            break;
                        }
                    }

                    if(isGroupExists) {
                        if(menuGroup.hasOwnProperty('items')) {
                            menuGroup.items.push(menuItem);
                        } else {
                            menuGroup.items = [ng.copy(menuGroup)];
                            menuGroup.link = '#';
                            menuGroup.label = menuGroup.group;
                            menuGroup.items.push(menuItem);
                        }
                    } else {
                        menu.push(menuItem);
                    }
                }
            }

            function getMenuItems() {
                return menu;/*ItemList.sort(function(a, b) {
                    if(ng.isUndefined(a['order']) && ng.isUndefined(b['order']))
                        return a['label'] > b['label'];
                    if(ng.isUndefined(a['order'])) return 1;
                    if(ng.isUndefined(b['order'])) return -1;
                    return a['order'] - b['order'];
                });           */
            }

            service.buildMenu = buildMenu;
            service.getMenuItems = getMenuItems;

            return service;
        }
    }
})(angular);