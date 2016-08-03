seajs.config({
    base: '/js',
    alias: {
        'init': 'init.js?v=20160507',
        'data': 'data.js?v=20160507'
    }
});

seajs.use('init', function (init) {
    init.init();
});
