# arabam-frontend 🚗

Bu proje, **arabam.com benzeri bir ilan listeleme ve detay görüntüleme uygulamasının**
Vue 3 ekosistemi kullanılarak geliştirilmiş bir **frontend case / demo** çalışmasıdır.

Amaç; modern frontend pratiklerini, state management, caching, pagination ve
responsive UI yaklaşımlarını göstermek.

---

## 🔍 Proje Özeti

Uygulama temel olarak iki ana ekrandan oluşur:

- **İlan Listeleme Sayfası**
- **İlan Detay Sayfası**

Kullanıcılar;
- ilanları sayfalı (pagination) şekilde görüntüleyebilir
- model yılına göre filtreleme yapabilir
- ilan detayına gidip fotoğrafları inceleyebilir
- ilan sahibine WhatsApp veya telefon üzerinden ulaşabilir

---

## 🧱 Kullanılan Teknolojiler

### ⚙️ Core
- **Vue 3** (Composition API, `<script setup>`)
- **Vue Router**
- **TypeScript**

### 📦 State & Data
- **@tanstack/vue-query**
  - API response caching
  - Pagination & detail cache
  - 3 dakika stale-time (geri gelince backend’e gitmez)

### 🎨 UI & UX
- **PrimeVue**
  - DataTable
  - Dialog (modal)
- **PrimeIcons**
- **Swiper.js**
  - Fotoğraf slider / galeri
- **vue-easy-lightbox**
  - Fotoğrafları fullscreen görüntüleme

### 🌐 API
- Fetch tabanlı custom HTTP client
- Query param normalize & builder
- API katmanı `core/api` altında izole

---

## 📄 Sayfalar

### 📃 Listing Page (`/`)
- Server-side pagination
- Model yılı min / max filtreleme
- Sıralama (tarih, fiyat, yıl)
- Responsive tablo (PrimeVue DataTable)
- Mobil için filtre modalı
- Vue Query ile cache’li veri çekme

### 📌 Detail Page (`/advert/:id`)
- Fotoğraf galeri (slider + fullscreen)
- İlan detay bilgileri
- Satıcı bilgileri
- “Mesaj Gönder” → WhatsApp Web
- Geri dön butonu (scroll pozisyonu korunur)

---

## 🗂️ Proje Yapısı
```txt
src/
├─ assets/
│ └─ style.css
├─ components/
│ ├─ AppHeader.vue
│ └─ AppFooter.vue
├─ core/
│ ├─ api/
│ │ ├─ adverts.helpers.ts
│ │ ├─ adverts.keys.ts
│ │ ├─ adverts.service.ts
│ │ ├─ endpoints.ts
│ │ └─ httpClient.ts
│ ├─ models/
│ │ └─ advert.ts
│ └─ utils/
│ └─ advert.ts
├─ views/
│ ├─ ListingPage.vue
│ └─ DetailPage.vue
├─ router/
│ └─ index.ts
├─ App.vue
└─ main.ts



---

## ⚡ Caching Davranışı (Vue Query)

- Listeleme ve detay sayfaları **cache’lenir**
- Aynı sayfaya 3 dakika içinde dönülürse:
  - Backend’e tekrar istek atılmaz
  - Veri cache’den okunur
- Detay sayfası prefetch edilmeye uygundur

---



## ▶️ Kurulum & Çalıştırma

```bash

pnpm install
pnpm dev


👤 Geliştirici

Onur Şentürk
Senior Frontend Developer

🔗 GitHub: https://github.com/onursenturk