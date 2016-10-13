---
# load.js
---

seajs.config({
    base: '/js',
    alias: {
        'init': 'http://image.txazo.com/js/init.js',
        'data': 'http://image.txazo.com/js/data.js',
        'topic': 'http://image.txazo.com/js/topic.js',
        'input-css': 'http://image.txazo.com/css/input.min.css'
    }
});

seajs.use('init', function (init) {
    init.init();
});
