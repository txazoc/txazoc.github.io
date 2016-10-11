seajs.config({
    base: '/js',
    alias: {
        'init': 'init.js',
        'data': 'data.js',
        'topic': 'topic.js'
    }
});

seajs.use('init', function (init) {
    init.init();
});
