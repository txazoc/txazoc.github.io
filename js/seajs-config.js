seajs.config({
    base: '/js',
    preload: ['jquery'],
    alias: {
        'jquery': 'jquery-1.12.1.min.js',
        'bootstrap': 'bootstrap-3.3.6.min.js',
        'init': 'init.js'
    }
});

seajs.use('jquery', 'bootstrap', 'init', function (jquery, bootstrap, init) {
    init.init();
});
