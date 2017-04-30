(function (ng) {
    'use strict';

    ng.getModule('core.component')
        .directive('datepicker', directiveFn);

    /* @ngInject */
    function directiveFn($rootScope, dateFilter) {

        return {
            restrict: 'E',
            scope: {
                selectedDate: '=',
                disabledDates: '=?',
                enabledDates: '=?',
                enabled: '=?'
            },
            templateUrl: 'html/core/component/input/date/datepicker.html',
            link: linkFn
        };

        function linkFn($scope, $element, $attrs, $ctrl) {
            var destroyDocumentClickListener;

            $scope.enabled = ng.isUndefined($scope.enabled) ? true : $scope.enabled;
            
            function onDocumentClick() {
                if (!$scope.showClicked) {
                    $scope.$apply(function () {
                        closeCalendar();
                    });
                }
                $scope.showClicked = false;
            }

            function clear() {
                $scope.selectedDate = null;
            }

            function openCalendar() {
                var rect = $element[0].getBoundingClientRect(),                           // element boundaries
                    clw = (window.innerWidth || document.documentElement.clientWidth),    // client window width
                    clh = (window.innerHeight || document.documentElement.clientHeight);  // client window height

                $scope.showClicked = true;
                if(!$scope.isCalendarOpen) {
                    // Open
                    if(rect.top > clh - 200) {
                        $scope.isUp = true;
                    }
                    $scope.isCalendarOpen = true;
                    destroyDocumentClickListener = $rootScope.$on("documentClicked", onDocumentClick);
                } else {
                    closeCalendar();
                }
            }

            function closeCalendar() {
                $scope.isCalendarOpen = false;
                destroyDocumentClickListener();
            }

            function onCalendarClick($event) {
                $event.stopImmediatePropagation();
            }

            function onDateChanged() {
                closeCalendar();
            }

            $scope.$watch(function () {
                    return $scope.selectedDate;//ng.toJson([$scope.selectedDate]);
                }, function (newValue, oldValue) {
                    var format = ($attrs.format || 'dd.MM.yyyy').replace(/m/g, 'M');
                    $scope.selectedDateLabel = newValue ?  dateFilter(new Date(newValue), format) : '';
                }
            );

            $scope.isCalendarOpen = false;
            $scope.calendarPosition = {};

            $scope.clear = clear;
            $scope.openCalendar = openCalendar;
            $scope.onCalendarClick = onCalendarClick;
            $scope.onDateChanged = onDateChanged;
        }
    }

})(angular);