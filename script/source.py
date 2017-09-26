#!/usr/bin/python2
# -*- coding:utf-8 -*-

import os

rootDir = os.getcwd() + '/source'

def buildSourceModule(relativePath):
    childNames = []
    fullPath = rootDir + '/' + relativePath
    childs = os.listdir(fullPath)
    for child in childs:
        if child.endswith('.md'):
            childNames.append(child.replace('.md', ''))
        childRelativePath = relativePath + '/' + child
        childFullPath = rootDir + '/' + childRelativePath
        if os.path.isdir(childFullPath):
            buildTopicModule(childRelativePath)
    if len(childNames) > 0:
        generateIndex(fullPath, childNames)

def generateIndex(path, childNames):
    headers = []
    indexFile = path + '/index.md'
    if os.path.exists(indexFile):
        header = 0
        for line in open(indexFile, 'r'):
            if line == '---':
                header += 1
                headers.append(line)
            elif header >= 2:
                break
    else:
        headers.append('---')
        headers.append('---')

        index = 0
        header = 0
    f = open(indexFile, 'w')
    for line in headers:
        writeLine(f, line)
    writeLine(f, '\n')
    for line in childNames:
        writeLine(f, line)
    f.close()

def writeLine(f, line):
    f.write(line + '\n')

def main():
    print '--------------------------------------------------'
    print '[python] build source module begin.'

    buildSourceModule('')

    print '[python] build source module success.'
    print '--------------------------------------------------'

main()
