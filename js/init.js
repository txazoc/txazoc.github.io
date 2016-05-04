define(function (require, exports, module) {

    var Color = ['color_red', 'color_yellow', 'color_olive', 'color_green', 'color_teal', 'color_blue', 'color_purple', 'color_pink'];

    var Init = {
        init: function () {
            // 事件
            Init.initEvent();

            // 页面
            Init.initPage();

            // 分页
            Init.initPagination();

            // 微信
            Init.initWeiXin();

            // 代码高亮
            Init.initHighlight();
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

                var $about = $('.about');
                if ($about.length > 0) {
                    var $email = $about.find('.email');
                    $email.parent().append($email.html());
                    $email.remove();
                }
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
                    p.css('color', '#999');
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
        },

        initPage: function () {
            if (Page == 'tag') {
                Init.initTag();
            } else if (Page == 'tags') {
                Init.initTags();
            }
        },

        initTag: function () {
            Init.loadData(function () {
                Init.sortTag();
                Init.shuffleArray(Color);
                var lastColor = Color[Color.length - 1];
                var $tags = $('.tags');
                var $items = $tags.find('.items');
                $.each(Tag, function (i, t) {
                    if (i > 0 && i % Color.length == 0) {
                        Init.shuffleArray(Color);
                        if (Color[0] == lastColor) {
                            Init.switchInArray(Color, 0, Math.floor(Math.random() * (Color.length - 1) + 1));
                        }
                        lastColor = Color[Color.length - 1];
                    }
                    $items.append($('<div class="item"></div>').append($('<a></a>').attr('href', '/tags.html?tag=' + t.name + '&color=' + Color[i % Color.length]).addClass(Color[i % Color.length]).html(t.name + '(' + t.size + ')')));
                });
                $tags.show();
            });
        },

        sortTag: function () {
            Tag.sort(function (a, b) {
                return b.size - a.size;
            });
        },

        initTags: function () {
            var tag = Init.getUrlParamValue('tag');
            var color = Init.getUrlParamValue('color');
            if (tag == null || (tag = tag.trim()) == '') {
                return;
            }

            if (color == null) {
                color = Color[Math.floor(Math.random() * Color.length)];
            }

            console.log(color);

            require.async('data', function () {
                var postArray = [];
                $.each(Post, function (i, p) {
                    var tagArray = p.tags.trim().split(' ');
                    if ($.inArray(tag, tagArray) >= 0) {
                        postArray.push(p);
                    }
                });
                Init.displayTag(tag, postArray.length, color);
                Init.displayPost(postArray);
            });
        },

        displayTag: function (tag, size, color) {
            $('#main').find('.wrapper').html($('<div class="list_tag"></div>').append($('<h3>标签</h3>')).append($('<span></span>').addClass(color).html(tag + '(' + size + ')')));
        },

        displayPost: function (posts) {
            var listWrapper = $('<div class="list"><ul></ul></div>');
            var list = listWrapper.find('ul');
            $.each(posts, function (i, p) {
                list.append($('<li></li>')
                    .append($('<h3 class="list-title"></h3>').append($('<a></a>').attr('href', p.url).html(p.title)))
                    .append($('<div class="list-content"></div>').append($('<p></p>').html(p.content)))
                    .append($('<div class="list-info"></div>').append($('<span class="datetime"></span>').html(p.date))));
            });
            $('#main').find('.wrapper').append(listWrapper);
        },

        getUrlParamValue: function (param) {
            var reg = new RegExp("(^|&)" + param + "=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) {
                return decodeURI(r[2]);
            }
            return null;
        },

        shuffleArray: function (array) {
            array.sort(function () {
                return 0.5 - Math.random();
            });
        },

        switchInArray: function (array, i, j) {
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        },

        loadData: function (callback) {
            require.async('data', callback);
        }
    };

    exports.init = Init.init;

});
