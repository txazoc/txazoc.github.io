# -*- coding: utf-8 -*-

import os
import sys

compressed = 'true'
rootPath = os.getcwd()
fileDict = {
    '/_includes_source': '/_includes',
    '/_layouts_source': '/_layouts',
    '/js/init.js': '/js/init.min.js',
    '/js/load.js': '/js/load.min.js',
    '/html': '/'
}

def addPathAndFileName(path, fileName):
    if path.endswith('/'):
        return path + fileName
    return path + '/' + fileName;

def isFileJS(fileName):
    if fileName.find('.') > -1:
        strs = fileName.split('.')
        return strs[len(strs) - 1] == 'js'
    return False

def copyFileToFile(sourceFile, destFile):
    print '[copy] ' + sourceFile + ' to ' + destFile
    f = open(rootPath + destFile, 'w')
    for line in open(rootPath + sourceFile, 'r'):
        f.write(line)
    f.close()

def compressFileToFile(sourceFile, destFile):
    print '[compress] ' + sourceFile + ' to ' + destFile
    index = 0
    header = False
    sourcePath = rootPath + sourceFile
    isJS = isFileJS(sourcePath)
    f = open(rootPath + destFile, 'w')
    for line in open(sourcePath, 'r'):
        line = line.strip()
        if index <= 10:
            if line == '---':
                header = not header
                f.write(line + '\n')
            elif header:
                f.write(line + '\n')
            else:
                f.write(line)
        elif line.startswith('//'):
            if not isJS:
                f.write(line)
        else:
            f.write(line)
        index += 1
    f.close()

def compress(sourceFile, destFile):
    sourcePath = rootPath + sourceFile
    destPath = rootPath + destFile
    if os.path.isdir(sourcePath) and os.path.isdir(destPath):
        childs = os.listdir(sourcePath)
        for child in childs:
            compress(addPathAndFileName(sourceFile, child), addPathAndFileName(destFile, child))
    elif os.path.isfile(sourcePath) and (os.path.isfile(destPath) or not os.path.exists(destPath)):
        if compressed == 'false':
            copyFileToFile(sourceFile, destFile)
        else:
            compressFileToFile(sourceFile, destFile)
    else:
        print '[compress] ' + sourceFile + ' and ' + destFile + ' is not the same type'

def main():
    print '--------------------------------------------------'
    print '[python] compress begin.'
    for k in fileDict.keys():
        compress(k, fileDict[k])
    print '[python] compress success.'
    print '--------------------------------------------------'

if __name__ == '__main__':
    if len(sys.argv) > 1 and sys.argv[1] == 'false':
        compressed = 'false'
    main()
