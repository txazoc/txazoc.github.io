define(function (require, exports, module) {

    var Init = {
        init: function () {
            Init.initEvent();
            Init.initHighlight();
            Init.initWeiXin();
            Init.initPagination();
        },

        initEvent: function () {
            Init.resize();

            $(window).resize(function () {
                Init.resize();
            });
        },

        resize: function () {
            var windowHeight = $(document).height();
            var headHeight = $('#header').innerHeight();
            var footHeight = $('#footer').show().innerHeight();
            var mainHeight = windowHeight - headHeight - footHeight;
            $('#main').css('minHeight', (mainHeight + 0.5) + 'px');
        },

        initHighlight: function () {
            var preCode = $('pre > code');
            if (preCode.length > 0) {
                require.async('highlight', function () {
                    preCode.each(function (i, e) {
                        var language = $(this).attr('class').trim();
                        $(this).removeClass(language).addClass('language-' + language);
                        hljs.highlightBlock(e);
                        $(this).parent().addClass('hljs-dark').show();
                    });
                });
            }
        },

        initWeiXin: function () {
            if (Init.isWeiXin()) {
                $('#header .navbar-nav').find('li a').each(function (i, e) {
                    var content = '';
                    var text = $(this).html();
                    for (var k = 0; k < text.length; k++) {
                        content += text.charAt(k);
                        if (k != text.length - 1) {
                            content += '<label></label>';
                        }
                    }
                    $(this).html(content);
                });
            }
        },

        isWeiXin: function () {
            var userAgent = window.navigator.userAgent.toLowerCase();
            return userAgent.match(/MicroMessenger/i) == "micromessenger";
        },

        initPagination: function () {
            var $page = $('.page');
            if ($page.length > 0) {
                var pageValue = $page.attr('page');
                var pages = pageValue.split('#');
                var currentPage = parseInt(pages[0]);
                var totalPage = parseInt(pages[1]);
                Init.buildPagination(currentPage, totalPage);
            }
        },

        buildPagination: function (currentPage, totalPage) {
            var pageArray = [];
            if (totalPage <= 5) {
                pageArray = Init.getIntArray(1, totalPage);
            } else if (currentPage <= 3) {
                pageArray = Init.getIntArray(1, 5);
            } else if (currentPage >= totalPage - 2) {
                pageArray = Init.getIntArray(totalPage - 4, totalPage);
            } else {
                pageArray = Init.getIntArray(currentPage - 2, currentPage + 2);
            }

            var $page = $('.page');
            $.each(pageArray, function (i, v) {
                var p = $('<a></a>').html(v);
                if (v == currentPage) {
                    p.css('color', '#ccc');
                } else {
                    p.addClass('hover').attr('href', v == 1 ? '/' : '/index/' + v);
                }
                $page.append(p);
            });
            $page.append($('<span class="summary"></span>').html(currentPage + ' / ' + totalPage));
            $page.show();
        },

        getIntArray: function (from, to) {
            var array = [];
            for (var i = from; i <= to; i++) {
                array.push(i);
            }
            return array;
        }
    };

    exports.init = Init.init;

});
