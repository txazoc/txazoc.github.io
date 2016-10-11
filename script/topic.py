# -*- coding: utf-8 -*-

import os
import json

topicMap = {}
rootDir = os.getcwd() + '/topic'

class Topic:
    def __init__(self, path, title, module):
        self.path = path
        self.title = title
        self.module = module

def buildTopicList(relativePath):
    fullPath = rootDir + '/' + relativePath
    childs = os.listdir(fullPath)
    for child in childs:
        childRelativePath = relativePath + '/' + child
        childFullPath = rootDir + '/' + childRelativePath
        if os.path.isdir(childFullPath):
            buildTopicList(childRelativePath)
        else:
            topic = readTopic(childFullPath)
            fileName = child.replace('.md', '')
            topicMap[fileName] = Topic(relativePath + '/' + fileName + '.html', topic['title'],
                                       topic['module']).__dict__

def readTopic(file):
    topic = {}
    f = open(file)
    for i in range(1, 6):
        line = f.readline().strip('\n')
        if line.find(':') > -1:
            pair = line.split(':', 1)
            topic[pair[0].strip()] = pair[1].strip()
    f.close()
    return topic

def writeFile(file, mode, content):
    f = open(file, mode)
    f.write(content)
    f.close()

def main():
    print '[python] build topic list begin.'

    topicJs = os.getcwd() + '/js/topic.js'
    buildTopicList('')
    for (k, v) in topicMap.items():
        print v

    writeFile(topicJs, 'w', 'var TopicList = ')
    json.dump(topicMap, open(topicJs, 'a'))
    writeFile(topicJs, 'a', ';')

    print '[python] build topic list success.'

main()
