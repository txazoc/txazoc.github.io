seajs.config({
    base: '/js',
    alias: {
        'init': 'init.js',
        'data': 'data.js',
        'topic': 'topic.js',
        'input-css': '../css/input.min.css'
    }
});

seajs.use('init', function (init) {
    init.init();
});
