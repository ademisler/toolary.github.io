# Toolary GitHub Pages Site

Modern, responsive GitHub Pages sitesi - Toolary Chrome eklentisinin popup tasarımını tam olarak taklit eden, full sayfa araç vitrin sitesi.

## 🎯 Özellikler

- **Extension Popup Tasarımı**: Eklentinin popup arayüzünün birebir kopyası
- **24 Araç Vitrini**: Tüm araçlar detaylı kartlarla görüntülenir
- **İnteraktif Modal**: Araçlara tıklayınca detay penceresi açılır
- **Glassmorphism Efektleri**: Modern şeffaf tasarım
- **Dark/Light Mode**: Tema değiştirici ile
- **Responsive Design**: Mobil, tablet, desktop uyumlu
- **Arama & Filtreleme**: Kategori ve metin bazlı arama
- **Smooth Animations**: Yumuşak geçişler ve hover efektleri

## 🚀 Hızlı Başlangıç

### 1. Repository'yi Clone Edin
```bash
git clone https://github.com/ademisler/toolary.github.io.git
cd toolary.github.io
```

### 2. Jekyll Kurulumu
```bash
# Jekyll ve bağımlılıkları yükle
gem install jekyll bundler

# Bağımlılıkları yükle
bundle install
```

### 3. Yerel Sunucuyu Başlatın
```bash
bundle exec jekyll serve --livereload
```

Site `http://localhost:4000` adresinde açılacak.

## 📁 Dosya Yapısı

```
docs/
├── _config.yml              # Jekyll konfigürasyonu
├── _layouts/
│   └── default.html         # Ana layout şablonu
├── index.html               # Ana sayfa (popup tasarımı)
├── assets/
│   ├── css/
│   │   └── main.css        # Ana stil dosyası (glassmorphism)
│   └── js/
│       └── animations.js   # İnteraktif özellikler
├── tema.md                 # Tema dokümantasyonu (Türkçe)
└── README.md               # Bu dosya
```

## 🎨 Tasarım Sistemi

### Renk Paleti
```css
--toolary-primary: #FFDE00    /* Ana sarı */
--toolary-accent: #00BFFF     /* Mavi vurgu */
--toolary-bg: #f8f9fa         /* Açık arka plan */
--toolary-text: #1f2937       /* Ana metin */
```

### Glassmorphism Efektleri
- `backdrop-filter: blur(20px)`
- Şeffaf arka planlar
- Yumuşak gölgeler
- Modern border radius

## 🛠️ Özelleştirme

### 1. Araç Ekleme
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

### 2. Renk Değiştirme
`assets/css/main.css` dosyasında CSS değişkenlerini düzenleyin:

```css
:root {
  --toolary-primary: #YENİ_RENK;
  --toolary-accent: #YENİ_VURGU_RENGİ;
}
```

### 3. Layout Değiştirme
`_layouts/default.html` dosyasında HTML yapısını düzenleyin.

## 📱 Responsive Breakpoints

- **Mobile**: < 768px (1 sütun)
- **Tablet**: 768px - 1024px (2 sütun)
- **Desktop**: > 1024px (3 sütun)

## 🚀 GitHub Pages Deploy

### Otomatik Deploy
1. Repository'de Settings > Pages
2. Source: Deploy from a branch
3. Branch: main
4. Folder: /docs

### Manuel Deploy
```bash
# Build
bundle exec jekyll build

# _site klasörünü GitHub'a push et
git add _site/
git commit -m "Deploy to GitHub Pages"
git push origin gh-pages
```

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
Chrome DevTools > Lighthouse ile performans testi yapın.

## 📊 Performans

- **Lighthouse Score**: 90+
- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3s
- **Cumulative Layout Shift**: < 0.1

## 🔧 Teknik Detaylar

### JavaScript Özellikleri
- Intersection Observer ile scroll animasyonları
- Debounced search input
- Modal yönetimi
- Theme toggle
- Keyboard navigation

### CSS Özellikleri
- CSS Grid layout
- Flexbox components
- CSS Custom Properties
- Media queries
- Animation keyframes

### Jekyll Özellikleri
- Minima theme base
- SEO optimization
- Sitemap generation
- Feed generation

## 🎯 Kullanım Senaryoları

1. **Chrome Extension Vitrin**: Eklentinin tüm özelliklerini showcase etmek
2. **Portfolio Site**: Geliştirici portföyü olarak kullanmak
3. **Product Landing**: Ürün tanıtım sayfası
4. **Documentation Site**: Proje dokümantasyonu

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasına bakın.

## 👨‍💻 Geliştirici

**Adem İşler**
- GitHub: [@ademisler](https://github.com/ademisler)
- Website: [ademisler.com](https://ademisler.com)
- Email: [İletişim](mailto:contact@ademisler.com)

## 🙏 Teşekkürler

- [Jekyll](https://jekyllrb.com/) - Static site generator
- [Chrome Extension](https://developer.chrome.com/docs/extensions/) - Extension API
- [GitHub Pages](https://pages.github.com/) - Hosting platform

---

**Toolary GitHub Pages** - Modern, responsive ve kullanıcı dostu web sitesi 🚀

[![GitHub stars](https://img.shields.io/github/stars/ademisler/toolary.github.io?style=social)](https://github.com/ademisler/toolary.github.io)
[![GitHub forks](https://img.shields.io/github/forks/ademisler/toolary.github.io?style=social)](https://github.com/ademisler/toolary.github.io)
[![GitHub issues](https://img.shields.io/github/issues/ademisler/toolary.github.io)](https://github.com/ademisler/toolary.github.io/issues)
