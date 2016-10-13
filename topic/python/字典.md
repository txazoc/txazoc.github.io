---
layout: topic
module: Python
title: 字典
---

#### 字典转json

```python
import json

dict = {'name': 'root', 'age': '24'}
json.dump(dict, open('data.json', 'w'))
```
