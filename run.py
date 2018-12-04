#!/usr/bin/env python

import SimpleHTTPServer
import SocketServer
import StringIO
import gzip

Port = 8000

class LungAppHandler(SimpleHTTPServer.SimpleHTTPRequestHandler):
	def do_GET(self):
		if self.path.endswith('.json') and 'accept-encoding' in self.headers and 'gzip' in self.headers['accept-encoding']:
			with open(self.path[1:], 'r') as f:
				content = f.read()
				uncompressedLength = str(len(str(content)))

				out = StringIO.StringIO()
				f = gzip.GzipFile(fileobj=out, mode='w', compresslevel=5)
				f.write(content)
				f.close()
				content = out.getvalue()
				
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
