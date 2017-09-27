#!/usr/bin/python2
# -*- coding:utf-8 -*-

import os
import time

rootPath = '/home'
rootDir = os.getcwd() + rootPath

def buildHomeModule(relativePath):
    childDirNames = []
    childFileNames = []
    fullPath = rootDir + '/' + relativePath
    childs = os.listdir(fullPath)
    for child in childs:
        childRelativePath = relativePath + '/' + child
        childFullPath = rootDir + '/' + childRelativePath
        if os.path.isdir(childFullPath):
            childDirNames.append(child)
            buildHomeModule(childRelativePath)
        else:
            if child.endswith('.md') and child != 'index.md':
                childFileNames.append(child.replace('.md', ''))

    if len(childDirNames) + len(childFileNames) > 0:
        generateIndex(fullPath, relativePath, childDirNames, childFileNames)

def generateIndex(path, relativePath, childDirNames, childFileNames):
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
        headers.append('layout: home')
        headers.append('title: ' + generateTitle(rootPath + relativePath))
        headers.append('date: ' + time.strftime('%Y-%m-%d'))
        headers.append('---')

        index = 0
        header = 0
    f = open(indexFile, 'w')
    for line in headers:
        writeLine(f, line)
    writeLine(f, '')
    for name in childDirNames:
        writeLine(f, '* [' + name + '/](' + rootPath + relativePath + '/' + name + '/)')
    for name in childFileNames:
        writeLine(f, '* [' + name + '](' + rootPath + relativePath + '/' + name + '.html)')
    f.close()

def generateTitle(path):
    if path.find('/') > -1:
        return path.split('/')[-1]
    return path

def writeLine(f, line):
    f.write(line + '\n')

def main():
    print '--------------------------------------------------'
    print '[python] build home module begin.'

    buildHomeModule('')

    print '[python] build home module success.'
    print '--------------------------------------------------'

main()
