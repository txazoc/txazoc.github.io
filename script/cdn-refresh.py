import cdn

def cdnRefresh(path):
    resp = cdn.request({'Action': 'PushObjectCache', 'ObjectPath': path})
    if resp.has_key('PushTaskId'):
        print '[CDN Refresh]:\t' + resp['PushTaskId'] + '\t' + path

cdnRefresh('http://image.txazo.com/js/init.js')
cdnRefresh('http://image.txazo.com/js/load.js')
