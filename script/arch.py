#!/usr/bin/python2
# -*- coding:utf-8 -*-

import os

rootPath = '/arch'
rootDir = os.getcwd() + rootPath

def buildArchModule():
    childFileNames = []
    childs = os.listdir(rootDir)
    for child in childs:
        childFullPath = rootDir + '/' + child
        if os.path.isfile(childFullPath):
            if child.endswith('.md') and child != 'index.md':
                childFileNames.append(child.replace('.md', ''))

    generateIndex(childFileNames)

def generateIndex(childFileNames):
    headers = ['---', 'layout: arch', 'title: 从0开始学架构', '---']
    indexFile = rootDir + '/index.md'
    f = open(indexFile, 'w')
    for line in headers:
        writeLine(f, line)
    writeLine(f, '')
    for name in childFileNames:
        writeLine(f, '* [' + name + '](' + rootPath + '/' + name + '.html)')
    f.close()

def writeLine(f, line):
    f.write(line + '\n')

def main():
    print '--------------------------------------------------'
    print '[python] build arch module begin.'

    buildArchModule()

    print '[python] build arch module success.'
    print '--------------------------------------------------'

main()
