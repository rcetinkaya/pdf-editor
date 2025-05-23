# PDF Imzalama ve AI Destekli Sözleşme Editörü

Bu proje iki ana bölüme ayrılmıştır:

* **PDF İmzalama Sayfası:** Kullanıcının yüklediği PDF dosyasını sayfa sayfa görüntüleyip her sayfaya ayrı ayrı imza bırakmasını, konumlandırmasını ve doğru pozisyonda çıktı almasını sağlar.
* **AI Destekli Sözleşme Editörü:** Yapay zekayla öne çıkarılmış kritik maddeleri vurgulayan ve bunları modallar aracılığıyla düzenlemeye imkan veren bir editördür.

---

## Kullanılan Teknolojiler ve Tercih Sebepleri

### Ana Teknolojiler

| Teknoloji        | Amacı                                                    | Neden Bu Teknoloji?                                                                 |
| ---------------- | -------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| **Next.js 15**   | App Router ile modern SSR/CSR destekli frontend mimarisi | Dosya bazlı yönlendirme, server actions ve güçlü optimizasyon yetenekleri sayesinde |
| **React 19**     | Komponent bazlı yapı ve yeni "use" destekleri            | UI yönetiminde en yaygın ve geniş topluluk desteğine sahip olmasından dolayı        |
| **TypeScript**   | Tür kontrolü, refactor kolaylığı ve otocompletion        | Hataları erken yakalamak ve daha güvenli bir geliştirme süreci sağlamak için        |
| **Tailwind CSS** | Sade, responsive ve utility-first class yapısı           | Hızlı prototipleme, responsive yapı ve tutarlı tasarım sistemi sunması nedeniyle    |

### PDF İmzalama Sayfası

| Kütüphane         | Görev                                                    | Neden Bu Kütüphane?                                                                   |
| ----------------- | -------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| `pdfjs-dist`      | PDF'i canvas üzerine render etmek                        | Mozilla tarafından geliştirilen güvenilir bir PDF görüntüleyici altyapısı olduğu için |
| `react-draggable` | İmza kutularını sürüklenebilir hale getirmek             | Basit API ve React ile sorunsuz entegrasyon sunmasından dolayı                        |
| `html2canvas`     | DOM'dan görsel çıktı almak                               | PDF oluşturma öncesi canvas render'ını desteklemek için                               |
| `jspdf`           | PDF dosyasını olusturmak ve imzayı görsel olarak eklemek | PDF çıktısı almak için en yaygın kullanılan kütüphanelerden biri olduğu için          |
| `uuid`            | Benzersiz imza ID'leri oluşturmak                        | Her imzaya özel bir kimlik atamak amacıyla                                            |

### AI Destekli Editör

| Kütüphane                 | Görev                                       | Neden Bu Kütüphane?                                                       |
| ------------------------- | ------------------------------------------- | ------------------------------------------------------------------------- |
| `@tinymce/tinymce-react`  | Rich text editor olarak TinyMCE kullanımı   | Profesyonel, plugin destekli, kullanıcı dostu bir WYSIWYG editör olması   |
| Özel `EditModal` bileşeni | Highlight alanların düzenlenmesini sağlamak | Kullanıcının AI vurgulu alanlarla etkileşim kurmasını kolaylaştırmak için |

---

## Proje Yapısı (Kısaca)

```
/src
 ├─ app/pdf           => PDF imzalama sayfası
 └─ app/editor        => AI destekli sözleşme editörü
```

---

## Kullanım

```bash
npm install
npm run dev
```

> `pdf.worker.min.js` dosyası otomatik olarak `postinstall` scriptiyle kopyalanır.

---

## Öne Çıkan Özellikler

* [x] Sayfa bazlı PDF render ve imza konumlandırma
* [x] Sayfa numarası ve (x, y) koordinat bilgisi görüntüleme
* [x] Her PDF sayfası ayrı ayrı render edilir ve export edilir
* [x] İmzalar PDF'de doğru konumda görünür
* [x] Yapay zeka tarafından önerilen metinleri kullanıcıya editable sunma
* [x] Responsive, minimalist, sade ve şık tasarım

---

## Kullanılan Önemli Paketler

```json
"jspdf": "^3.0.1",
"html2canvas": "^1.4.1",
"pdfjs-dist": "^3.4.120",
"react-draggable": "^4.4.6",
"@tinymce/tinymce-react": "^6.1.0",
"tinymce": "^7.9.0",
"tailwindcss": "^4.1.7"
```

---

## Lisans

Bu proje demo/test amacıyla hazırlanmıştır. Kurumsal kullanım için lisanslandırılması gerekir.
