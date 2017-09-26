#!/bin/bash

python2 script/config_replace.py
python2 script/topic.py
python2 script/topic-copy.py
python2 script/compress.py
python2 script/index404.py
python2 script/source.py

git add .
git cm 'auto commit'
git push origin master
