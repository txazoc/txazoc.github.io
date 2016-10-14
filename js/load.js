---
# load.js
---
{% if site.localDebug == 'true' %}
seajs.config({
    base: '/js',
    alias: {
        'init': '{{ '/js/init.js' | prepend: site.localDomain }}',
        'data': '{{ '/js/data.js' | prepend: site.localDomain }}',
        'topic': '{{ '/js/topic.js' | prepend: site.localDomain }}',
        'input-css': '{{ '/css/input.min.css' | prepend: site.localDomain }}'
    }
});
{% else %}
seajs.config({
    base: '/js',
    alias: {
        'init': '{{ '/js/init.js' | prepend: site.staticSpeedDomain }}',
        'data': '{{ '/js/data.js' | prepend: site.staticSpeedDomain }}',
        'topic': '{{ '/js/topic.js' | prepend: site.staticSpeedDomain }}',
        'input-css': '{{ '/css/input.min.css' | prepend: site.staticSpeedDomain }}'
    }
});
{% endif %}
seajs.use('init', function (init) {
    init.init('{% if site.localDebug == 'true' %}{{ site.localDomain }}{% else %}{{ site.sourceDomain }}{% endif %}');
});
