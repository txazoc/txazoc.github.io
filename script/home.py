#!/usr/bin/python2
# -*- coding:utf-8 -*-

import os
import time
import urllib

rootPath = '/home'
rootDir = os.getcwd() + rootPath

class Item:
    def __init__(self, name, title):
        self.name = name
        self.title = title

def buildHomeModule(relativePath, childDirAliases):
    childDirNames = []
    childFileNames = []
    childTitle = {}
    fullPath = rootDir + '/' + relativePath
    childs = os.listdir(fullPath)
    for child in childs:
        dirAliases = childDirAliases[:]
        childRelativePath = relativePath + '/' + child
        childFullPath = rootDir + '/' + childRelativePath
        if os.path.isdir(childFullPath):
            childDirNames.append(child)
            title = readItemTitle(fullPath, child + '/index.md')
            dirAliases.append(title)
            buildHomeModule(childRelativePath, dirAliases)
            childTitle[child] = title
        else:
            if child.endswith('.md') and child != 'index.md':
                childFileNames.append(child.replace('.md', ''))
                childTitle[child.replace('.md', '')] = readItemTitle(fullPath, child)

    generateIndex(fullPath, relativePath, childDirNames, childFileNames, childTitle, childDirAliases)

def readItemTitle(path, file):
    header = 0
    for line in open(path + '/' + file, 'r'):
        line = line.strip()
        if line == '---':
            header += 1
        elif header >= 2:
            break
        else:
            if line.find(':') > -1:
                pair = line.split(':', 1)
                key = pair[0].strip()
                value = pair[1].strip()
                if key == 'title':
                    return pair[1].strip()

def generateIndex(path, relativePath, childDirNames, childFileNames, childTitle, childDirAliases):
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
        headers.append('layout: homelist')
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
        writeLine(f, '* [' + childTitle[name] + '/](' + rootPath + relativePath + '/' + name + '/' + joinDirAliases(childDirAliases, childTitle[name]) + ')')
    for name in childFileNames:
        writeLine(f, '* [' + childTitle[name] + '](' + rootPath + relativePath + '/' + name + '.html' + joinDirAliases(childDirAliases, '') + ')')
    f.close()

def joinDirAliases(dirAliases, dirName):
    result = ''
    if len(dirAliases):
        for alias in dirAliases:
            if result == '':
                result += alias
            else:
                result += (',' + alias)

    if (result == '' and dirName == ''):
        return ''
    elif (result == '' and dirName != ''):
        return '?' + urllib.quote(dirName)
    elif (result != '' and dirName == ''):
        return '?' + urllib.quote(result)
    return '?' + urllib.quote(result + ',' + dirName)

def generateTitle(path):
    if path.find('/') > -1:
        return path.split('/')[-1]
    return path

def writeLine(f, line):
    f.write(line + '\n')

def main():
    print '--------------------------------------------------'
    print '[python] build home module begin.'

    buildHomeModule('', [])

    print '[python] build home module success.'
    print '--------------------------------------------------'

main()
