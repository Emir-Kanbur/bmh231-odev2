'use strict';
const kartlar = document.querySelector('#kartlar');
const durum = document.querySelector('#durum');
const arama = document.querySelector('#arama');
const yenile = document.querySelector('#yenile');
const turAdlari = { atolye: 'Atölye', soylesi: 'Söyleşi', topluluk: 'Topluluk' };
let etkinlikler = [];
let seciliTur = '';
let hazir = false;
function oge(etiket, metin, sinif) {
  const eleman = document.createElement(etiket);
  if (metin !== undefined) eleman.textContent = metin;
  if (sinif) eleman.className = sinif;
  return eleman;
}
function kartOlustur(e) {
  const kart = oge('article', undefined, 'kart');
  const ust = oge('div', undefined, 'kart-ust');
  ust.append(oge('span', turAdlari[e.tur], `etiket ${e.tur}`), oge('span', String(e.id).padStart(2, '0'), 'kart-no'));
  const tarih = oge('time', new Date(`${e.tarih}T12:00:00`).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }));
  tarih.dateTime = e.tarih;
  const tarihSatiri = oge('p');
  tarihSatiri.append(tarih);
  const alt = oge('div', undefined, 'kart-alt');
  const ok = oge('span', '↗', 'kart-ok');
  ok.setAttribute('aria-hidden', 'true');
  alt.append(oge('span', `${e.kontenjan} kişilik kontenjan`), ok);
  kart.append(ust, oge('h3', e.baslik), tarihSatiri, oge('p', e.yer, 'yer'), alt);
  return kart;
}
function ciz() {
  if (!hazir) return;
  const sorgu = arama.value.trim().toLocaleLowerCase('tr-TR');
  const sonuc = etkinlikler.filter(e => (!seciliTur || e.tur === seciliTur) && e.baslik.toLocaleLowerCase('tr-TR').includes(sorgu));
  kartlar.replaceChildren();
  sonuc.forEach(e => kartlar.append(kartOlustur(e)));
  durum.className = 'durum';
  durum.textContent = sonuc.length ? `${sonuc.length} etkinlik seni bekliyor.` : 'Aramanıza uygun etkinlik yok.';
}
document.querySelectorAll('[data-tur]').forEach(dugme => {
  dugme.addEventListener('click', () => {
    seciliTur = dugme.dataset.tur;
    document.querySelectorAll('[data-tur]').forEach(d => {
      const secili = d === dugme;
      d.classList.toggle('secili', secili);
      d.setAttribute('aria-pressed', String(secili));
    });
    ciz();
  });
});
arama.addEventListener('input', ciz);

function gecerliEtkinlik(e) {
  return e && Number.isInteger(e.id) && typeof e.baslik === 'string' && Object.hasOwn(turAdlari, e.tur)
    && typeof e.yer === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(e.tarih)
    && !Number.isNaN(Date.parse(e.tarih)) && Number.isInteger(e.kontenjan) && e.kontenjan >= 0;
}
async function etkinlikleriYukle() {
  hazir = false;
  kartlar.replaceChildren();
  kartlar.setAttribute('aria-busy', 'true');
  durum.className = 'durum';
  durum.textContent = 'Yükleniyor…';
  yenile.hidden = true;
  try {
    const response = await fetch('/api/etkinlikler');
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const veri = await response.json();
    if (!Array.isArray(veri) || !veri.every(gecerliEtkinlik)) throw new Error('Geçersiz etkinlik verisi');
    etkinlikler = veri;
    hazir = true;
    ciz();
  } catch (hata) {
    durum.className = 'durum hata';
    durum.textContent = 'Etkinlikler yüklenemedi. Bağlantınızı kontrol edip yeniden deneyin.';
    yenile.hidden = false;
  } finally {
    kartlar.setAttribute('aria-busy', 'false');
  }
}
yenile.addEventListener('click', etkinlikleriYukle);
etkinlikleriYukle();

const form = document.querySelector('#oneri-formu');
const formSonuc = document.querySelector('#form-sonuc');
function bugunISO() {
  const bugun = new Date();
  return `${bugun.getFullYear()}-${String(bugun.getMonth() + 1).padStart(2, '0')}-${String(bugun.getDate()).padStart(2, '0')}`;
}
form.elements.tarih.min = bugunISO();
form.addEventListener('submit', olay => {
  olay.preventDefault();
  const baslik = form.elements.baslik;
  const tarih = form.elements.tarih;
  const eposta = form.elements.eposta;
  const kontroller = [
    [baslik, baslik.value.trim().length >= 5, 'Etkinlik adı en az 5 karakter olmalıdır.'],
    [tarih, Boolean(tarih.value) && tarih.validity.valid && tarih.value >= bugunISO(), 'Bugün veya gelecekteki geçerli bir tarih seçiniz.'],
    [eposta, /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(eposta.value.trim()) && eposta.validity.valid, 'Geçerli bir e-posta adresi giriniz.']
  ];
  const hatalar = kontroller.filter(([, gecerli]) => !gecerli);
  kontroller.forEach(([alan, gecerli]) => alan.setAttribute('aria-invalid', String(!gecerli)));
  formSonuc.className = hatalar.length ? 'hata' : 'basari';
  formSonuc.textContent = hatalar.length ? hatalar.map(([, , metin]) => metin).join('\n') : 'Teşekkürler! Öneriniz doğrulandı. Bu demo bilgileri kaydetmez veya göndermez.';
  if (hatalar.length) hatalar[0][0].focus();
});
