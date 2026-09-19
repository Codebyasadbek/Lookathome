# Декоратор сайти — верстка

## Ish tartibi (MAJBURIY: token va agentlarni tejash)
- Subagent (Agent tool) ishlatma — hammasini o'zing, to'g'ridan-to'g'ri qil.
- Figma'dan faqat kerakli node'ni so'ra. Katta frame/page uchun `get_design_context` yoki `get_metadata` chaqirma — kerakli section node-id bo'yicha ol.
- Bir marta olingan ma'lumotni qayta so'rama (quyidagi node-id va o'lchamlardan foydalan).
- Skrinshotlarni kichik o'lchamda ko'r, faqat kerak bo'lsa.
- Uzun tushuntirishlar yozma, qisqa hisobot ber.
- Sahifalarni ketma-ket qil: har bir sahifani maket bilan to'liq solishtir, farqlarni tuzat va tasdiq kutmasdan keyingisiga o't (foydalanuvchi talabi). Oxirida umumiy hisobot.

## Kod sifati (ENG MUHIMI)
- Hamma kod clean code bo'lishi shart: semantik HTML, BEM nomlash, takrorlanmaydigan SCSS (mixin/o'zgaruvchilar), sodda va o'qiladigan JS, keraksiz fayl/kod yo'q.
- Verstka backend (Bitrix adminka) ulanganda BUZILMASLIGI kerak: matn/element ko'payishi yoki uzayishi hech narsani sindirmasin.
  - `position: absolute` faqat dekorativ qatlamlar (fon rasmi, overlay, modal/menyu) uchun; kontent joylashuvi — flex/grid oqimida.
  - Kontent bloklariga qat'iy `height` / `min-height` hiylalari, `white-space: nowrap` (tugmalardan tashqari) qo'yilmaydi.
  - Rasmlar — `aspect-ratio` + `object-fit: cover`, har qanday o'lchamdagi rasm kelishi mumkin.
- Maket bilan solishtirish — skrinshotsiz, kod orqali: headless Chrome'da elementlar koordinatalarini Figma metadata qiymatlari bilan raqamlar bo'yicha solishtirish.
  - TO'LIQ tekshirish: har bir Figma tuguni (matn, rasm, kartochka, punkt) × 5 breakpoint + har bir matn stili (shrift, o'lcham, line-height, letter-spacing, rang). Tanlab tekshirish yetarli emas.
  - Instance (komponent) ichidagi matnlar metadata'da yo'q — aniq belgilarni (`&nbsp;` bilan) `use_figma` read-only skripti orqali `characters`'dan olish.
  - Headless Chrome: CSS mask ikonkalar `file://`'da faqat `--allow-file-access-from-files` bilan chiqadi; transition/akkordeon animatsiyasini `--virtual-time-budget` emas, DevTools protokoli (haqiqiy render) bilan tekshirish.
  - Matnlarni Figma metadata'dagi nomdan olish: dizayner `&nbsp;`'lari (qisqa so'zlardan keyin) satrlar bo'linishiga ta'sir qiladi — aynan ko'chiriladi (faqat raqamlar ichidagi probel bog'lanadi: 10&nbsp;000).

## Talablar (mijozdan)
- Bootstrap grid, sof JS (jQuery YO'Q), slider — Swiper (yoki slick), stillar — SCSS.
- Pixel perfect 1:1 (Figma bo'yicha).
- Yuqori qatordagi barcha sahifalar + pastki qatordan faqat bitta portfolio sahifasi (Bitrix'ga konstruktor sifatida integratsiya qilinadi).

## Figma
- fileKey: `57kPCFwhqMJup84BTotzRG`
- Main: 1920 `2176:1389`, 960 `2176:1199`, 768 `2176:1013`, 480 `2176:818`, 360 `2176:626`
- About: 1920 `2176:561`, 960 `2176:1809`, 768 `2176:1726`, 480 `2176:1658`, 360 `2176:1590`
- Services: 1920 `2176:2158`, 960 `2176:2267`, 768 `2176:3797`, 480 `2176:2229`, 360 `2176:2191`
- Interiors: 1920 `2176:2014`, 960 `2176:3647`, 768 `2176:3507`, 480 `2176:2763`, 360 `2176:2311`
- Yacht: 1920 `2176:2094`, 960 `2176:3273`, 768 `2176:3019`, 480 `2176:2681`, 360 `2176:2434`
- Study: 1920 `2176:1949`, 960 `2176:3422`, 768 `2176:3193`, 480 `2176:2940`, 360 `2176:2570`
- Portfolio: 1920 `2176:1887`, 960 `2176:3361`, 768 `2176:3136`, 480 `2176:2886`, 360 `2176:2516`
- Partners `2202:1917` (faqat 1920), Project 1 `2261:3322` (1920), modules (loyiha sahifasi bloklari): 1920 `2269:2990`, 960 `2269:2930`, 768 `2269:2875`, 480 `2269:2822`, 360 `2269:2759`
- form popup `2125:441`, thanks popup `2125:433`, mobile menu `2176:1802`, elements (hover) `2293:2733`, fonts `2293:2788`

## Dizayn tokenlari
- Ranglar: bg `#F4ECE1`, taupe `#D3C2AF`, brown `#3F1F0E`, soft brown `#856341`, orange `#60372B`, accent `#AC7F5E`, error `#A22A07`, chiziqlar `rgba(133,99,65,.3/.4)`
- Shriftlar: Tenor Sans (sarlavhalar), Raleway (matn 14/1.4, ls -1%)
- H1 62/1.1 ls -4% uppercase (768: 48, 480: 32, 360: 24); H2 37/1.2 ls -3% (480: 32, 360: 24); H3 24/1.2 (360: 20)
- Breakpointlar: xs <480 (360 maket), sm 480, md 768, lg 960, xl 1280+ (1920 maket). Container: 1218 + 20px padding, gutter 30.

## Ichki sahifalar (About'dan boshlab)
- Header: `.header--solid` (fon #60372B, oqimda). Boshlanishi: `.page-head` (breadcrumbs + H1), padding-top 80 / 100 (md+) — barcha ichki sahifalarda bir xil.
- Breadcrumbs → H1 masofasi sahifaga qarab har xil (maket bo'yicha): 40 (About, Portfolio), 30 (Services, Study), 20 (Yacht, Interiors, Partners) — `.page-head__title` + sahifa bloki mix-klassi (`.overview__title`).
- Umumiy: `.point` (strelkali punkt), `.checklist` (01, 02… raqamli ro'yxat, CSS counter), `.fact` + `.modes` (Формат работы / Результат / Стоимость), `.section-head__label--soft`, `.audience--compact/--inline`, `.checklist--flush/--aligned`, `.brief` (Yacht va Partners boshi); mixinlar `between`, `label`, `big-num`, `h3-static`, `accordion-body`, `accordion-icon`; akkordeon JS bir punktda bir nechta `[data-accordion-body]`ni qo'llaydi. Ketma-ket ikki `.section--taupe` — umumiy fon, ikkinchisida padding-top 0.
- CTA: `.cta--text` (matnli, padding 200), `.cta--quote` (About: qoraytirilgan foto), `.cta--row` (Study: sarlavha chapda, tugma o'ngda); bejeviy bo'limdan keyin margin 0.
- Loyiha sahifasi (konstruktor): `project.html` (Project 1) + `project-modules.html` (12 modul katalogi, rasmlar — joy-belgilar). Modullar: `.case` (+`--portrait`, video bilan), `.case-note` (txt), `.shots--{portrait-7-5|landscape-7-5|portrait-4-8|landscape-4-8|mixed-4-8|portrait-6-6|landscape-12|portrait-8|video}`, `.video`. 12 ustunli grid (`grid-12`, `$shots-gap`), rasmlar o'z proporsiyasida (`width/height` atributlari — CMS beradi).
- Portfolio: `.showcase`, `.filter` (vkladkalar, <768 — ochiladigan ro'yxat, JS `data-filter`), `.projects`, `.project-card`. Study: `.study`, `.tracks`, `.curriculum`, `.consult`. Yacht/Partners: `.brief`, `.scope`, `.why`.
- Tekshiruv: `compare.py` matnlar uchun `LINE+N` ham chiqaradi (satr Figma'dagidan uzun → boshqa bo'linish); `overflow.py` ekrandan chiqqan matn satrlarini ham topadi (uzun `&nbsp;` zanjirlari).
- Matn harf oralig'i: dizayn-tizim `txt` = +1% (ichki sahifalar), bosh sahifada −1% → `<body class="theme-home">` (`--txt-ls`, `--label-color`).
- Bo'limlar orasidagi masofa: `$section-space` (60/80/100/200), `@include section-space(...)`; fonli bo'lim — `.section.section--taupe`.
- Maket xatolarini aniqlash: bir xil komponentni boshqa sahifa/breakpointlar bilan solishtirish (masalan, CTA→footer barcha sahifalarda 768'da 80).
- Tolerans: geometriya ±2px; shrift va ranglar aynan. Freym ichida izchil bo'lgan o'ziga xos oraliqlar ham takrorlanadi (blok faylida `// … (макет)` izohi bilan): Yacht 360 — 480 oraliqlari (.brief, .audience--compact, .scope, .why); .scope 354/275 (1920), 69 (960); About: .story 227 (1920), .approach 80 (768), .intro 60/80 (360/960); Services .directions 80/80 (360), 55 (960); FAQ 9px (480); Study 110 (1920), sarlavhalar 233 (768); Portfolio 60 (360), 20 (480); .case shapka 40/60/80/100; CTA `--text` min-height 696. Freym o'ziga zid bo'lsa (so'z bo'linishi, bloklar ustma-ust, matn blokdan/ekrandan chiqishi, standart Inter shrifti) — mantiqiy variant, hisobotda maket xatosi sifatida.
- Interiors formatlari: 768/960'da ochiq punkt o'z ustunlarida (`.is-open`, `only(md|lg)`), o'tish animatsiyali.

## Struktura
- npm/package.json ISHLATILMAYDI. SCSS → CSS: VS Code "Live Sass Compiler" (`.vscode/settings.json`, `scss/main.scss` → `css/main.css`).
- `index.html` — bosh sahifa; `scss/` (bloklar `scss/blocks/`); `js/main.js`; `img/`
- Vendor fayllar loyiha ichida: `scss/vendor/bootstrap/` (grid uchun), `js/vendor/swiper-bundle.min.js`, `css/vendor/swiper-bundle.min.css`
