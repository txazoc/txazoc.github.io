#!/usr/bin/python2
# -*- coding:utf-8 -*-

import os
import json

topicModule = {}
rootDir = os.getcwd() + '/topic'

class Topic:
    def __init__(self, path, title, module):
        self.path = path
        self.title = title
        self.module = module

def buildTopicModule(relativePath):
    fullPath = rootDir + '/' + relativePath
    childs = os.listdir(fullPath)
    for child in childs:
        childRelativePath = relativePath + '/' + child
        childFullPath = rootDir + '/' + childRelativePath
        if os.path.isdir(childFullPath):
            buildTopicModule(childRelativePath)
        else:
            if child != '.DS_Store':
                topic = readTopic(childFullPath)
                if not (topic.has_key('published')) or topic['published'] != 'false':
                    fileName = child.replace('.md', '')
                    path = relativePath + '/' + fileName + '.html'
                    addTopic(Topic(path, topic['title'], topic['module']).__dict__)

def addTopic(topic):
    if not topicModule.has_key(topic['module']):
        topicModule[topic['module']] = []
    topicModule[topic['module']].append(topic)

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

def readTopics():
    f = open(os.getcwd() + '/script/topic.conf')
    line = f.readline().strip('\n')
    f.close()
    return line

def main():
    print '--------------------------------------------------'
    print '[python] build topic module begin.'

    topicJs = os.getcwd() + '/js/topic.js'
    buildTopicModule('')

    for (k, v) in topicModule.items():
        print '[' + k + ']'
        for t in v:
            print '    ' + t['path']

    writeFile(topicJs, 'w', readTopics())
    writeFile(topicJs, 'a', 'var TopicModule = ')
    json.dump(topicModule, open(topicJs, 'a'))
    writeFile(topicJs, 'a', ';')

    print '[python] build topic module success.'
    print '--------------------------------------------------'

main()
