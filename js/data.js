//---
//# data.js
//---
//
//var Tag = new Map();
//{% for tag in site.tags %}
//    var tagInfo = {};
//    tagInfo.size = {{ tag[1].size }};
//    {% for post in tag[1] %}
//        var info = {};
//        info.title = '{{ post.title }}'';
//    {% endfor %}
//    Tag.put('{{ tag[0] }}', tagInfo);
//{% endfor %}