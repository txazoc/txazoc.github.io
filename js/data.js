---
# data.js
---

var Tag = [];
{% for tag in site.tags %}Tag.push({"name":"{{ tag[0] }}","size":"{{ tag[1].size }}"});
{% endfor %}
var Post = [{% for post in site.posts %}{"id":"{{ post.id }}","title":"{{ post.title }}","date":"{{ post.date | date: "%Y年%m月%d日" }}","tags":"{% for tag in post.tags %}{{ tag }} {% endfor %}","categories":"{{ post.categories[0] }}","url":"{{ post.url }}","content":"{{ post.content | strip_html | strip_newlines | truncate: 150 }}"}{% if post.previous != nil %},{% endif %}{% endfor %}];
