(function (ng) {
    'use strict';

    ng.getModule('core.component')
        .directive('combobox', directiveFn);

    /* @ngInject */
    function directiveFn($rootScope, $timeout) {

        return {
            restrict: 'E',
            templateUrl: 'html/core/component/input/combobox.html',
            scope: {
                list: '=',
                cacheList: '=?',
                value: "=?",
                mandatory: "=?",
                valueField: '@?',
                labelField: '@?',
                multiple: '=?',
                autocomplete: '=?',
                pattern: '=?',
                enabled: '=?',

                onType: '&?',
                onChange: '&?'
            },
            link: linkFn
        };

        function linkFn($scope, $element, $attrs, $ctrl) {

            var opt,
                waitForInput = false,
                delay,
                initLock = true,
                //defaultValue = null,
                destroyDocumentClickListener;

            $scope.defaultPattern = /.*/;
            $scope.pattern = $scope.pattern || $scope.defaultPattern;
            $scope.currentPattern = $scope.pattern;
            $scope.cacheList = $scope.cacheList || [];

            // Functions
            function onTextInputClick() {
                waitForInput = true;
                show(true);
            }

            function onTextInputChange() {
                waitForInput = true;
            }

            function onDocumentClick() {
                if (!$scope.showClicked) {
                    $scope.$apply(function () {
                        close();
                    });
                }
                $scope.showClicked = false;
            }

            function show(flag) {
                $scope.showClicked = true;
                if(flag) {
                    if(destroyDocumentClickListener) {
                        destroyDocumentClickListener();
                    }
                    $scope.listVisible = true;
                    destroyDocumentClickListener = $rootScope.$on("documentClicked", onDocumentClick);
                    if($scope.autocomplete) {
                        $scope.searchParam = '';
                        $scope.currentPattern = $scope.pattern;
                    }
                } else {
                    close();
                }
            }

            function close() {
                waitForInput = false;
                $scope.listVisible = false;
                updateDisplayLabel();
                destroyDocumentClickListener();
            }

            function clear() {
                $scope.selectedItems = [];
                updateDisplayLabel();
                updateSelectedValues();
                if($scope.onChange) {
                    $scope.onChange()(null);
                }
            }

            function isSelected(item) {
                return $scope.selectedItems.indexOf(item) >= 0;
            }

            function getItemLabel(item) {
                return !item ? '' : ($scope.labelField ? item[$scope.labelField] : item);
            }

            function onClickSelect(item, event) {
                select(item);
            }

            function select(item) {
                var index = $scope.selectedItems ? $scope.selectedItems.indexOf(item) : -1;
                $scope.selectedItems = $scope.selectedItems || [];

                //Prevent closing after selection
                if($scope.multiple) {
                    $scope.showClicked = true;
                }

                if(index === -1) {

                    if($scope.multiple) {
                        $scope.selectedItems.push(item);
                    } else {
                        $scope.selectedItems = [item];
                    }

                } else {
                    if($scope.multiple) {
                        $scope.selectedItems.splice(index, 1);
                    } else {
                        return;
                    }
                }
                updateSelectedValues();
                updateDisplayLabel();

                if($scope.onChange) {
                    $scope.onChange()(item);
                }
            }

            /*function setDefault() {
                $scope.selectedItems = defaultValue;
                updateSelectedValues();
                updateDisplayLabel();
            }*/

            function applyValue() {
                var i, filteredList;
                if(!$scope.value) {
                    $scope.selectedItems = [];
                    return;
                }
                if (!$scope.multiple) {
                    if ($scope.valueField && $scope.list) {
                        for (i = 0; i < $scope.list.length; i++) {
                            if ($scope.list[i][$scope.valueField] === $scope.value) {
                                $scope.selectedItems = [$scope.list[i]];
                                break;
                            }
                        }
                    } else {
                        $scope.selectedItems = [$scope.value];
                    }
                } else {
                    // multiple
                    $scope.selectedItems = [];
                    if($scope.list) {
                        filteredList = $scope.list.filter($scope.filterFunction);
                        for (i = 0; i < filteredList.length; i++) {
                            if ($scope.value.indexOf(filteredList[i][$scope.valueField]) !== -1) {
                                $scope.selectedItems.push(filteredList[i]);
                            }
                        }
                    }
                    for (i = 0; i < $scope.cacheList.length; i++) {
                        if ($scope.value.indexOf($scope.cacheList[i][$scope.valueField]) !== -1) {
                            $scope.selectedItems.push($scope.cacheList[i]);
                        }
                    }
                }
            }

            function updateDisplayLabel() {
                var value = '';

                if($scope.selectedItems && $scope.selectedItems.length > 0) {
                    if($scope.selectedItems.length == 1) {
                        value = $scope.getItemLabel($scope.selectedItems[0]);
                        $scope.currentPattern = $scope.pattern;
                    } else {
                        value = $scope.selectedItems.length + " Items selected";
                        $scope.currentPattern = $scope.defaultPattern;
                    }
                }

                if(!$scope.listVisible) {
                    $scope.searchParam = value;
                }
            }

            function updateSelectedValues() {
                var result = [];

                if(!$scope.selectedItems) {
                    if($scope.multiple) {
                        $scope.value = [];
                    } else {
                        $scope.value = null;
                    }
                    return;
                }

                if($scope.multiple) {
                    if ($scope.valueField) {
                        $scope.selectedItems.forEach(function (item) {
                            result.push(item[$scope.valueField]);
                        });
                        $scope.value = result;
                    } else {
                        $scope.value = $scope.selectedItems.slice(); // copy as is
                    }
                } else {
                    if ($scope.valueField) {
                        $scope.value = ($scope.selectedItems && $scope.selectedItems.length) ? $scope.selectedItems[0][$scope.valueField] : null;
                    } else {
                        $scope.value = ($scope.selectedItems && $scope.selectedItems.length) ? $scope.selectedItems[0] : null;
                    }
                }
            }

            function updateHasItemsToDisplayFlag() {
                var res = ($scope.cacheList && $scope.cacheList.length > 0) || ($scope.list && $scope.list.filter($scope.filterFunction).length > 0);
                $scope.hasItemsToDisplay = res;
            }

            function filterFunction(item) {
                var result = true,
                    i,
                    cachedItem,
                    listItem;

                if($scope.multiple && item) {
                    for (i = 0; i < $scope.cacheList.length; i++) {
                        cachedItem = $scope.valueField ? $scope.cacheList[i][$scope.valueField] : $scope.cacheList[i];
                        listItem = $scope.valueField ? item[$scope.valueField] : item;
                        if (cachedItem === listItem) {
                            result = false;
                            break;
                        }
                    }
                }
                return result;
            }

            //--------------------------------------------
            $timeout(function () {
                initLock = false;
            }, 250);

            // Default atts
            $scope.defaults = {
                list: [],
                labelField: undefined,
                valueField: undefined,
                multiple: false,
                enabled: true,
                autocomplete: false
            };

            for (opt in $scope.defaults) {
                if(ng.isUndefined($scope[opt])) {
                    $scope[opt] = $scope.defaults[opt];
                }
            }

            $scope.placeholder = $scope.autocomplete ? "start typing..." : "";

            // watchers
            //--------------------------------------------
            if($scope.autocomplete) {
                $scope.$watch('searchParam', function (newValue, oldValue) {

                    if(!waitForInput) {
                        return;
                    }

                    if (oldValue === newValue || (!oldValue && initLock || !newValue)) {
                        return;
                    }

                    if (typeof $scope.searchParam !== 'undefined' && $scope.searchParam !== null) {
                        $scope.selectedItems = $scope.selectedItems || [];
                        $scope.cacheList = $scope.selectedItems.slice();

                        // function that's passed to on-type attribute gets executed
                        if ($scope.onType) {
                            clearTimeout(delay);
                            delay = setTimeout(function () {
                                if($scope.searchParam) {
                                    $scope.onType()($scope.searchParam);
                                }
                            }, 1500);
                        } else {
                            // filter existing list
                            $scope.list = $scope.list;
                            //$scope.getItemLabel(item).indexOf($scope.searchParam) >= 0;
                        }

                        updateHasItemsToDisplayFlag();
                    }
                });
            }

            $scope.$watch('list', function (newValue, oldValue) {
                var i = 0, item;
                if($scope.list) {
                    $scope.list.sort(function (itemA, itemB) {
                        return itemA.sortOrder - itemB.sortOrder;
                    });
                    //defaultValue = [];
                    /*for(; i < $scope.list.length; i++) {
                        item = $scope.list[i];
                        if(item.isDefault) {
                            defaultValue.push(item);
                            break;
                        }
                    }*/

                    applyValue();
                    updateDisplayLabel();
                }

                updateHasItemsToDisplayFlag();
            });

            $scope.$watch('value', function(newVal, oldValue) {
                /*if(!newVal && !oldValue) {
                    // set default value first time
                    setDefault();
                } else {*/
                applyValue();
                updateDisplayLabel();
                updateHasItemsToDisplayFlag();
                //}
            });

/*            $scope.$on('setDefaultState', function() {
                setDefault();
            });*/

            $scope.selectedItems = [];
            $scope.listVisible = false;
            $scope.searchParam = '';
            $scope.hasItemsToDisplay = false;

            $scope.show = show;
            $scope.close = close;
            $scope.clear = clear;
            $scope.isSelected = isSelected;
            $scope.getItemLabel = getItemLabel;
            $scope.onClickSelect = onClickSelect;
            $scope.onTextInputClick = onTextInputClick;
            $scope.onTextInputChange = onTextInputChange;
            $scope.filterFunction = filterFunction;
        }
    }

})(angular);