import https from 'https';
import http from 'http';

export function testUrl(url: string): Promise<{ url: string; status: number; ok: boolean }> {
  return new Promise((resolve) => {
    try {
      const parsed = new URL(url);
      const client = parsed.protocol === 'https:' ? https : http;
      const req = client.request(
        url,
        {
          method: 'HEAD',
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
          },
          timeout: 8000,
        },
        (res) => {
          resolve({ url, status: res.statusCode || 0, ok: (res.statusCode || 0) < 400 });
        }
      );
      req.on('error', () => resolve({ url, status: 0, ok: false }));
      req.on('timeout', () => {
        req.destroy();
        resolve({ url, status: 408, ok: false });
      });
      req.end();
    } catch {
      resolve({ url, status: 0, ok: false });
    }
  });
}
