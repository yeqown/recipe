# util function

import hashlib


def wash_string(s):
    '''
    clean str `\n\t` `space`
    '''
    s = s.replace('\n', '')
    s = s.replace('\t', '')
    s = s.replace('\r', '')
    return s.strip(' ')


def encode_url(url):
    '''encode_url to Hex string'''
    hash_md5 = hashlib.md5(url.encode('utf-8'))
    return hash_md5.hexdigest()
