#!/bin/bash

python script/config_replace.py true
python script/topic.py
python script/topic-copy.py
python script/js-compress.py

open -g http://127.0.0.1:4000/

jekyll serve
