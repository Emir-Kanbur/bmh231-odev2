'use strict';
const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const sunucu = require('../sunucu');
let taban;
before(async () => {
  await new Promise(resolve => sunucu.listen(0, '127.0.0.1', resolve));
  taban = `http://127.0.0.1:${sunucu.address().port}`;
});
after(() => new Promise(resolve => sunucu.close(resolve)));
test('Liste ve filtre aynı JSON kaynağını kullanır', async () => {
  const kaynak = JSON.parse(fs.readFileSync(path.join(__dirname, '../etkinlikler.json'), 'utf8'));
  assert.ok(kaynak.length >= 6);
  assert.equal(new Set(kaynak.map(e => e.id)).size, kaynak.length);
  const yanit = await fetch(`${taban}/api/etkinlikler`);
  assert.equal(yanit.status, 200);
  assert.match(yanit.headers.get('content-type'), /application\/json; charset=utf-8/);
  assert.deepEqual(await yanit.json(), kaynak);
  const filtre = await fetch(`${taban}/api/etkinlikler?tur=atolye`);
  assert.deepEqual(await filtre.json(), kaynak.filter(e => e.tur === 'atolye'));
  assert.deepEqual(await (await fetch(`${taban}/api/etkinlikler?tur=yok`)).json(), []);
});
test('Tek etkinlik ve bulunamayan kimlik', async () => {
  assert.equal((await (await fetch(`${taban}/api/etkinlikler/2`)).json()).id, 2);
  const yok = await fetch(`${taban}/api/etkinlikler/999`);
  assert.equal(yok.status, 404);
  assert.deepEqual(await yok.json(), { hata: 'Etkinlik bulunamadı' });
});
test('GET dışındaki yöntemler 405 ve Allow döndürür', async () => {
  for (const method of ['DELETE', 'POST', 'PUT', 'HEAD']) {
    const yanit = await fetch(`${taban}/api/etkinlikler/2`, { method });
    assert.equal(yanit.status, 405);
    assert.equal(yanit.headers.get('allow'), 'GET');
  }
});
test('Statik dosyalar doğru MIME ve UTF-8 ile sunulur', async () => {
  for (const [yol, mime] of [['/', 'text/html'], ['/stil.css', 'text/css'], ['/betik.js', 'text/javascript']]) {
    const yanit = await fetch(taban + yol);
    assert.equal(yanit.status, 200);
    assert.equal(yanit.headers.get('content-type'), `${mime}; charset=utf-8`);
    assert.ok((await yanit.text()).length > 0);
  }
});
test('Kaynak kod, traversal ve bozuk yollar açılmaz', async () => {
  for (const yol of ['/sunucu.js', '/etkinlikler.json', '/.git/config', '/yok', '/api/etkinlikler/abc', '/%2e%2e%2fsunucu.js']) {
    assert.equal((await fetch(taban + yol)).status, 404, yol);
  }
  assert.equal((await fetch(`${taban}/%ZZ`)).status, 400);
});
test('Public dışını gösteren sembolik bağlantı sunulmaz', async () => {
  const link = path.join(__dirname, '../public/test-dis-kaynak');
  fs.symlinkSync(path.join(__dirname, '../sunucu.js'), link);
  try { assert.equal((await fetch(`${taban}/test-dis-kaynak`)).status, 404); }
  finally { fs.unlinkSync(link); }
});
