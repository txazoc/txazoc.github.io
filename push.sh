#!/bin/bash

python script/topic.py

git add .
git cm 'update'
git push origin master

echo 'sleep 1'
sleep 3
echo 'sleep 3'

python cdn-refresh.py
