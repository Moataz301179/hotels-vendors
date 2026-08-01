"""Minimal OpenClaw stub service.

Provides a /health endpoint so Docker Compose healthchecks pass.
The full browser-automation engine is optional and not required for
basic platform deployment. The app degrades gracefully when the
real OpenClaw service is unavailable.
"""

from http.server import HTTPServer, BaseHTTPRequestHandler


class HealthHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.end_headers()
        self.wfile.write(b'{"status": "ok", "service": "openclaw-stub"}')

    def log_message(self, *args):
        pass


if __name__ == "__main__":
    HTTPServer("0.0.0.0", 8000, HealthHandler).serve_forever()
