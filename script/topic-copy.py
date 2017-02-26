# -*- coding: utf-8 -*-

import os
import shutil

keyLength = len('categories: ')
rootPath = os.getcwd()
publishPath = rootPath + '/_posts/publish/'
config = rootPath + '/script/topic-copy.conf'

def initPath(path):
    if os.path.isdir(path):
        shutil.rmtree(path)
    os.mkdir(path)

def getFileName(file):
    if file.find('/') > -1:
        return file.split('/')[-1]
    return ''

def copyPublishTopic():
    for line in open(config):
        print '    ' + line
        rewriteTopicHeader(rootPath + line, publishPath, getFileName(line))

def fillBlank(str, length):
    if len(str) >= length:
        return str
    for i in range(0, length - len(str)):
        str += ' '
    return str

def writeLine(f, line):
    f.write(line + '\n')

def writeHeader(f, key, value):
    f.write(fillBlank(key + ':', keyLength) + value + '\n')

def rewriteTopicHeader(src, destPath, destFileName):
    index = 0
    header = False
    date = ''
    f = open(destPath + destFileName, 'w')
    for line in open(src, 'r'):
        line = line.strip()
        if index <= 10:
            if line == '---':
                header = not header
                writeLine(f, line)
            elif header:
                if line.find(':') > -1:
                    pair = line.split(':', 1)
                    key = pair[0].strip()
                    value = pair[1].strip()
                    if key == 'date':
                        date = pair[1].strip()
                        writeHeader(f, key, value)
                    elif key == 'layout':
                        writeHeader(f, 'layout', 'article')
                        writeHeader(f, 'categories', '[publish]')
                    else:
                        writeHeader(f, key, value)
            else:
                writeLine(f, line)
        else:
            writeLine(f, line)
        index += 1
    f.close()
    os.rename(destPath + destFileName, destPath + date + '-' + destFileName)

def main():
    print '--------------------------------------------------'
    print '[python] copy topic to publish begin.'
    initPath(publishPath)
    copyPublishTopic()
    print '[python] copy topic to publish begin success.'
    print '--------------------------------------------------'

main()
