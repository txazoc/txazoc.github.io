# -*- coding: utf-8 -*-

import os
import json

class Topic:
    def __init__(self, fileName, relativePath, title, module):
        self.fileName = fileName
        self.relativePath = relativePath
        self.title = title
        self.module = module

topicMap = {}
rootDir = os.getcwd() + '/topic'

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
            topicMap[fileName] = Topic(fileName, relativePath, topic['title'], topic['module']).__dict__

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

topicJs = os.getcwd() + '/js/topic.js'

buildTopicList('')
# print topicMap

writeFile(topicJs, 'w', 'var topicList = ')

json.dump(topicMap, open(topicJs, 'a'))

writeFile(topicJs, 'a', ';')

print 'build topic list success.\n'
