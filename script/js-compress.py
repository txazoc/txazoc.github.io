# -*- coding: utf-8 -*-

import os

rootPath = os.getcwd()
jsPath = '/js/'
jsList = ['init.js']

def generateCompressFileName(fileName):
    if fileName.find('.') > -1:
        return fileName.split('.')[0] + '.min.' + fileName.split('.')[1]
    return fileName

def compressJS(fileName):
    print '[compress] ' + jsPath + fileName
    f = open(rootPath + jsPath + generateCompressFileName(fileName), 'w')
    for line in open(rootPath + jsPath + fileName, 'r'):
        line = line.strip()
        if not line.startswith('//'):
            f.write(line)
    f.close()

def main():
    print '--------------------------------------------------'
    print '[python] compress js begin.'
    for js in jsList:
        compressJS(js)
    print '[python] compress js success.'
    print '--------------------------------------------------'

main()
