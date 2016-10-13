#!/bin/bash

python script/topic.py

git add .
git cm 'update'
git push origin master

echo '--------------------------------------------------'
echo 'sleep 5s waiting github pages to build ...'

sleep 5

echo '[python] cdn refresh begin.'

python script/cdn-refresh.py

echo '[python] cdn refresh end.'
echo '--------------------------------------------------'
