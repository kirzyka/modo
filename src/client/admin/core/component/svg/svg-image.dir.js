(function (ng) {
    'use strict';

    ng.getModule('core.component')
        .directive('svgImage', directiveFn);

    /* @ngInject */
    function directiveFn($http, $location, $cacheFactory, $log, des3) {
        var log = $log.getInstance('core.component::svgImage'),
            cache = $cacheFactory('SVG');

        return {
            restrict: 'E',
            scope: {
                href: '=?'
            },
            link: linkFn
        };

        function linkFn($scope, $element) {
            var absUrl = $location.absUrl(),
                host = absUrl.replace(/\/index\.html#.+/, ''),
                imgURL = host + ($element.attr('src') || $scope.href),
                imgId = des3.encrypt('svg_image', imgURL).split('').reverse().join('').substr(0, 24),
                img = cache.get(imgId);

            function manipulateImgNode(data, elem) {
                var $svg,
                    imgClass = elem.attr('class');

                $svg = ng.element(data)[ng.element(data).length - 1];
                //log.debug($svg);
                if (typeof(imgClass) !== 'undefined') {
                    var i = 0,
                        classes = imgClass.split(' ');

                    for (; i < classes.length; ++i) {
                        if ($svg.classList) {
                            $svg.classList.add(classes[i]);
                        } else {
                            $svg.className.baseVal += ' ' + classes[i];
                        }
                    }
                }
                $svg.removeAttribute('xmlns:a');
                return $svg;
            }

            if (!img) {
                $http.get(
                    imgURL,
                    {'Content-Type': 'application/xml'}
                )
                    .then(function (result) {
                        result.data = result.data.replace(/fill\=\".*?\"/gi, '');
                        $element.replaceWith(manipulateImgNode(result.data, $element));
                        cache.put(imgId, result.data);
                    }, function (err) {
                        log.error(err);
                    });
            } else {
                $element.replaceWith(manipulateImgNode(img, $element));
            }
        }
    }

})(angular);
