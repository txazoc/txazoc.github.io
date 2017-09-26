#!/usr/bin/python2
# -*- coding:utf-8 -*-

import os
import time

rootPath = '/source'
rootDir = os.getcwd() + rootPath

class SourceItem:
    def __init__(self, name, isFile):
        self.name = name
        self.isFile = isFile

def buildSourceModule(relativePath):
    childNames = []
    fullPath = rootDir + '/' + relativePath
    childs = os.listdir(fullPath)
    for child in childs:
        childRelativePath = relativePath + '/' + child
        childFullPath = rootDir + '/' + childRelativePath
        if os.path.isdir(childFullPath):
            childNames.append(SourceItem(child, False).__dict__)
            buildSourceModule(childRelativePath)
        else:
            if child.endswith('.md') and child != 'index.md':
                childNames.append(SourceItem(child.replace('.md', ''), True).__dict__)

    if len(childNames) > 0:
        generateIndex(fullPath, relativePath, childNames)

def generateIndex(path, relativePath, childNames):
    headers = []
    indexFile = path + '/index.md'
    if os.path.exists(indexFile):
        header = 0
        for line in open(indexFile, 'r'):
            line = line.strip()
            if line == '---':
                header += 1
                headers.append(line)
            elif header >= 2:
                break
            else:
                headers.append(line)
    else:
        headers.append('---')
        headers.append('layout: source')
        headers.append('title: ' + generateTitle(rootPath + relativePath))
        headers.append('date: ' + time.strftime('%Y-%m-%d'))
        headers.append('---')

        index = 0
        header = 0
    f = open(indexFile, 'w')
    for line in headers:
        writeLine(f, line)
    writeLine(f, '')
    for item in childNames:
        writeLine(f, '* [' + item['name'] + '](' + rootPath + relativePath + '/' + item['name'] + (
            '.html' if item['isFile'] else '/') + ')')
    f.close()

def generateTitle(path):
    if path.find('/') > -1:
        return path.split('/')[-1]
    return path

def writeLine(f, line):
    f.write(line + '\n')

def main():
    print '--------------------------------------------------'
    print '[python] build source module begin.'

    buildSourceModule('')

    print '[python] build source module success.'
    print '--------------------------------------------------'

main()
