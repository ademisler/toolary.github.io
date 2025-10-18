// Simple icon creator using base64 data URLs
import fs from 'fs';

// Create a simple white layout-grid icon using base64 data
function createIconData(size) {
  // This creates a simple grey background with white grid
  // Using a minimal approach since we don't have image libraries
  
  const canvas = `
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24">
  <rect width="24" height="24" fill="#6c757d"/>
  <rect x="3" y="3" width="7" height="7" fill="#ffffff" stroke="#ffffff" stroke-width="1"/>
  <rect x="14" y="3" width="7" height="7" fill="#ffffff" stroke="#ffffff" stroke-width="1"/>
  <rect x="14" y="14" width="7" height="7" fill="#ffffff" stroke="#ffffff" stroke-width="1"/>
  <rect x="3" y="14" width="7" height="7" fill="#ffffff" stroke="#ffffff" stroke-width="1"/>
</svg>`;
  
  return canvas;
}

// Create icons for all sizes
const sizes = [16, 48, 128];

sizes.forEach(size => {
  const svgContent = createIconData(size);
  const filename = `extension/icons/icon${size}.png`;
  
  // For now, we'll create SVG files and you can convert them manually
  // or use the HTML generator we created earlier
  const svgFilename = `extension/icons/icon${size}.svg`;
  fs.writeFileSync(svgFilename, svgContent);
  console.log(`Created ${svgFilename}`);
});

console.log('SVG icons created. Use the HTML generator to convert to PNG.');
