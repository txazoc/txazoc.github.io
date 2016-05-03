seajs.config({
    base: '/js',
    alias: {
        'init': 'init.js?v=20160503',
        'data': 'data.js',
        'highlight': '/js/lib/highlight.js'
    }
});

seajs.use('init', function (init) {
    init.init();
});
