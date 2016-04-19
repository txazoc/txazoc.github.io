---
# config.js
---

var Post = [
    {% for post in site.posts %}
        {
            'title': '{{ post.title }}',
            'date': '{{ post.date | date: "%Y-%m-%d %H:%M:%S" }}',
            'tags': '{{ post.tags }}',
            'categories': '{{ post.categories }}',
            'url': '{{ post.url }}',
            'content': '{{ post.content | strip_html | strip_newlines | truncate: 150 }}'
        },
    {% endfor %}
];
