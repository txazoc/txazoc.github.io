define(function (require, exports, module) {

    var Color = ['color_red', 'color_yellow', 'color_olive', 'color_green', 'color_teal', 'color_blue', 'color_purple', 'color_pink'];

    var LandScapeSvg = ['beach.svg', 'castle.svg', 'cityscape.svg', 'fields.svg', 'forest.svg', 'hills.svg', 'iceberg.svg', 'mill.svg', 'river.svg', 'spruce.svg', 'trees.svg', 'waterfall.svg', 'windmills.svg'];

    var LastSearchInputTime = 0;

    var Init = {
        lastWindowWidth: 0,
        sourceDomain: '//github.txazo.com',
        indexSpeedDomain: '//www.txazo.com',
        mapReg: new RegExp(/^\/(map|topic|new|arch|person|index|summary|javaadvanced)\/[^\.#]+\.html/),
        dirReg: new RegExp(/^\/(map|new|arch|person|index|summary|javaadvanced)\/[^\.#]+\.html/),
        homeReg: new RegExp(/^\/(home|dict)\/[^\.#]+\.html/),
        homeListReg: new RegExp(/^\/(home|dict)\/[^\.#]*/),
        isWindows: false,

        init: function (sourceDomain, indexSpeedDomain) {
            Init.sourceDomain = sourceDomain;
            Init.indexSpeedDomain = indexSpeedDomain;

            // 字体
            Init.initFont();

            // 事件
            Init.initEvent();

            // 页面
            Init.initPage();

            // 目录
            Init.initDirectory();

            // 分页
            Init.initPagination();

            // 浏览器
            Init.initBrowser();

            // 代码高亮
            Init.initHighlight();
        },

        wrapSourceDomain: function (url) {
            return Init.wrapDomain(Init.sourceDomain, url);
        },

        wrapIndexSpeedDomain: function (url) {
            return Init.wrapDomain(Init.indexSpeedDomain, url);
        },

        wrapDomain: function (domain, url) {
            if (url == null || url.trim() == '') {
                return url;
            }
            if (url.indexOf('/') > -1) {
                return domain + url;
            }
            return domain + '/' + url;
        },

        initEvent: function () {
            Init.resize();

            $(window).resize(function () {
                Init.resize();
            });

            $('.article .item a').bind('click', function () {
                var that = this;
                require.async('md5', function () {
                    Init.redirectUrl(Init.wrapSourceDomain('/tags.html?' + md5($(that).html())));
                });
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

            $('#main').find('.article .md-primary a').each(function () {
                var href = $(this).attr('href');
                if (href != null && href.substr(0, 1) != '/' && href.substr(0, 1) != '#') {
                    $(this).attr('target', '_blank');
                }
            });
        },

        resize: function () {
            var windowWidth = $(document).width();
            if (windowWidth == Init.lastWindowWidth) {
                return;
            }

            Init.lastWindowWidth = windowWidth;

            var windowHeight = $(document).height();
            var headHeight = $('#header').innerHeight();
            var footHeight = $('#footer').show().innerHeight();
            var mainHeight = windowHeight - headHeight - footHeight;
            $('#main').css('minHeight', (mainHeight + 0.5) + 'px');
        },

        initHighlight: function () {
            var preCode = $('div > pre > code');
            if (preCode.length > 0) {
                preCode.each(function (i, e) {
                    if ($(this).parent().hasClass('highlight')
                        && ($(this).parent().parent().hasClass('highlighter-rouge')
                            || $(this).parent().parent().parent().hasClass('highlighter-rouge'))) {
                        var language = '';
                        var divClasses = [];
                        if ($(this).parent().parent().hasClass('highlighter-rouge')) {
                            divClasses = $(this).parent().parent().attr('class').trim().split(' ');
                        } else {
                            divClasses = $(this).parent().parent().parent().attr('class').trim().split(' ');
                        }
                        $.each(divClasses, function (i, v) {
                            if (v.substr(0, 9) == 'language-') {
                                language = v.substr(9, v.length);
                            }
                        });

                        if (language != '') {
                            var newPre = $('<pre></pre>').addClass('hljs-dark');
                            var newCode = $('<code></code>').addClass('language-' + language);
                            newPre.append(newCode.html($(this).html().replace(/<(?:.|\s)*?>/g, '')));
                            if ($(this).parent().parent().hasClass('highlighter-rouge')) {
                                $(this).parent().parent().after(newPre).remove();
                            } else {
                                $(this).parent().parent().parent().after(newPre).remove();
                            }
                        }
                    }
                });
            }

            var preCode = $('pre > code');
            if (preCode.length > 0) {
                preCode.each(function (i, e) {
                    var language = $(this).attr('class').trim().split('-')[0];
                    if (HighLight.match(language)) {
                        HighLight.highLight(language, e);
                    } else {
                        $(this).addClass('language-' + language);
                        hljs.highlightBlock(e);
                    }
                    if (Init.isWindows) {
                        $(this).css('font-family', '"SFMono-Regular",Consolas,"Liberation Mono",Menlo,Courier,monospace');
                    }
                    $(this).parent().addClass('hljs-dark').show();
                });
            }
        },

        initBrowser: function () {
            if (Init.isWeiXin() || this.isQQ()) {
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

            if (Init.isWeiXin()) {
                var $about = $('.about');
                if ($about.length > 0) {
                    var $email = $about.find('.email');
                    $email.parent().append($email.html());
                    $email.remove();
                }
            }
        },

        getUserAgent: function () {
            return window.navigator.userAgent.toLowerCase();
        },

        isWeiXin: function () {
            return this.getUserAgent().match(/MicroMessenger/i) == "micromessenger";
        },

        isUC: function () {
            return this.getUserAgent().indexOf('ucweb') > -1;
        },

        isQQBrowser: function () {
            return this.getUserAgent().indexOf('mqqbrowser') > -1;
        },

        isQQ: function () {
            return this.isQQBrowser() && this.getUserAgent().indexOf(' qq/') > -1;
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
                    p.addClass('hover').attr('href', Init.wrapIndexSpeedDomain(v == 1 ? '/' : '/index/' + v + '/'));
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
            var index;
            var pathName = window.location.pathname;
            var pageName = pathName;
            if ((index = pageName.lastIndexOf('/')) >= 0) {
                pageName = pageName.substring(index + 1, pageName.length);
            }
            if ((index = pageName.indexOf('.')) >= 0) {
                pageName = pageName.substring(0, index);
            }

            if (pageName == 'tag') {
                Init.initTag();
            } else if (pageName == 'tags') {
                Init.initTags();
            } else if (pageName == 'archive') {
                Init.initArchive();
            } else if (pageName == 'topics') {
                Init.initTopics();
            } else if (pathName.length > 6 && pathName.substr(0, 7) == '/topic/') {
                Init.initTopic(pathName);
            } else if (pathName.length > 5 && pathName.substr(0, 6) == '/home/') {
                Init.initHome(pathName, '/home/');
            } else if (pathName.length > 5 && pathName.substr(0, 6) == '/dict/') {
                Init.initHome(pathName, '/dict/');
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
                    var that = this;
                    require.async('md5', function () {
                        Init.redirectUrl(Init.wrapSourceDomain('/tags.html?' + md5($(that).attr('tag'))));
                    });
                }).show();
            });
        },

        sortTag: function () {
            Tag.sort(function (a, b) {
                return b.size - a.size;
            });
        },

        initTags: function () {
            var tag = Init.getUrlParams();
            if (tag == null || (tag = tag.trim()) == '') {
                Init.redirectUrl(Init.wrapSourceDomain('/404.html'));
                return;
            }

            var tagName = '';
            require.async(['data', 'md5'], function (d, m) {
                var postArray = [];
                $.each(Post, function (i, p) {
                    var tagArray = p.tags.trim().split(' ');
                    $.each(tagArray, function (j, v) {
                        if (tag == md5(v)) {
                            tagName = v;
                            postArray.push(p);
                            return false;
                        }
                    });
                });
                Init.displayTag(tagName, postArray.length);
                Init.displayPost(postArray);
            });
        },

        displayTag: function (tag, size) {
            $('#main').find('.wrapper').html($('<div class="list_tag"></div>').append($('<a href="' + Init.wrapIndexSpeedDomain('/tag.html') + '">标签</a>')).append($('<span class="dire"></span>').html('>>')).append($('<span class="tag"></span>').html(tag)));
        },

        displayPost: function (posts) {
            var listWrapper = $('<div class="list"><ul></ul></div>');
            var list = listWrapper.find('ul');
            $.each(posts, function (i, p) {
                list.append($('<li></li>')
                    .append($('<h3 class="list-title"></h3>').append($('<a></a>').attr('href', Init.wrapSourceDomain(p.url)).html(p.title)))
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
                            $('<img/>').attr('src', Init.wrapSourceDomain('/images/svg/landscape/' + LandScapeSvg[i++ % LandScapeSvg.length])))
                        )
                        .append($('<span class="node_title"></span>').html(Init.convertDate(k)))
                );
                var $dates = $('<div class="dates"></div>');
                $.each(posts, function (i, post) {
                    $dates.append(
                        $('<div class="date"></div>')
                            .append($('<span></span>').html(post.dateYMD.substring(5, 10)))
                            .append($('<a></a>').attr('href', Init.wrapSourceDomain(post.url)).html(post.title))
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
                                $('<img/>').attr('src', Init.wrapSourceDomain('/images/svg/landscape/' + LandScapeSvg[i++ % LandScapeSvg.length]))
                            )
                        )
                )
            );
            $archive.show();
        },

        getUrlParams: function () {
            return window.location.search.substr(1);
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
            return yyyy_mm.substring(0, 4) + '年' + Init.prefillZero(Init.parseToInt(yyyy_mm.substring(5, 7))) + '月';
        },

        parseToInt: function (mm) {
            if (mm.substring(0, 1) == '0') {
                return parseInt(mm.substring(1, 2));
            }
            return parseInt(mm.substring(0, 2));
        },

        prefillZero: function (i) {
            return i < 10 ? '0' + i : i;
        },

        initTopics: function () {
            require.async('input-css', function () {
                $('.topic-search .ui.input').show();
            });

            require.async('topic', function () {
                Init.buildTopic();

                $('.topic-search').delegate('input', 'input propertychange', function () {
                    var that = this;
                    LastSearchInputTime = new Date().getTime();
                    setTimeout(function () {
                        if (new Date().getTime() - LastSearchInputTime >= 800) {
                            var key = $(that).val();
                            if (key != '' && (key = key.trim()) != '') {
                                $(that).val(key);
                                var showList = false;
                                var keys = key.split(/\s+/);
                                $('.topics').find('.topic').each(function () {
                                    var module = $(this).find('.topic-header h3').html();
                                    if (Init.matchTopic(module, keys)) {
                                        $(this).find('.topic-list span').show();
                                        $(this).show();
                                        showList = true;
                                    } else {
                                        var show = false;
                                        $(this).find('.topic-list span').each(function () {
                                            var name = $(this).children(':first').html().toLowerCase();
                                            if (Init.matchTopic(name, keys)) {
                                                $(this).show();
                                                show = true;
                                                showList = true;
                                            } else {
                                                $(this).hide();
                                            }
                                        });
                                        if (show) {
                                            $(this).show();
                                        } else {
                                            $(this).hide();
                                        }
                                    }
                                });
                                if (showList) {
                                    $('.topic-tip').hide();
                                } else {
                                    $('.topic-tip').show();
                                }
                            } else {
                                $('.topics').find('.topic').each(function () {
                                    $(this).show().find('.topic-list span').show();
                                });
                            }
                        }
                    }, 800);
                });
            });
        },

        matchTopic: function (name, keys) {
            for (var i in keys) {
                if (name.toLowerCase().indexOf(keys[i].toLowerCase()) >= 0) {
                    return true;
                }
            }
            return false;
        },

        buildTopic: function () {
            var $topics = $('.topics');

            $.each(Topics, function (i) {
                var k = Topics[i];
                var v = TopicModule[k];
                if (v == null || v.length < 1) {
                    return;
                }

                var html = '<div class="topic">';
                html += '<div class="topic-header"><h3>' + k + '</h3></div>';
                html += '<div class="topic-list">';

                v.sort(function (v1, v2) {
                    if (v1.title == v1.module) {
                        return -1;
                    }
                    if (v2.title == v2.module) {
                        return 1;
                    }
                    return Init.sortStr(v1.title, v2.title);
                });

                $.each(v, function (j) {
                    var t = v[j];
                    html += '<span><a href="' + Init.wrapSourceDomain('/topic' + t.path) + '">' + t.title + '</a></span>';
                });
                html += '</div></div>';
                $topics.append(html);
            });
        },

        sortStr: function (s1, s2) {
            if (Init.isLetter(s1.charAt(0)) && !Init.isLetter(s2.charAt(0))) {
                return -1;
            }
            if (!Init.isLetter(s1.charAt(0)) && Init.isLetter(s2.charAt(0))) {
                return 1;
            }
            return s1.localeCompare(s2);
        },

        isLetter: function (str) {
            var reg = /[a-zA-Z]+/;
            return reg.test(str);
        },

        initTopic: function (pathName) {
            var path = pathName.substring(6, pathName.length);
            require.async('topic', function () {
                $.each(TopicModule, function (k, v) {
                    $.each(v, function (i) {
                        var t = v[i];
                        if (t['path'] == path) {
                            $('.topic-nav')
                                .append('<a href="' + Init.wrapIndexSpeedDomain('/topics.html') + '">专题</a>')
                                .append('<span class="dire">&gt;&gt;</span>')
                                .append('<span class="tag">' + t['module'] + '</span>')
                                .append('<span class="dire">&gt;&gt;</span>')
                                .append('<span class="tag">' + t['title'] + '</span>')
                                .css('visibility', 'visible');
                        }
                    });
                });
            });
        },

        initHome: function (pathName, module) {
            var path = pathName.substring(6, pathName.length);
            path = Init.stripSlash(path);
            var modules = path.split('/');
            var $homeNav = $('.home-nav');
            var basePath = Init.wrapIndexSpeedDomain(module);
            $homeNav.append('<a class="title" href="' + basePath + '">分类</a>');
            var length = path.indexOf('.html') > -1 ? modules.length - 1 : modules.length;
            if (length > 2) {
                $homeNav
                    .append('<span class="dire">&gt;&gt;</span>')
                    .append('<span class="tag">...</span>')
            }
            var start = length > 2 ? length - 2 : 0;
            var dirAliases = window.location.search.substring(1).split("%2C");
            for (var i = 0; i < length; i++) {
                basePath += modules[i] + '/';
                if (i >= start && modules[i] != '') {
                    $homeNav
                        .append('<span class="dire">&gt;&gt;</span>')
                        .append('<a class="sub-title" href="' + basePath + Init.buildAliasQueryString(dirAliases, i) + '"><span class="tag">' + decodeURI(dirAliases[i]) + '</span></a>');
                }
            }
            $homeNav.css('visibility', 'visible');
        },

        buildAliasQueryString: function (dirAliases, index) {
            var queryString = '';
            for (var i = 0; i < dirAliases.length; i++) {
                if (i <= index) {
                    if (i == 0) {
                        queryString += dirAliases[i];
                    } else {
                        queryString += '%2C' + dirAliases[i];
                    }
                }
            }

            if (queryString == '') {
                return queryString;
            }
            return '?' + queryString;
        },

        stripSlash: function (path) {
            if (path.substring(0, 1) == '/') {
                path = path.substring(1, path.length);
            }
            if (path.substring(path.length - 1, path.length) == '/') {
                path = path.substring(0, path.length - 1);
            }
            return path;
        },

        initFont: function () {
            var userAgent = navigator.userAgent.toLowerCase();
            if (userAgent.indexOf('windows') != -1) {
                Init.isWindows = true;
                $('body').css('font-family', '-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol"');
            }
        },

        initDirectory: function () {
            // 思维脑图页面
            if (Init.mapReg.test(window.location.pathname)) {
                var h4Array = [];
                var $article = $('.md-primary');
                $article.find('h1,h2,h3,h4,h5,h6').each(function () {
                    var title = $(this).html();
                    $(this).html('').append($('<a>').attr('id', title).html(title));
                    if ($(this)[0].tagName == 'H4') {
                        h4Array.push(title);
                    }
                });
                var $list = $('<ul>');
                console.log(window.location.pathname);
                if (Init.dirReg.test(window.location.pathname)) {
                    $list.append($('<li>').append($('<a>').html('返回上级').attr('href', window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/')) + '/')));
                }
                if (h4Array.length > 0) {
                    $.each(h4Array, function (i) {
                        $list.append($('<li>').append($('<a>').html(h4Array[i]).attr('href', '#' + h4Array[i])));
                    });
                }
                $article.prepend($list);
                $article.prepend($('<h4>').append($('<strong>').append($('<em>').html('目录'))));
            }

            // Home
            if (Init.homeReg.test(window.location.pathname)) {
                var h4Array = [];
                var levelArray = [];
                var headArray = [];
                var maxLevel = 7;
                var $article = $('.md-primary');
                $article.find('h1,h2,h3,h4,h5,h6').each(function () {
                    var title = $(this).html();
                    $(this).html('').append($('<a>').attr('id', 'header-' + title).html(title));
                    h4Array.push(title);
                    var level = parseInt($(this)[0].tagName.substr(1, 1));
                    maxLevel = Math.min(level, maxLevel);
                    levelArray.push(level);
                    headArray.push($(this));
                });

                maxLevel = levelArray[0];

                if (h4Array.length <= 0) {
                    return;
                }

                var listStack = [];
                var lastLevelOneLi;
                var $list = $('<ul>');

//                $list.append($('<li>').append($('<a>').html('返回上级')
//                    .attr('href', $('.home-nav .sub-title').last().attr('href'))
//                    .attr('style', 'font-weight: bold;')
//                ));

                var levelOneIndex = 0;
                var levelTwoIndex = 0;
                for (var i = 0; i < h4Array.length; i++) {
                    if (levelArray[i] <= maxLevel) {
                        while (listStack.length > 0) {
                            listStack.pop();
                        }
                        levelTwoIndex = 0;
                        lastLevelOneLi = $('<li>');
                        lastLevelOneLi.append($('<a>').html(++levelOneIndex + '、' + h4Array[i]).attr('href', '#header-' + h4Array[i])
                            .attr('style', 'font-weight: bold;'));
                        headArray[i].find('a').html(levelOneIndex + '、' + headArray[i].find('a').html());
                        $list.append(lastLevelOneLi);
                    } else {
                        if (listStack.length == 0) {
                            listStack.push($('<ul>'));
                            lastLevelOneLi.append(listStack[0]);
                        }
                        listStack[0].append($('<li>').append($('<a>')
                            .html(levelOneIndex + '.' + ++levelTwoIndex + '、' + h4Array[i])
                            .attr('href', '#header-' + h4Array[i])
                            .attr('style', 'font-size: 12px;')
                        ));
                        headArray[i].html(levelOneIndex + '.' + levelTwoIndex + '、' + headArray[i].html());
                    }
                }
                $article.prepend($list);
                $article.prepend($('<h4>').append($('<strong>').append($('<em>').html('目录'))));
            }

            if (Init.homeListReg.test(window.location.pathname)) {
                $('.article').find('ul li a').each(function () {
                    var $this = $(this);
                    if ($this.html().indexOf('/') > -1) {
                        $this.addClass('home-list-a-dir');
                    } else {
                        $this.addClass('home-list-a-file');
                    }
                });
            }
        }
    };

    var Share = {
        shareToSina: function () {
            this.share(function (url, title, pic) {
                var shareUrl = 'http://service.weibo.com/share/share.php?url=' + url + '&title=' + title + '&pic=';
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
            var pic = Init.wrapSourceDomain('/images/share.jpg');
            callback(encodeURIComponent(url), encodeURIComponent(title), encodeURIComponent(pic));
        }
    };

    var HighLight = {
        languages: ['linux'],
        quoteRegex: new RegExp('^\'[^\']*\'$'),
        doubleQuoteRegex: new RegExp('^"[^"]*"$'),
        match: function (language) {
            return $.inArray(language, HighLight.languages) >= 0;
        },

        highLight: function (language, target) {
            HighLight[language](target);
        },

        linux: function (target) {
            var $target = $(target);
            var content = $target.html();
            var lines = content.split('\n');
            if (lines != null && lines.length > 0) {
                var newContent = '';
                $.each(lines, function (i, line) {
                        line = line.trim();
                        if (line == null || line == '') {
                            newContent += line;
                        } else {
                            var dollar = 0;
                            var pipe = 0;
                            var words = line.split(' ');
                            $.each(words, function (j, word) {
                                    if (j == 0) {
                                        if (word == "$") {
                                            dollar = 1;
                                            newContent += HighLight.wrapSpan('$', 'prompt');
                                        } else {
                                            dollar = 0;
                                            newContent += HighLight.wrapSpan('$', 'prompt');
                                            newContent += ' ';
                                            newContent += HighLight.wrapSpan(word, 'keyword');
                                        }
                                    } else if (j == 1 && dollar == 1) {
                                        newContent += HighLight.wrapSpan(word, 'keyword');
                                    } else if (pipe == 1) {
                                        pipe = 0;
                                        newContent += HighLight.wrapSpan(word, 'keyword');
                                    } else if (word == '|') {
                                        pipe = 1;
                                        newContent += HighLight.wrapSpan(word, 'pipe');
                                    } else if (word.charAt(0) == '-') {
                                        newContent += HighLight.wrapSpan(word, 'option');
                                    } else if (HighLight.quoteRegex.test(word) || HighLight.doubleQuoteRegex.test(word)) {
                                        newContent += HighLight.wrapSpan(word, 'string');
                                    } else {
                                        newContent += HighLight.wrapSpan(word, 'param');
                                    }
                                    if (j != words.length - 1) {
                                        newContent += ' ';
                                    }
                                }
                            );
                        }
                        if (i != lines.length - 1) {
                            newContent += '\n';
                        }
                    }
                );
                $target.html(newContent);
            }
        },

        wrapSpan: function (text, classStyle) {
            return '<span class="hljs-' + classStyle + '">' + text + '</span>';
        }
    };

    exports.init = Init.init;

});
