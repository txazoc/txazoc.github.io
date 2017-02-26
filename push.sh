#!/bin/bash

python script/topic.py
python script/topic-copy.py

git add .
git cm 'update'
git push origin master

echo '--------------------------------------------------'
echo 'sleep 5s waiting github pages to build ...'

sleep 5

echo '[CDN Refresh] begin --------------------------------------------------'

python script/cdn-refresh.py

echo '[CDN Refresh] end --------------------------------------------------'
