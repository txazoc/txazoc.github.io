#!/bin/bash

python script/topic.py

git add .
git cm 'update'
git push origin master

echo 'sleep 5s waiting github pages to build ...'
sleep 5

python script/cdn-refresh.py
