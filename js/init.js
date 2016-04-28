define(function (require, exports, module) {

    var Init = {
        init: function () {
            Init.initEvent();
            Init.initHighlight();
            Init.initWeiXin();
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
        }
    };

    exports.init = Init.init;

});
