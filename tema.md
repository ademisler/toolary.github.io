# Toolary GitHub Pages Tema Dokümantasyonu

Bu dokümantasyon, Toolary Chrome eklentisinin GitHub Pages sitesi için hazırlanan Jekyll temasının kullanımını ve özelliklerini açıklar.

## 🎨 Tasarım Sistemi

### Renk Paleti
Tema, eklentinin orijinal tasarım sistemini tam olarak taklit eder:

```css
:root {
  --toolary-primary: #FFDE00;    /* Ana sarı renk */
  --toolary-accent: #00BFFF;     /* Mavi vurgu rengi */
  --toolary-bg: #f8f9fa;         /* Açık arka plan */
  --toolary-text: #1f2937;       /* Ana metin rengi */
  --toolary-text-secondary: #6b7280; /* İkincil metin */
}
```

### Dark Mode Desteği
Tema otomatik olarak sistem tercihlerini algılar ve dark mode'u destekler:

```css
@media (prefers-color-scheme: dark) {
  :root {
    --toolary-bg: #1e1e1e;
    --toolary-text: #ffffff;
    /* ... diğer dark mode renkleri */
  }
}
```

### Glassmorphism Efektleri
Modern glassmorphism tasarımı ile şeffaf kartlar ve blur efektleri:

```css
.tool-card {
  background: var(--toolary-button-bg);
  backdrop-filter: blur(20px);
  border: 1px solid var(--toolary-border);
  box-shadow: var(--toolary-shadow);
}
```

## 🏗️ Dosya Yapısı

```
docs/
├── _config.yml              # Jekyll konfigürasyonu
├── _layouts/
│   └── default.html         # Ana layout şablonu
├── index.html               # Ana sayfa
├── assets/
│   ├── css/
│   │   └── main.css        # Ana stil dosyası
│   └── js/
│       └── animations.js   # İnteraktif özellikler
└── tema.md                 # Bu dokümantasyon
```

## 🚀 Özellikler

### 1. Extension Popup Tasarımı
- Eklentinin popup arayüzünün tam kopyası
- Aynı header, search bar ve kategori menüsü
- Responsive grid layout ile tüm araçlar görünür

### 2. İnteraktif Araç Kartları
- 24 araç için detaylı kartlar
- Hover efektleri ve animasyonlar
- Kategori bazlı filtreleme
- Arama fonksiyonu

### 3. Modal Detay Penceresi
- Araçlara tıklandığında açılan detay modalı
- Özellik listesi ve açıklamalar
- Chrome Web Store yönlendirmesi

### 4. Dark/Light Mode Toggle
- Sağ üst köşede tema değiştirici
- Sistem tercihlerini otomatik algılama
- LocalStorage ile tercih kaydetme

### 5. Responsive Tasarım
- Mobil, tablet ve desktop uyumlu
- Flexible grid system
- Touch-friendly interface

## 🛠️ Kurulum ve Kullanım

### 1. Jekyll Kurulumu
```bash
# Jekyll ve bağımlılıkları yükle
gem install jekyll bundler

# Proje dizinine git
cd docs/

# Bağımlılıkları yükle
bundle install

# Yerel sunucuyu başlat
bundle exec jekyll serve
```

### 2. GitHub Pages Deploy
```bash
# GitHub Pages için build
bundle exec jekyll build

# _site klasörünü GitHub'a push et
git add _site/
git commit -m "Deploy to GitHub Pages"
git push origin gh-pages
```

### 3. Konfigürasyon
`_config.yml` dosyasında site ayarlarını düzenleyin:

```yaml
title: "Toolary - 24 Productivity Tools"
url: "https://ademisler.github.io"
baseurl: "/toolary.github.io"
```

## 📱 Responsive Breakpoints

```css
/* Mobile */
@media (max-width: 768px) {
  .tools-grid {
    grid-template-columns: 1fr;
  }
}

/* Tablet */
@media (max-width: 1024px) {
  .tools-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Desktop */
@media (min-width: 1025px) {
  .tools-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

## 🎯 JavaScript Özellikleri

### 1. Araç Yönetimi
```javascript
// Tüm araçları getir
function getAllTools() {
  const allTools = [];
  Object.keys(toolsData).forEach(category => {
    toolsData[category].forEach(tool => {
      allTools.push({ ...tool, category });
    });
  });
  return allTools;
}
```

### 2. Arama Fonksiyonu
```javascript
// Araçları filtrele
function filterTools() {
  let tools = getAllTools();
  
  if (currentCategory !== 'all') {
    tools = tools.filter(tool => tool.category === currentCategory);
  }
  
  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase();
    tools = tools.filter(tool => 
      tool.name.toLowerCase().includes(query) ||
      tool.description.toLowerCase().includes(query)
    );
  }
  
  filteredTools = tools;
  renderTools();
}
```

### 3. Modal Yönetimi
```javascript
// Araç detay modalını aç
function openToolModal(tool) {
  toolModalTitle.textContent = tool.name;
  toolModalDescription.textContent = tool.description;
  toolModal.classList.add('show');
}
```

## 🎨 CSS Sınıfları

### Ana Bileşenler
- `.header` - Üst header bölümü
- `.search-bar` - Arama çubuğu
- `.tools-grid` - Araçlar grid'i
- `.tool-card` - Tekil araç kartı
- `.tool-modal` - Detay modal penceresi

### Animasyon Sınıfları
- `.fade-in` - Fade in animasyonu
- `.slide-up` - Yukarı kayma animasyonu
- `.scale-in` - Büyüme animasyonu

### Durum Sınıfları
- `.show` - Görünür durum
- `.loading` - Yükleme durumu
- `.dark` - Dark mode

## 🔧 Özelleştirme

### 1. Renk Değiştirme
`assets/css/main.css` dosyasında CSS değişkenlerini düzenleyin:

```css
:root {
  --toolary-primary: #YENİ_RENK;
  --toolary-accent: #YENİ_VURGU_RENGİ;
}
```

### 2. Yeni Araç Ekleme
`assets/js/animations.js` dosyasında `toolsData` objesine yeni araç ekleyin:

```javascript
"yeni-kategori": [
  {
    id: "yeni-arac",
    name: "Yeni Araç",
    description: "Araç açıklaması",
    icon: "SVG_PATH",
    features: ["Özellik 1", "Özellik 2"]
  }
]
```

### 3. Layout Değiştirme
`_layouts/default.html` dosyasında HTML yapısını düzenleyin.

## 📊 Performans Optimizasyonu

### 1. Lazy Loading
```javascript
// Intersection Observer ile lazy loading
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
});
```

### 2. Debounced Search
```javascript
// Arama input'u için debounce
searchInput.addEventListener('input', debounce(function() {
  searchQuery = this.value;
  filterTools();
}, 300));
```

### 3. CSS Optimizasyonu
- Critical CSS inline
- Non-critical CSS lazy load
- Minified production build

## 🧪 Test Etme

### 1. Yerel Test
```bash
bundle exec jekyll serve --livereload
```

### 2. Build Test
```bash
bundle exec jekyll build
```

### 3. Lighthouse Test
```bash
# Chrome DevTools > Lighthouse
# Performance, Accessibility, Best Practices, SEO
```

## 🚀 Deployment

### 1. GitHub Pages
1. Repository'de Settings > Pages
2. Source: Deploy from a branch
3. Branch: gh-pages
4. Folder: / (root)

### 2. Custom Domain
1. `_config.yml`'de URL'i güncelle
2. CNAME dosyası oluştur
3. DNS ayarlarını yapılandır

## 📝 Notlar

- Tema tamamen responsive ve mobile-first yaklaşımla tasarlandı
- Tüm animasyonlar `prefers-reduced-motion` ile uyumlu
- Accessibility standartlarına uygun
- SEO optimizasyonu yapıldı
- Performance odaklı geliştirildi

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun
3. Değişikliklerinizi commit edin
4. Pull request gönderin

## 📄 Lisans

MIT License - Detaylar için LICENSE dosyasına bakın.

---

**Toolary GitHub Pages Tema** - Modern, responsive ve kullanıcı dostu web sitesi teması 🚀
