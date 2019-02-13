#!/usr/bin/python2
# -*- coding:utf-8 -*-

import os
import shutil

rootPath = os.getcwd()

def index404():
    # shutil.copy(rootPath + '/404.html', rootPath + '/index.html')
    shutil.copy(rootPath + '/index_bak.html', rootPath + '/index.html')

def main():
    print '--------------------------------------------------'
    print '[python] index404 begin.'
    index404()
    print '[python] index404 success.'
    print '--------------------------------------------------'

if __name__ == '__main__':
    main()
