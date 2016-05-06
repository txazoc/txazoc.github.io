seajs.config({
    base: '/js',
    alias: {
        'init': 'init.js?v=20160507',
        'data': 'data.js?v=20160507',
        'highlight': '/js/lib/highlight.js'
    }
});

seajs.use('init', function (init) {
    init.init();
});
