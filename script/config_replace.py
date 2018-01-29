#!/usr/bin/python2
# -*- coding:utf-8 -*-

import os
import sys
import md5
import time

configFile = os.getcwd() + '/_config.yml'

def md5hash(str):
    m = md5.new()
    m.update(str)
    return m.hexdigest()

def replace(localDebug):
    f = open(configFile, 'r')
    lines = f.readlines()
    f.close()

    f = open(configFile, 'w')
    for line in lines:
        if line.find(':') > -1:
            pair = line.split(':', 1)
            key = pair[0].strip()
            value = pair[1].strip()
            if key == 'localDebug':
                write(f, 'localDebug', localDebug, '"')
            elif key == 'randomVersion':
                write(f, 'randomVersion', md5hash(str(time.time())), '"')
            elif key == 'markdown':
                write(f, 'markdown', (localDebug == 'true') and 'rdiscount' or 'kramdown', '')
            else:
                f.write(line)
        else:
            f.write(line)
    f.close()

def write(f, key, value, quote):
    f.write(key + ': ' + quote + value + quote + '\n')

def main(localDebug):
    print '--------------------------------------------------'
    print '[python] replace config begin.'
    replace(localDebug)
    print '[python] replace config success.'
    print '--------------------------------------------------'

if __name__ == '__main__':
    localDebug = 'false'
    if len(sys.argv) > 1 and sys.argv[1] == 'true':
        localDebug = 'true'
    main(localDebug)
