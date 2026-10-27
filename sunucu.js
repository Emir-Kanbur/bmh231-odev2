'use strict';
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const PUBLIC = path.join(__dirname, 'public');
const MIME = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.png': 'image/png' };
function yanit(res, durum, veri, tur = 'text/plain') {
  res.writeHead(durum, { 'Content-Type': `${tur}; charset=utf-8`, 'X-Content-Type-Options': 'nosniff' });
  res.end(veri);
}
function json(res, durum, veri) { yanit(res, durum, JSON.stringify(veri), 'application/json'); }

const sunucu = http.createServer(async (req, res) => {
  let url;
  try { url = new URL(req.url, 'http://localhost:3000'); }
  catch { return yanit(res, 400, 'Geçersiz istek'); }
  console.log(`${req.method} ${url.pathname}${url.search}`);
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return yanit(res, 405, 'Yönteme izin verilmiyor');
  }
  try {
    if (url.pathname === '/api/etkinlikler' || /^\/api\/etkinlikler\/\d+$/.test(url.pathname)) {
      // JSON dosyası hem sunucunun hem istemcinin tek veri kaynağıdır.
      const etkinlikler = JSON.parse(await fs.promises.readFile(path.join(__dirname, 'etkinlikler.json'), 'utf8'));
      if (url.pathname === '/api/etkinlikler') {
        const tur = url.searchParams.get('tur');
        return json(res, 200, tur ? etkinlikler.filter(e => e.tur === tur) : etkinlikler);
      }
      const id = Number(url.pathname.split('/').pop());
      const etkinlik = etkinlikler.find(e => e.id === id);
      return etkinlik ? json(res, 200, etkinlik) : json(res, 404, { hata: 'Etkinlik bulunamadı' });
    }
    let istenen;
    try { istenen = decodeURIComponent(url.pathname); }
    catch { return yanit(res, 400, 'Geçersiz yol'); }
    const dosya = path.resolve(PUBLIC, `.${istenen === '/' ? '/index.html' : istenen}`);
    if (!dosya.startsWith(PUBLIC + path.sep)) return yanit(res, 404, 'Sayfa bulunamadı');
    // realpath sembolik bağlantıların public dışına çıkmasını da engeller.
    const gercek = await fs.promises.realpath(dosya);
    if (!gercek.startsWith(PUBLIC + path.sep)) return yanit(res, 404, 'Sayfa bulunamadı');
    if (!(await fs.promises.stat(gercek)).isFile()) return yanit(res, 404, 'Sayfa bulunamadı');
    yanit(res, 200, await fs.promises.readFile(gercek), MIME[path.extname(gercek)] || 'application/octet-stream');
  } catch (hata) {
    if (hata.code === 'ENOENT' || hata.code === 'ENOTDIR') return yanit(res, 404, 'Sayfa bulunamadı');
    console.error('İstek işlenemedi:', hata.message);
    if (url.pathname.startsWith('/api/')) return json(res, 500, { hata: 'Etkinlik verisi okunamadı' });
    yanit(res, 500, 'Sunucu hatası');
  }
});
if (require.main === module) sunucu.listen(3000, () => console.log('Bozok Etkinlik: http://localhost:3000'));
module.exports = sunucu;
