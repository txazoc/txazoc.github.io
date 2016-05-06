seajs.config({
    base: '/js',
    alias: {
        'init': 'init.js?v=2016050608',
        'data': 'data.js?v=20160505',
        'highlight': '/js/lib/highlight.js'
    }
});

seajs.use('init', function (init) {
    init.init();
});
