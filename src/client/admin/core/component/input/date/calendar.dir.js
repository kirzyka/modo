(function (ng) {
    'use strict';
    
    ng.getModule('core.component')
        .directive('calendar', directiveFn);

    /* @ngInject */
    function directiveFn(dateFilter) {

        return {
            require: 'ngModel',
            restrict: 'E',
            scope: {
                defaultDate: '=?',
                weekStartsOn: '=?',
                minDate: '=?',
                maxDate: '=?',
                disabledDates: '=?',
                enabledDates: '=?',
                visible: '=?',

                dateChanged: '&?'
            },
            templateUrl: 'html/core/component/input/date/calendar.html',
            link: linkFn
        };

        function linkFn($scope, $element, $attrs, ngModel) {
            var noExtraRows = $attrs.hasOwnProperty('noExtraRows');
            var weekStartsOn = $scope.weekStartsOn;
            var selectedDate = null;
            var minDate;
            var maxDate;

            if (!$attrs.hasOwnProperty('visible')) {
                $scope.visible = true;
            }

            var $render = ngModel.$render = function () {
                if (ngModel.$viewValue) {
                    selectedDate = ngModel.$viewValue;
                }

                var now = new Date();
                var today = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);

                if ($scope.defaultDate) {
                    $scope.currentDate = new Date($scope.defaultDate);
                } else if (selectedDate) {
                    $scope.currentDate = new Date(selectedDate);
                } else {
                    $scope.currentDate = today;
                }

                setViewValue(selectedDate);
                if ($scope.visible) {
                    render();
                }
            };

            if (!angular.isNumber(weekStartsOn) || weekStartsOn < 0 || weekStartsOn > 6) {
                weekStartsOn = 0;
            }

            $scope.setDate = function (date) {
                var msUTC = getUTC(date.dateObj);
                if (isDateOutOfRange(msUTC) || isDateDisabled(msUTC)) return;
                selectedDate = msUTC;
                setViewValue(selectedDate);

                if ($scope.dateChanged) {
                    console.log('date changed callback');
                    $scope.dateChanged();
                }
            };

            $scope.classesFor = function (date) {
                var extraClasses = selectedDate == getUTC(date.dateObj) ? 'calendar-active' : null;
                return date.classNames.concat(extraClasses);
            };

            $scope.changeMonth = function (offset) {
                // If the current date is January 31th, setting the month to date.getMonth() + 1
                // sets the date to March the 3rd, since the date object adds 30 days to the current
                // date. Settings the date to the 2nd day of the month is a workaround to prevent this
                // behaviour
                $scope.currentDate.setDate(1);
                $scope.currentDate.setMonth($scope.currentDate.getMonth() + offset);
                render();
            };

            // Workaround to watch multiple properties. XXX use $$scope.$watchGroup in angular 1.3
            $scope.$watch(function () {
                    return angular.toJson([$scope.minDate, $scope.maxDate, $scope.disabledDates, $scope.enabledDates, $scope.visible]);
                }, function () {
                    minDate = new Date($scope.minDate || 0);
                    maxDate = new Date($scope.maxDate || 99999999999999);

                    $render();
                }
            );

            function render() {
                var initialDate = new Date($scope.currentDate.getFullYear(), $scope.currentDate.getMonth(), 1, 0);
                var currentMonth = initialDate.getMonth() + 1;
                var allDates = buildDates(initialDate, {
                    weekStartsOn: weekStartsOn,
                    noExtraRows: noExtraRows
                })
                var dates = [];
                var now = new Date();
                var today = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);

                var nextMonthInitialDate = new Date(initialDate);
                nextMonthInitialDate.setMonth(currentMonth);

                $scope.allowPrevMonth = !minDate || initialDate > minDate;
                $scope.allowNextMonth = !maxDate || nextMonthInitialDate <= maxDate;
                $scope.dayNames = buildDayNames(weekStartsOn);

                for (var i = 0; i < allDates.length; i++) {
                    var classNames = [];
                    var dateObj = allDates[i];
                    var msUTC = getUTC(dateObj);
                    var isDisabled = isDateDisabled(msUTC);
                    var isOutOfRange = isDateOutOfRange(msUTC);

                    if (!isDisabled && !isOutOfRange) {
                        classNames.push('calendar-enabled');
                    }
                    if (isDisabled) {
                        classNames.push('calendar-disabled');
                    }
                    if (isOutOfRange) {
                        classNames.push('calendar-another-month');
                    }
                    if (dateObj.getTime() == today.getTime()) {
                        classNames.push('calendar-today');
                    }

                    dates.push({dateObj: dateObj, classNames: classNames});
                }

                $scope.dates = dates;
            }
            function setViewValue(value) {
                ngModel.$setViewValue(value);
            }
            function isDateOutOfRange(date) {
                date = new Date(date);
                return date < minDate || date > maxDate || dateFilter(date, 'M') !== dateFilter($scope.currentDate, 'M');
            }
            function isDateDisabled(date) {
                var result = false;

                if ($scope.disabledDates) {

                    for (var i = 0; i < $scope.disabledDates.length; i++) {
                        var range = $scope.disabledDates[i];
                        if(typeof range == 'object') {
                            if (((range.hasOwnProperty('start') && date >= range.start) ||
                                (!range.hasOwnProperty('start') && range.hasOwnProperty('end'))) &&
                                ((range.hasOwnProperty('end') && date <= range.end) ||
                                (!range.hasOwnProperty('end') && range.hasOwnProperty('start')))
                            ) {
                                result = true;
                                break;
                            }
                        } else {
                            /* Single Date */
                            if(range == date) {
                                result = true;
                                break;
                            }
                        }
                    }
                }
                return result;
            }
        }

        function getUTC(date) {
            return date.getTime() - new Date().getTimezoneOffset() * 60 * 1000;
        }
        function buildDates(date, options) {
            var dates = [],
                lastDate = new Date(date.getFullYear(), date.getMonth() + 1, 0, 0);

            options = options || {};
            date = new Date(date);

            while (date.getDay() !== options.weekStartsOn) {
                date.setDate(date.getDate() - 1);
            }

            for (var i = 0; i < 42; i++) {  // 42 == 6 rows of dates
                if (options.noExtraRows && date.getDay() === options.weekStartsOn && date > lastDate) break;

                dates.push(new Date(date));
                date.setDate(date.getDate() + 1);
            }

            return dates;
        }
        function buildDayNames(weekStartsOn) {
            //var dayNames = $locale.DATETIME_FORMATS.SHORTDAY;
            var dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

            if (weekStartsOn) {
                dayNames = dayNames.slice(0);
                for (var i = 0; i < weekStartsOn; i++) {
                    dayNames.push(dayNames.shift());
                }
            }
            return dayNames;
        }
    }
})(angular);
