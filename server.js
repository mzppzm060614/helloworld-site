// server.js —— Node.js HTTP 服务器入口文件
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

// 静态文件根目录
const PUBLIC_DIR = path.join(__dirname, 'public');

// MIME 类型映射表，用于设置正确的 Content-Type
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

// 创建 HTTP 服务器
const server = http.createServer((req, res) => {
  // 解析请求路径，默认首页为 /index.html
  let urlPath = req.url.split('?')[0];

  // API 路由：/time 返回当前服务器时间（JSON）
  if (urlPath === '/time') {
    const now = new Date();
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ time: now.toISOString() }));
    return;
  }

  if (urlPath === '/') {
    urlPath = '/index.html';
  }

  // 安全处理：防止路径穿越，把路径规范化为相对路径
  const filePath = path.join(PUBLIC_DIR, path.normalize(urlPath));

  // 检查请求的文件是否位于 public 目录内，避免目录遍历漏洞
  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('403 Forbidden');
    return;
  }

  // 读取请求的静态文件
  fs.readFile(filePath, (err, data) => {
    if (err) {
      // 文件不存在则返回 404
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('404 Not Found');
      return;
    }

    // 根据扩展名返回对应的 Content-Type
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
});

// 启动服务器并监听端口
server.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
