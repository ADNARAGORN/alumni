# 🎨 Brand Kit & Design System (`brand.md`)
> **Alumni Tracking System (Mezun Takip Sistemi) — Görsel Kimlik ve Arayüz Tasarım Rehberi**

Bu doküman, uygulamanın tüm HTML görünümlerinde (`/`, `/users`, `/jobs`, `/applications`, `/announcements`, `/404`) tutarlı, kurumsal ve modern bir kullanıcı deneyimi sunmak için tek tasarım kaynağı (*Single Source of Truth*) olarak hazırlanmıştır.

---

## 🏛️ 1. Marka Kimliği ve Ton (Brand Identity)

* **Marka Adı:** Alumni · Mezun & Kariyer Ağı
* **Tasarım Karakteri:** Akademik Prestij + Çağdaş Kariyer Platformu (*Academic Navy & Heritage Gold*)
* **Kullanıcı Hissi:** Güvenilir, sade, sıcak, okunaklı ve kurumsal.
* **Taslak Referansı:** `temp/design-preview` *(Claude tipografisi + WIRED keskin `0px` butonlar + Notion veri tabloları + Tesla/Apple premium kategori kartları harmanı)*

---

## 🎨 2. Renk Paleti (Color System)

| Rol | Renk Adı | HEX Kodu | Kullanım Alanı |
| :--- | :--- | :---: | :--- |
| **Primary (Ana Marka)** | Oxford Navy | `#0B1F3A` | Ana başlıklar, birincil butonlar, logo rozeti, koyu özet kartları |
| **Primary Hover** | Deep Navy | `#16325B` | Birincil buton ve interaktif koyu alan hover durumları |
| **Accent (Vurgu)** | Heritage Gold | `#C8922B` | İtalik vurgu kelimeleri, ikincil CTA butonları, kart hover çerçeveleri |
| **Accent Soft** | Warm Gold Tint | `#F3E6C8` | Eyebrow rozetleri, kategori/şirket etiket arka planları |
| **Canvas (Zemin)** | Warm Ivory | `#FAF8F4` | Tüm sayfaların genel arka planı (göz yormayan sıcak zemin) |
| **Surface (Yüzey)** | Pure White | `#FFFFFF` | Kartlar, tablolar, formlar, modül kutuları |
| **Border (Çerçeve)** | Sandstone | `#E6E0D5` | Kart, tablo ve input ince kenarlıkları |
| **Text Primary** | Ink Charcoal | `#111827` | Ana gövde metinleri ve tablo değerleri |
| **Text Muted** | Slate Gray | `#5A6577` | Yardımcı açıklamalar, tarihler, form etiketleri, navigasyon linkleri |

### 🚦 Anlamsal Durum Renkleri (Semantic Colors)
* **Success / Live (Başarı & Canlı Durum):** `#0F766E` *(Zemin: `#CCFBF1`)*
* **Warning (Uyarı / Düzenle):** `#D97706` *(Zemin: `#FEF3C7`)*
* **Danger (Hata / Sil / 404 / 409):** `#DC2626` *(Zemin: `#FEF2F2`)*
* **Info (Bilgi / Detay):** `#1D4ED8` *(Zemin: `#DBEAFE`)*

---

## ✍️ 3. Tipografi Sistemi (Typography)

Sistemde akademik otorite ile modern arayüz okunabilirliğini dengeleyen **Serif + Sans-Serif** eşleşmesi kullanılır:

* **Display / Başlık Fontu:** `'Playfair Display', Georgia, serif`
  * *Kullanım:* Hero ana başlığı (`H1`), bölüm başlıkları (`H2`), büyük istatistik rakamları ve marka logosu.
  * *Ağırlıklar:* `600` (SemiBold), `700` (Bold), vurgu kelimelerinde `Italic 600`.
* **Gövde / Arayüz Fontu:** `'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif`
  * *Kullanım:* Paragraflar, navigasyon, butonlar, form alanları, tablolar ve etiketler.
  * *Ağırlıklar:* `400` (Regular), `500` (Medium), `600` (SemiBold), `700` (Bold).

### 📏 Tipografi Ölçeği
| Öğe | Font | Boyut | Satır Yüksekliği |
| :--- | :--- | :---: | :---: |
| **Hero H1** | Playfair Display Bold | `36px – 52px` (`clamp`) | `1.14` |
| **Section H2** | Playfair Display SemiBold | `28px – 32px` | `1.25` |
| **Card Title H3** | Plus Jakarta Sans Bold | `18px – 20px` | `1.35` |
| **Body / Lead** | Plus Jakarta Sans Regular | `15px – 17px` | `1.60` |
| **Label / Badge** | Plus Jakarta Sans Bold | `11px – 13px` | `1.20` |

---

## 🧩 4. Bileşen ve Yerleşim Standartları (Components & Layout)

* **Konteyner Genişliği:** Maksimum `1200px`, yatay iç boşluk `28px`.
* **Köşe Yuvarlaklığı (Border Radius):**
  * **Butonlar, Input alanları & Etiketler (*WIRED — Square corners, no compromise*):** Kesinlikle `0px` (tam keskin köşeli)
  * **Kategori Kartları (*Tesla Gallery Standard*):** `12px`
  * **Veri Tablosu Çerçeveleri (*Notion Style*):** `0px` / `4px` keskin veya minimal köşe, yalnızca yatay `1px` çizgiler
* **Gölgelendirme (Elevation):**
  * Ağır gölgeler yerine yüzey kontrastı (`#FAF8F4` / `#FFFFFF` / `#0B1F3A`) ve keskin `1px` ayırıcı çizgiler tercih edilir.
* **Buton Hiyerarşisi (*WIRED Sharp Style*):**
  1. **Primary:** `#0B1F3A` zemin, beyaz yazı, `0px` köşe, hover'da `#C8922B`.
  2. **Accent:** `#C8922B` zemin, beyaz yazı, `0px` köşe, hover'da `#0B1F3A`.
  3. **Outline:** Şeffaf zemin, `1.5px solid #0B1F3A`, `0px` köşe, hover'da tam tersi (`#0B1F3A` zemin, beyaz yazı).
  4. **Üst Navigasyon Linkleri (Belirgin Tıklanabilir Öğeler):** Kutusuz/çerçevesiz, ancak düz metinden anında ayrışan **Heritage Gold (`#A67518` / `#C8922B`)** kalın büyük harf renk; hover veya aktif sayfada `#0B1F3A` (Oxford Navy) + altından keskin `2px solid #C8922B` çizgi.

---

## 💻 5. Hazır CSS Değişkenleri (Design Tokens)

Tüm View dosyalarında (`views/*.js` ve `public/*.html`) doğrudan aşağıdaki CSS değişkenleri kullanılmalıdır:

```css
:root {
    --color-navy: #0B1F3A;
    --color-navy-soft: #16325B;
    --color-gold: #C8922B;
    --color-gold-light: #F3E6C8;
    --color-ivory: #FAF8F4;
    --color-surface: #FFFFFF;
    --color-ink: #111827;
    --color-muted: #5A6577;
    --color-border: #E6E0D5;
    --color-success: #0F766E;
    --color-warning: #D97706;
    --color-danger: #DC2626;

    --font-display: 'Playfair Display', Georgia, serif;
    --font-body: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;

    --radius-btn: 0px;       /* WIRED: Square corners, no compromise */
    --radius-card: 12px;     /* Tesla: Category cards */
}
```

---

## ✅ 6. Tasarım Kuralları (Do's & Don'ts)

* **Yap (Do):** Tüm sayfalarda aynı üst navigasyon barını (`Alumni` monogram + linkler), `Warm Ivory` arka planını ve `:root` renk değişkenlerini kullan.
* **Yap (Do):** Başlıklarda `Playfair Display`, tablo/form/butonlarda `Plus Jakarta Sans` hiyerarşisini koru.
* **Yapma (Don't):** Sayfalarda rastgele farklı mavi tonları (`#007bff`, `#2563eb` vb.) karıştırma; her yeni arayüz bileşeni mutlaka bu `brand.md` dosyasındaki palete uymalıdır.
* **Yapma (Don't):** `Heritage Gold (#C8922B)` rengini uzun gövde paragraflarında kullanma; yalnızca vurgu, rozet, çerçeve ve CTA butonları için sakla.
