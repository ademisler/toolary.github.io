// Lucide-inspired icon helper without external dependencies

const ICON_DEFINITIONS = {
  color: {
    title: 'Color',
    elements: [
      { tag: 'path', attrs: { d: 'M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z' } }
    ]
  },
  text: {
    title: 'Text',
    elements: [
      { tag: 'path', attrs: { d: 'M12 4v16' } },
      { tag: 'path', attrs: { d: 'M4 7V5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v2' } },
      { tag: 'path', attrs: { d: 'M9 20h6' } }
    ]
  },
  element: {
    title: 'Element',
    elements: [
      { tag: 'path', attrs: { d: 'M4.037 4.688a.495.495 0 0 1 .651-.651l16 6.5a.5.5 0 0 1-.063.947l-6.124 1.58a2 2 0 0 0-1.438 1.435l-1.579 6.126a.5.5 0 0 1-.947.063z' } }
    ]
  },
  screenshot: {
    title: 'Screenshot',
    elements: [
      { tag: 'path', attrs: { d: 'M13.997 4a2 2 0 0 1 1.76 1.05l.486.9A2 2 0 0 0 18.003 7H20a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1.997a2 2 0 0 0 1.759-1.048l.489-.904A2 2 0 0 1 10.004 4z' } },
      { tag: 'circle', attrs: { cx: 12, cy: 13, r: 3 } }
    ]
  },
  link: {
    title: 'Link',
    elements: [
      { tag: 'path', attrs: { d: 'M9 17H7A5 5 0 0 1 7 7h2' } },
      { tag: 'path', attrs: { d: 'M15 7h2a5 5 0 1 1 0 10h-2' } },
      { tag: 'line', attrs: { x1: 8, y1: 12, x2: 16, y2: 12 } }
    ]
  },
  font: {
    title: 'Font',
    elements: [
      { tag: 'path', attrs: { d: 'M15 11h4.5a1 1 0 0 1 0 5h-4a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h3a1 1 0 0 1 0 5' } },
      { tag: 'path', attrs: { d: 'm2 16 4.039-9.69a.5.5 0 0 1 .923 0L11 16' } },
      { tag: 'path', attrs: { d: 'M3.304 13h6.392' } }
    ]
  },
  image: {
    title: 'Image',
    elements: [
      { tag: 'rect', attrs: { x: 3, y: 3, width: 18, height: 18, rx: 2, ry: 2 } },
      { tag: 'circle', attrs: { cx: 9, cy: 9, r: 2 } },
      { tag: 'path', attrs: { d: 'm21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21' } }
    ]
  },
  media: {
    title: 'Media',
    elements: [
      { tag: 'path', attrs: { d: 'M20.2 6 3 11l-.9-2.4c-.3-1.1.3-2.2 1.3-2.5l13.5-4c1.1-.3 2.2.3 2.5 1.3Z' } },
      { tag: 'path', attrs: { d: 'M6.2 5.3 9.3 9.2' } },
      { tag: 'path', attrs: { d: 'M12.4 3.4l3.1 4' } },
      { tag: 'path', attrs: { d: 'M3 11h18v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z' } }
    ]
  },
  video: {
    title: 'Video',
    elements: [
      { tag: 'rect', attrs: { x: 2.5, y: 6.5, width: 13, height: 11, rx: 2, ry: 2 } },
      { tag: 'path', attrs: { d: 'M15.5 10.25 21.5 7.5v8l-6-2.75Z' } }
    ]
  },
  sun: {
    title: 'Sun',
    elements: [
      { tag: 'circle', attrs: { cx: 12, cy: 12, r: 4 } },
      { tag: 'path', attrs: { d: 'M12 2v2' } },
      { tag: 'path', attrs: { d: 'M12 20v2' } },
      { tag: 'path', attrs: { d: 'M4.93 4.93l1.41 1.41' } },
      { tag: 'path', attrs: { d: 'M17.66 17.66l1.41 1.41' } },
      { tag: 'path', attrs: { d: 'M2 12h2' } },
      { tag: 'path', attrs: { d: 'M20 12h2' } },
      { tag: 'path', attrs: { d: 'M6.34 17.66l-1.41 1.41' } },
      { tag: 'path', attrs: { d: 'M19.07 4.93l-1.41 1.41' } }
    ]
  },
  moon: {
    title: 'Moon',
    elements: [
      { tag: 'path', attrs: { d: 'M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z' } }
    ]
  },
  site: {
    title: 'Site information',
    elements: [
      { tag: 'circle', attrs: { cx: 12, cy: 12, r: 10 } },
      { tag: 'path', attrs: { d: 'M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20' } },
      { tag: 'path', attrs: { d: 'M2 12h20' } }
    ]
  },
  note: {
    title: 'Sticky note',
    elements: [
      { tag: 'path', attrs: { d: 'M15.5 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8.5L15.5 3Z' } },
      { tag: 'path', attrs: { d: 'M15 3v5h5' } },
      { tag: 'path', attrs: { d: 'M8 12h8' } },
      { tag: 'path', attrs: { d: 'M8 16h6' } },
      { tag: 'path', attrs: { d: 'M8 20h4' } }
    ]
  },
  notes: {
    title: 'Sticky notes',
    elements: [
      { tag: 'path', attrs: { d: 'M15.5 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8.5L15.5 3Z' } },
      { tag: 'path', attrs: { d: 'M15 3v5h5' } },
      { tag: 'path', attrs: { d: 'M8 12h8' } },
      { tag: 'path', attrs: { d: 'M8 16h6' } },
      { tag: 'path', attrs: { d: 'M8 20h4' } }
    ]
  },
  developer: {
    title: 'Developer',
    elements: [
      { tag: 'path', attrs: { d: 'M18 5a2 2 0 0 1 2 2v8.526a2 2 0 0 0 .212.897l1.068 2.127a1 1 0 0 1-.9 1.45H3.62a1 1 0 0 1-.9-1.45l1.068-2.127A2 2 0 0 0 4 15.526V7a2 2 0 0 1 2-2z' } },
      { tag: 'line', attrs: { x1: 3.946, y1: 15.987, x2: 20.054, y2: 15.987 } }
    ]
  },
  copy: {
    title: 'Copy',
    elements: [
      { tag: 'rect', attrs: { x: 8, y: 8, width: 14, height: 14, rx: 2, ry: 2 } },
      { tag: 'path', attrs: { d: 'M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2' } }
    ]
  },
  download: {
    title: 'Download',
    elements: [
      { tag: 'path', attrs: { d: 'M12 15V3' } },
      { tag: 'path', attrs: { d: 'M7 10l5 5 5-5' } },
      { tag: 'path', attrs: { d: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4' } }
    ]
  },
  export: {
    title: 'Export',
    elements: [
      { tag: 'path', attrs: { d: 'M12 2v13' } },
      { tag: 'path', attrs: { d: 'm16 6-4-4-4 4' } },
      { tag: 'path', attrs: { d: 'M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8' } }
    ]
  },
  pdf: {
    title: 'PDF',
    elements: [
      { tag: 'path', attrs: { d: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z' } },
      { tag: 'polyline', attrs: { points: '14,2 14,8 20,8' } },
      { tag: 'path', attrs: { d: 'M9 13h6' } },
      { tag: 'path', attrs: { d: 'M9 17h6' } }
    ]
  },
  favorite: {
    title: 'Favorite',
    elements: [
      { tag: 'path', attrs: { d: 'M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z' } }
    ]
  },
  star: {
    title: 'Star',
    elements: [
      { tag: 'path', attrs: { d: 'M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z' } }
    ]
  },
  trash: {
    title: 'Delete',
    elements: [
      { tag: 'path', attrs: { d: 'M3 6h18' } },
      { tag: 'path', attrs: { d: 'M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2' } },
      { tag: 'path', attrs: { d: 'M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6' } },
      { tag: 'path', attrs: { d: 'M10 11v6' } },
      { tag: 'path', attrs: { d: 'M14 11v6' } }
    ]
  },
  info: {
    title: 'Info',
    elements: [
      { tag: 'circle', attrs: { cx: 12, cy: 12, r: 10 } },
      { tag: 'path', attrs: { d: 'M12 16v-4' } },
      { tag: 'path', attrs: { d: 'M12 8h.01' } }
    ]
  },
  alert: {
    title: 'Warning',
    elements: [
      { tag: 'path', attrs: { d: 'm21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3' } },
      { tag: 'path', attrs: { d: 'M12 9v4' } },
      { tag: 'path', attrs: { d: 'M12 17h.01' } }
    ]
  },
  success: {
    title: 'Success',
    elements: [
      { tag: 'path', attrs: { d: 'M20 6 9 17l-5-5' } }
    ]
  },
  close: {
    title: 'Close',
    elements: [
      { tag: 'path', attrs: { d: 'M18 6 6 18' } },
      { tag: 'path', attrs: { d: 'M6 6l12 12' } }
    ]
  },
  plus: {
    title: 'Add',
    elements: [
      { tag: 'path', attrs: { d: 'M5 12h14' } },
      { tag: 'path', attrs: { d: 'M12 5v14' } }
    ]
  },
  palette: {
    title: 'Color Palette',
    elements: [
      { tag: 'circle', attrs: { cx: 13.5, cy: 6.5, r: 0.5, fill: 'currentColor' } },
      { tag: 'circle', attrs: { cx: 17.5, cy: 10.5, r: 0.5, fill: 'currentColor' } },
      { tag: 'circle', attrs: { cx: 8.5, cy: 7.5, r: 0.5, fill: 'currentColor' } },
      { tag: 'circle', attrs: { cx: 6.5, cy: 12.5, r: 0.5, fill: 'currentColor' } },
      { tag: 'path', attrs: { d: 'M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z' } }
    ]
  },
  highlighter: {
    title: 'Highlighter',
    elements: [
      { tag: 'path', attrs: { d: 'M9 11 4 3' } },
      { tag: 'path', attrs: { d: 'M14 9 20 3' } },
      { tag: 'path', attrs: { d: 'M20 3v4l-6 6' } },
      { tag: 'path', attrs: { d: 'M4 3h4l6 6' } },
      { tag: 'path', attrs: { d: 'M9 11l5 5-8 6V11Z' } }
    ]
  },
  'book-open': {
    title: 'Reading Mode',
    elements: [
      { tag: 'path', attrs: { d: 'M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z' } },
      { tag: 'path', attrs: { d: 'M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z' } }
    ]
  },
  qrcode: {
    title: 'QR Code',
    elements: [
      { tag: 'rect', attrs: { x: 3, y: 3, width: 18, height: 18, rx: 2 } },
      { tag: 'rect', attrs: { x: 5, y: 5, width: 4, height: 4 } },
      { tag: 'rect', attrs: { x: 15, y: 5, width: 4, height: 4 } },
      { tag: 'rect', attrs: { x: 5, y: 15, width: 4, height: 4 } },
      { tag: 'line', attrs: { x1: 11, y1: 5, x2: 11, y2: 9 } },
      { tag: 'line', attrs: { x1: 11, y1: 11, x2: 11, y2: 13 } },
      { tag: 'line', attrs: { x1: 11, y1: 15, x2: 11, y2: 19 } },
      { tag: 'line', attrs: { x1: 15, y1: 11, x2: 19, y2: 11 } },
      { tag: 'line', attrs: { x1: 15, y1: 15, x2: 19, y2: 15 } }
    ]
  },
  bookmark: {
    title: 'Bookmark',
    elements: [
      { tag: 'path', attrs: { d: 'M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z' } }
    ]
  },
  list: {
    title: 'List',
    elements: [
      { tag: 'line', attrs: { x1: 8, y1: 6, x2: 21, y2: 6 } },
      { tag: 'line', attrs: { x1: 8, y1: 12, x2: 21, y2: 12 } },
      { tag: 'line', attrs: { x1: 8, y1: 18, x2: 21, y2: 18 } },
      { tag: 'line', attrs: { x1: 3, y1: 6, x2: 3.01, y2: 6 } },
      { tag: 'line', attrs: { x1: 3, y1: 12, x2: 3.01, y2: 12 } },
      { tag: 'line', attrs: { x1: 3, y1: 18, x2: 3.01, y2: 18 } }
    ]
  },
  folder: {
    title: 'Folder',
    elements: [
      { tag: 'path', attrs: { d: 'M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z' } }
    ]
  },
  tag: {
    title: 'Tag',
    elements: [
      { tag: 'path', attrs: { d: 'M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z' } },
      { tag: 'line', attrs: { x1: 7, y1: 7, x2: 7.01, y2: 7 } }
    ]
  },
  edit: {
    title: 'Edit',
    elements: [
      { tag: 'path', attrs: { d: 'M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7' } },
      { tag: 'path', attrs: { d: 'M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z' } }
    ]
  },
  upload: {
    title: 'Upload',
    elements: [
      { tag: 'path', attrs: { d: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4' } },
      { tag: 'polyline', attrs: { points: '7,10 12,5 17,10' } },
      { tag: 'line', attrs: { x1: 12, y1: 5, x2: 12, y2: 15 } }
    ]
  },
  'file-text': {
    title: 'File Text',
    elements: [
      { tag: 'path', attrs: { d: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z' } },
      { tag: 'polyline', attrs: { points: '14,2 14,8 20,8' } },
      { tag: 'line', attrs: { x1: 16, y1: 13, x2: 8, y2: 13 } },
      { tag: 'line', attrs: { x1: 16, y1: 17, x2: 8, y2: 17 } },
      { tag: 'polyline', attrs: { points: '10,9 9,9 8,9' } }
    ]
  },
  play: {
    title: 'Play',
    elements: [
      { tag: 'polygon', attrs: { points: '5,3 19,12 5,21' } }
    ]
  },
  wrench: {
    title: 'Wrench',
    elements: [
      { tag: 'path', attrs: { d: 'M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z' } }
    ]
  },
  book: {
    title: 'Book',
    elements: [
      { tag: 'path', attrs: { d: 'M4 19.5A2.5 2.5 0 0 1 6.5 17H20' } },
      { tag: 'path', attrs: { d: 'M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z' } }
    ]
  },
  sparkles: {
    title: 'AI Sparkles',
    elements: [
      { tag: 'path', attrs: { d: 'M12 3v4' } },
      { tag: 'path', attrs: { d: 'M16 7l-4-4-4 4' } },
      { tag: 'path', attrs: { d: 'M12 21v-4' } },
      { tag: 'path', attrs: { d: 'M8 17l4 4 4-4' } },
      { tag: 'path', attrs: { d: 'M3 12h4' } },
      { tag: 'path', attrs: { d: 'M21 12h-4' } }
    ]
  },
  brain: {
    title: 'AI Brain',
    elements: [
      { tag: 'path', attrs: { d: 'M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z' } },
      { tag: 'path', attrs: { d: 'M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z' } },
      { tag: 'path', attrs: { d: 'M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4' } },
      { tag: 'path', attrs: { d: 'M17.599 6.5a3 3 0 0 0 .399-1.375' } },
      { tag: 'path', attrs: { d: 'M6.003 5.125A3 3 0 0 0 6.401 6.5' } },
      { tag: 'path', attrs: { d: 'M3.477 10.896a4 4 0 0 1 .585-.396' } },
      { tag: 'path', attrs: { d: 'M19.938 10.5a4 4 0 0 1 .585.396' } },
      { tag: 'path', attrs: { d: 'M6 18a4 4 0 0 1-1.967-.516' } },
      { tag: 'path', attrs: { d: 'M19.967 17.484A4 4 0 0 1 18 18' } }
    ]
  },
  languages: {
    title: 'Languages',
    elements: [
      { tag: 'circle', attrs: { cx: 12, cy: 12, r: 10 } },
      { tag: 'path', attrs: { d: 'M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z' } },
      { tag: 'path', attrs: { d: 'M2 12h20' } }
    ]
  },
  email: {
    title: 'Email',
    elements: [
      { tag: 'rect', attrs: { x: '2', y: '4', width: '20', height: '16', rx: '2' } },
      { tag: 'path', attrs: { d: 'M22 7l-10 6L2 7' } }
    ]
  },
  'search-check': {
    title: 'SEO Analyzer',
    elements: [
      { tag: 'circle', attrs: { cx: '11', cy: '11', r: '8' } },
      { tag: 'path', attrs: { d: 'm21 21-4.35-4.35' } },
      { tag: 'path', attrs: { d: 'm9 11 2 2 4-4' } }
    ]
  },
  'message': {
    title: 'Message',
    elements: [
      { tag: 'path', attrs: { d: 'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z' } }
    ]
  },
  'clipboard-list': {
    title: 'Clipboard List',
    elements: [
      { tag: 'rect', attrs: { x: 8, y: 2, width: 8, height: 4, rx: 1 } },
      { tag: 'path', attrs: { d: 'M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2' } },
      { tag: 'path', attrs: { d: 'M9 12h6' } },
      { tag: 'path', attrs: { d: 'M9 16h6' } },
      { tag: 'path', attrs: { d: 'M9 8h6' } }
    ]
  }
};

const DEFAULT_ICON = {
  title: 'Item',
  elements: [
    { tag: 'circle', attrs: { cx: 12, cy: 12, r: 9 } }
  ]
};

function buildSvg(definition, options = {}) {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('fill', 'none');
  svg.setAttribute('stroke', 'currentColor');
  svg.setAttribute('stroke-width', options.strokeWidth ?? 1.8);
  svg.setAttribute('stroke-linecap', 'round');
  svg.setAttribute('stroke-linejoin', 'round');
  const size = options.size ?? 20;
  svg.setAttribute('width', String(size));
  svg.setAttribute('height', String(size));
  if (options.className) svg.setAttribute('class', options.className);
  const aria = options.decorative === false ? 'img' : 'presentation';
  svg.setAttribute('role', aria);
  svg.setAttribute('aria-hidden', options.decorative === false ? 'false' : 'true');

  const titleText = options.decorative === false ? (options.title || definition.title) : undefined;
  if (titleText) {
    const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
    title.textContent = titleText;
    svg.appendChild(title);
  }

  (definition.elements || []).forEach(({ tag, attrs }) => {
    const el = document.createElementNS('http://www.w3.org/2000/svg', tag);
    Object.entries(attrs || {}).forEach(([key, value]) => {
      el.setAttribute(key, String(value));
    });
    svg.appendChild(el);
  });

  return svg;
}

export function getIconDefinition(name) {
  if (!name) return DEFAULT_ICON;
  return ICON_DEFINITIONS[name] || DEFAULT_ICON;
}

export function createIconElement(name, options = {}) {
  const definition = getIconDefinition(name);
  const svg = buildSvg(definition, options);
  svg.classList.add('toolary-icon');
  return svg;
}

export function renderIcon(name, options = {}) {
  return createIconElement(name, options);
}

export function getIconSvg(name, options = {}) {
  const definition = getIconDefinition(name);
  const svg = buildSvg(definition, { size: options.size ?? 18, decorative: options.decorative ?? true });
  svg.classList.add('toolary-icon');
  return new XMLSerializer().serializeToString(svg);
}

export const ICON_NAMES = Object.keys(ICON_DEFINITIONS);
