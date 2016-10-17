import cdn
import time

def cdnRefresh(path):
    resp = cdn.request({'Action': 'PushObjectCache', 'ObjectPath': path})
    if resp.has_key('PushTaskId'):
        return resp['PushTaskId']
    else:
        print '[CDN Refresh]: Error ' + path
        return 0

def cdnRefreshQuery(path):
    taskId = cdnRefresh('http://image.txazo.com/js/init.js')
    if taskId > 0:
        print '[CDN Refresh]: Refreshing ' + path + ' ...'
        for i in range(1, 15):
            resp = cdn.request({'Action': 'DescribeRefreshTasks', 'TaskId': str(taskId)})
            if resp.has_key('Tasks'):
                Status = resp['Tasks']['CDNTask'][0]['Status']
                if Status == 'Complete':
                    print '[CDN Refresh]: Complete --------------------------------------------------'
                    break
                else:
                    time.sleep(2)

cdnRefreshQuery('http://www.txazo.com/')
cdnRefreshQuery('http://image.txazo.com/css/core.css')
cdnRefreshQuery('http://image.txazo.com/css/input.min.css')
cdnRefreshQuery('http://image.txazo.com/js/data.js')
cdnRefreshQuery('http://image.txazo.com/js/init.js')
cdnRefreshQuery('http://image.txazo.com/js/load.js')
cdnRefreshQuery('http://image.txazo.com/js/topic.js')
cdnRefreshQuery('http://image.txazo.com/js/lib/seajs-css.js')
