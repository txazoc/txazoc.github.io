#!/bin/bash

python2 script/config_replace.py
python2 script/topic.py
python2 script/topic-copy.py
python2 script/compress.py

git add .
git cm 'auto commit'
git push origin master

echo '--------------------------------------------------'
echo 'sleep 5s waiting github pages to build ...'

sleep 5

echo '[CDN Refresh] begin --------------------------------------------------'

python script/cdn-refresh.py

echo '[CDN Refresh] end --------------------------------------------------'
