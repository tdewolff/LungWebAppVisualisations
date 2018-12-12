#!/usr/bin/env python

import SimpleHTTPServer
import SocketServer
import StringIO
import gzip
import os
import glob
import re

Port = 8000

def ShrinkJSON(content):
    def numberRepl(m):
        num = float(m.group(0))
        num = '{:.2f}'.format(num)
        num = re.sub('[.]?0+$', '', num)
        return num
        
    content = re.sub('[+-]?[0-9]*[.][0-9]+([eE][+-]?[0-9]+)?', numberRepl, content)
    content = re.sub('\s', '', content)
    return content

class LungAppHandler(SimpleHTTPServer.SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path.endswith('.json') and 'accept-encoding' in self.headers and 'gzip' in self.headers['accept-encoding']:
            isCompressed = False
            filename = self.path[1:]

            mtime = os.path.getmtime(filename)
            for gzfilename in glob.glob(filename+'.*.gz'):
                gzmtime = os.path.getmtime(gzfilename)
                if gzmtime > mtime:
                    filename = gzfilename
                    isCompressed = True

            with open(filename, 'r') as f:
                content = f.read()
                if isCompressed:
                    m = re.findall('[.]([0-9]+)[.]gz', filename)
                    if len(m) > 0:
                        uncompressedLength = int(m[0])
                else:
                    print('Compressing ' + filename + '...') 
                    content = ShrinkJSON(content)
                    uncompressedLength = len(str(content))

                    if uncompressedLength < 500:
                        return SimpleHTTPServer.SimpleHTTPRequestHandler.do_GET(self)

                    out = StringIO.StringIO()
                    f = gzip.GzipFile(fileobj=out, mode='w', compresslevel=5)
                    f.write(content)
                    f.close()
                    content = out.getvalue()

                    gzf = open(filename+'.'+str(uncompressedLength)+'.gz', 'w+')
                    gzf.write(content)
                    gzf.close()
                
                self.send_response(200)
                self.send_header('Content-Length', str(len(str(content))))
                self.send_header('Content-Encoding', 'gzip')
                self.send_header('Content-Type', 'application/json')
                self.send_header('X-Uncompressed-Content-Length', uncompressedLength)
                self.end_headers()
                self.wfile.write(content)
                self.wfile.flush()
                return

        return SimpleHTTPServer.SimpleHTTPRequestHandler.do_GET(self)

Handler = LungAppHandler
Handler.extensions_map['.woff'] = 'font/woff'
Handler.extensions_map['.woff2'] = 'font/woff2'

SocketServer.TCPServer.allow_reuse_address=True
httpd = SocketServer.TCPServer(("", Port), Handler)

print('Server started')
print("Open your browser at http://localhost:8000/")

try:
    httpd.serve_forever()
except KeyboardInterrupt:
    pass

print('\rServer closed')
httpd.shutdown()
