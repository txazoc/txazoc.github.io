#!/usr/bin/python2
# -*- coding:utf-8 -*-

import os

rootPath = '/new'
rootDir = os.getcwd() + rootPath

def buildNewModule():
    childFileNames = []
    childs = os.listdir(rootDir)
    for child in childs:
        childFullPath = rootDir + '/' + child
        if os.path.isfile(childFullPath):
            if child.endswith('.md') and child != 'index.md':
                childFileNames.append(child.replace('.md', ''))

    generateIndex(childFileNames)

def generateIndex(childFileNames):
    headers = ['---', 'layout: new', 'title: 目录', '---']
    indexFile = rootDir + '/index.md'
    f = open(indexFile, 'w')
    for line in headers:
        writeLine(f, line)
    writeLine(f, '')
    for name in childFileNames:
        writeLine(f, '* [' + name[0:10] + ' ' + name[11:] + '](' + rootPath + '/' + name + '.html)')
    f.close()

def writeLine(f, line):
    f.write(line + '\n')

def main():
    print '--------------------------------------------------'
    print '[python] build new module begin.'

    buildNewModule()

    print '[python] build new module success.'
    print '--------------------------------------------------'

main()
