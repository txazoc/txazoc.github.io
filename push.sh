#!/bin/bash

python script/config_replace.py
python script/topic.py
python script/topic-copy.py
python script/compress.py

git add .
git cm 'auto commit'
git push origin master

echo '--------------------------------------------------'
echo 'sleep 5s waiting github pages to build ...'

sleep 5

echo '[CDN Refresh] begin --------------------------------------------------'

python script/cdn-refresh.py

echo '[CDN Refresh] end --------------------------------------------------'
