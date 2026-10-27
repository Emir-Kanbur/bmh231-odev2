# Ödev 2 inceleme ve düzeltme kaydı

27 Ekim 2026 — Emir Kanbur, 16008125024. Özgün 6 sayfalık yönerge, mevcut 25 sayfalık PDF, kaynaklar, testler ve gerçek Git geçmişi karşılaştırıldı. Eski rapor değiştirilmeden korundu; güncel sonuçlar inceleme ekindedir.

## Yapılan düzeltmeler

- Kimliği 2 olan etkinliğin topluluk adı, öğrencinin bildirdiği üyelik doğrultusunda Açık Kaynak Yazılım Geliştirme Topluluğu olarak düzeltildi. Üniversite bağlantısı README'ye eklendi. Etkinlik hâlâ gerçekçi ders örneğidir; resmî duyuru değildir.
- B4 ölçümü bu kez doğrudan Helium DevTools Lighthouse panelinde, Desktop/Navigation ve yalnız Accessibility ile yapıldı: 100 (17:04), arama label'ı ve placeholder geçici kaldırılınca 94 (17:08), dosya özgün baytlarından geri yüklenince 100 (17:10). Snapshot ara deneyi 22/23 denetim gösterdi; bu sonuç 100 üzerinden puan yerine kullanılmadı.
- D3 tekrarında gerçek Fetch/XHR düğmesi seçildi. Normal API Timing: TTFB 1,70 ms, toplam 6,56 ms. Ardından gerçek DevTools 3G seçilip yenilendi; satır 4 ms gösterdi. Yavaşlama ve Yükleniyor anı gözlenmedi; D3(b) bu nedenle hâlâ eksik. Önceki rapordaki CDP deneyi 3G DevTools deneyi yerine geçirilmedi.
- Uzun topluluk başlığı 390 px görünümde taşmadan sarıldı. Atölye + GİT bir kart, bulunmayan arama sıfır kart ve boş sonuç mesajı verdi. Sayfa 1280 px ve Tümü görünümüne geri getirildi; ağ ayarı No throttling yapıldı.
- npm run check başarılı. npm test 6/6 başarılı. Dört curl isteği güncel veriyle tekrar kaydedildi. git diff --check başarılı. Ek lint/typecheck/build betiği tanımlı değil.

## Madde bazında sonuç

| Madde | Sonuç |
| --- | --- |
| A1–A3, A5–A6, A8 | Cevapların teknik içeriğinde belirgin hata bulunmadı. |
| A4, A7 | Çalıştırılan sonuçlar doğru; öğrencinin çalıştırmadan önceki kişisel tahmin kaydı eksik. Sonradan tahmin üretilmemeli. |
| B1–B3 | Gerekli HTML/CSS yapıları mevcut; özgün görseller ve güncel 390 px kontrolü var. |
| B4 | DevTools panelinde gerçek 100 → 94 → 100 kanıtı eklendi. Helium Chromium tabanlıdır; yönerge Chrome/Firefox adlarını veriyor. Tam araç uyumu için o tarayıcılardan birinde de tekrarlanmalı. |
| C1–C3 | Kod ve mevcut test/ekran kayıtları gereksinimleri karşılıyor. Topluluk adı kişiselleştirildi. |
| C4 | Özgün hata Lighthouse ile bulunmuş; istenen Console/Elements/Network üzerinden gerçek keşif anlatımı eksik. Sonradan keşfedilmiş gibi yazılmamalı. |
| D1, D2, D4 | API, statik dosya sınırı, async/await, response.ok, hata/yükleme ve curl davranışları uygun. D2 hata kanıtı 503 müdahalesiyle alınmış; yönergedeki durdurma/bozuk adres yöntemiyle tam aynı değil. |
| D3(a) | Özgün başlık/HTML karşılaştırması var; Fetch/XHR seçimiyle yeni Timing kanıtı eklendi. |
| D3(b) | 3G'de yavaşlama bu ortamda tekrar gözlenmedi; Chrome/Firefox'ta yeniden ölçüm gerekiyor. |
| E1 | Public depo ve 10+ anlamlı commit var. Tüm commitler 27 Ekim'de; iki gün şartı henüz yok. |
| E2 | Kod açıklamaları teknik olarak tutarlı fakat mevcut rapor bunların Codex tarafından yazıldığını beyan ediyor. Öğrenci kendi anlayışıyla açıklamalı. |

## Teslimden önce öğrencinin tamamlaması gerekenler

1. 28 Ekim veya sonraki bir gün, 5 Kasım 23:59'dan önce gerçekten çalışıp anlamlı değişikliği normal tarihli commit ile kaydet. Geçmiş tarih verme veya boş commit kullanma.
2. Chrome/Firefox DevTools ile D3(b) yavaş ağ ve Yükleniyor ekranını kaydet; normal/yavaş süreleri, tarih ve saati yaz. B4'ü aynı tarayıcıda tekrarlamak araç şartını da kapatır.
3. A4/A7 için ön tahmin sürecinin eksik olduğunu dürüstçe koru; yeni bir öğrenme denemesi yaparsan tarihini ve bunun tekrar olduğunu belirt.
4. Gerçek bir hata üzerinde Console/Elements/Network incelemeni kendi cümlelerinle anlat. Eski Lighthouse keşfini başka panelde yapılmış gibi gösterme.
5. E2'deki üç kod parçasını okuyup kendi cümlelerinle açıkla. Mevcut yapay zekâ kullanımını ve özgün yönergenin doğrudan hazırlatma yasağını gizleme. Beyanı değiştirmek geçmiş kullanım biçimini değiştirmez.
6. BOYSİS'e yüklenecek PDF'yi son kez gözden geçir. Bu incelemede BOYSİS yüklemesi yapılmadı.

Kaynak: https://topluluklar.bozok.edu.tr/Home/Topluluk?GUID=3A759AC7-894D-4B8D-AEF2-6473988383C0

Bu kayıt Codex'in kod gözden geçirme, hedefli veri düzeltmesi ve gerçek test/ölçüm desteğini belgeliyor. Öğrencinin bağımsız cevap veya ölçüm beyanı değildir. Tam teslim uygunluğu ya da puan garantisi verilmez.
