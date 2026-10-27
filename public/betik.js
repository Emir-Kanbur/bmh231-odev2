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
