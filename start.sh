#!/bin/bash

python2 script/config_replace.py true
python2 script/topic.py
python2 script/topic-copy.py
python2 script/compress.py
python2 script/index404.py
python2 script/home.py
python2 script/new.py

open -g http://127.0.0.1:4000/new

bundle exec jekyll serve
