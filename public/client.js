// client.js —— 浏览器端脚本：获取并显示服务器时间

// 格式化时间为 YYYY-MM-DD HH:mm:ss
function formatTime(date) {
  const pad = (n) => String(n).padStart(2, '0');
  return (
    date.getFullYear() + '-' +
    pad(date.getMonth() + 1) + '-' +
    pad(date.getDate()) + ' ' +
    pad(date.getHours()) + ':' +
    pad(date.getMinutes()) + ':' +
    pad(date.getSeconds())
  );
}

// 从服务器获取当前时间
async function fetchServerTime() {
  try {
    const res = await fetch('/time');
    const data = await res.json();
    return data.time;
  } catch (err) {
    console.error('获取服务器时间失败：', err);
    return null;
  }
}

// 初始化：加载服务器时间并显示
async function init() {
  const el = document.getElementById('server-time');
  const serverTime = await fetchServerTime();

  if (serverTime) {
    el.textContent = formatTime(new Date(serverTime));
  } else {
    // 请求失败时回退到本地时间
    el.textContent = formatTime(new Date());
    el.style.color = '#e74c3c';
  }
}

init();
