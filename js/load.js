seajs.config({
    base: '/js',
    alias: {
        'init': 'init.js',
        'highlight': '/js/lib/highlight.js'
    }
});

seajs.use('init', function (init) {
    init.init();
});
