#!/usr/bin/python2
# -*- coding:utf-8 -*-

import os

def buildArchModule(moduleName, title):
    print '--------------------------------------------------'
    print '[python] build ' + moduleName + ' module begin.'
    childFileNames = []
    rootDir = os.getcwd() + '/' + moduleName
    childs = os.listdir(rootDir)
    for child in childs:
        childFullPath = rootDir + '/' + child
        if os.path.isfile(childFullPath):
            if child.endswith('.md') and child != 'index.md':
                childFileNames.append(child.replace('.md', ''))

    generateIndex(moduleName, rootDir, title, childFileNames)
    print '[python] build ' + moduleName + ' module success.'
    print '--------------------------------------------------'

def generateIndex(moduleName, rootDir, title, childFileNames):
    headers = ['---', 'layout: ' + moduleName, 'title: ' + title, '---']
    indexFile = rootDir + '/index.md'
    f = open(indexFile, 'w')
    for line in headers:
        writeLine(f, line)
    writeLine(f, '')
    for name in childFileNames:
        writeLine(f, '* [' + name + '](/' + moduleName + '/' + name + '.html)')
    f.close()

def writeLine(f, line):
    f.write(line + '\n')

def main():
    # buildArchModule('/arch', '从0开始学架构')
    # buildArchModule('person', '个人')
    buildArchModule('index', 'Index')

main()
