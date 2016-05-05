define(function (require, exports, module) {

    var Color = ['color_red', 'color_yellow', 'color_olive', 'color_green', 'color_teal', 'color_blue', 'color_purple', 'color_pink'];

    var LandScapeSvg = ['beach.svg', 'castle.svg', 'cityscape.svg', 'fields.svg', 'forest.svg', 'hills.svg', 'iceberg.svg', 'mill.svg', 'river.svg', 'spruce.svg', 'trees.svg', 'waterfall.svg', 'windmills.svg'];

    var Month = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二'];

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

            $('.icon-qq').on('click', function () {
                Share.shareToQQZone();
            });

            $('.icon-sina').on('click', function () {
                Share.shareToSina();
            });

            $('.icon-weixin').on('click', function () {
                Share.shareToWeixin();
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
            } else if (Page == 'archive') {
                Init.initArchive();
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
                    $items.append($('<div class="item"></div>').append($('<span></span>').attr('tag', t.name).attr('color', Color[i % Color.length]).addClass(Color[i % Color.length]).html(t.name + '(' + t.size + ')')));
                });
                $tags.delegate('.item span', 'click', function () {
                    Init.redirectUrl('/tags.html?tag=' + $(this).attr('tag'));
                }).show();
            });
        },

        sortTag: function () {
            Tag.sort(function (a, b) {
                return b.size - a.size;
            });
        },

        initTags: function () {
            var tag = Init.getUrlParamValue('tag');
            if (tag == null || (tag = tag.trim()) == '') {
                return;
            }

            require.async('data', function () {
                var postArray = [];
                $.each(Post, function (i, p) {
                    var tagArray = p.tags.trim().split(' ');
                    if ($.inArray(tag, tagArray) >= 0) {
                        postArray.push(p);
                    }
                });
                Init.displayTag(tag, postArray.length);
                Init.displayPost(postArray);
            });
        },

        displayTag: function (tag, size) {
            $('#main').find('.wrapper').html($('<div class="list_tag"></div>').append($('<a href="/tag.html">标签</a>')).append($('<span class="dire"></span>').html('>>')).append($('<span class="tag"></span>').html(tag)));
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

        initArchive: function () {
            Init.loadData(function () {
                var monthPost = Init.sortPostByMonth();
                Init.displayPostByMonth(monthPost);
            });
        },

        sortPostByMonth: function () {
            var monthPost = {};
            $.each(Post, function (i, p) {
                var yearMonth = p.dateYMD.substring(0, 7);
                if (!monthPost[yearMonth]) {
                    monthPost[yearMonth] = [];
                }
                monthPost[yearMonth].push(p);
            });
            return monthPost;
        },

        displayPostByMonth: function (monthPost) {
            var i = 0;
            var $archive = $('.archive');
            $.each(monthPost, function (k, posts) {
                var $month = $('<div class="month"></div>');
                $month.append(
                    $('<div class="node">')
                        .append($('<div class="node_circle"></div>').append(
                            $('<img/>').attr('src', '/images/svg/landscape/' + LandScapeSvg[i++ % LandScapeSvg.length]))
                        )
                        .append($('<span class="node_title"></span>').html(Init.convertDate(k)))
                );
                var $dates = $('<div class="dates"></div>');
                $.each(posts, function (i, post) {
                    $dates.append(
                        $('<div class="date"></div>')
                            .append($('<span></span>').html(post.dateYMD.substring(5, 10)))
                            .append($('<a></a>').attr('href', post.url).html(post.title))
                    );
                });
                $month.append($dates);
                $archive.append($month);
            });
            $archive.append(
                $('<div class="month"></div>').append(
                    $('<div class="node">')
                        .append(
                            $('<div class="node_circle"></div>').append(
                                $('<img/>').attr('src', '/images/svg/landscape/' + LandScapeSvg[i++ % LandScapeSvg.length])
                            )
                        )
                )
            );
            $archive.show();
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
                return Math.random() - 0.5;
            });
        },

        switchInArray: function (array, i, j) {
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        },

        loadData: function (callback) {
            require.async('data', callback);
        },

        redirectUrl: function (url) {
            window.location.href = url;
        },

        convertDate: function (yyyy_mm) {
            return yyyy_mm.substring(2, 4) + '年' + Month[Init.parseToInt(yyyy_mm.substring(5, 7)) - 1] + '月';
        },

        parseToInt: function (mm) {
            if (mm.substring(0, 1) == '0') {
                return parseInt(mm.substring(1, 2));
            }
            return parseInt(mm.substring(0, 2));
        }
    };

    var Share = {
        shareToSina: function () {
            this.share(function (url, title, pic) {
                var shareUrl = 'http://v.t.sina.com.cn/share/share.php?url=' + url + '&title=' + title + '&pic=';
                window.open(shareUrl);
            });
        },

        shareToQQZone: function (url, title) {
            this.share(function (url, title, pic) {
                var shareUrl = 'http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url=' + url + '&summary=' + title + '&pics=' + pic;
                window.open(shareUrl);
            });
        },

        shareToWeixin: function () {

        },

        share: function (callback) {
            var url = window.location.href;
            var title = '【分享】' + document.title;
            var pic = 'http://www.txazo.com/images/share.jpg';
            callback(encodeURIComponent(url), encodeURIComponent(title), encodeURIComponent(pic));
        }
    };

    exports.init = Init.init;

});
