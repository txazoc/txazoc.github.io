#!/bin/bash

python script/topic.py
python script/topic-copy.py

open -g http://127.0.0.1:4000/

jekyll serve
