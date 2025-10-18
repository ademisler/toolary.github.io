import fs from 'fs';

// Simple icon creator using base64 data
function createIcon(size) {
  // Create SVG content for layout-grid icon
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24">
  <rect width="24" height="24" fill="#6c757d"/>
  <rect x="3" y="3" width="7" height="7" fill="#ffffff" stroke="#ffffff" stroke-width="1"/>
  <rect x="14" y="3" width="7" height="7" fill="#ffffff" stroke="#ffffff" stroke-width="1"/>
  <rect x="14" y="14" width="7" height="7" fill="#ffffff" stroke="#ffffff" stroke-width="1"/>
  <rect x="3" y="14" width="7" height="7" fill="#ffffff" stroke="#ffffff" stroke-width="1"/>
</svg>`;
  
  return svg;
}

// Create icons for all sizes
const sizes = [16, 48, 128];

console.log('Creating layout-grid icons...');

sizes.forEach(size => {
  const svgContent = createIcon(size);
  const filename = `extension/icons/icon${size}.svg`;
  fs.writeFileSync(filename, svgContent);
  console.log(`Created ${filename}`);
});

console.log('SVG icons created! Now converting to PNG...');

// Create a simple HTML file to convert SVG to PNG
const htmlContent = `<!DOCTYPE html>
<html>
<head>
    <title>Convert Icons</title>
    <style>
        body { font-family: Arial, sans-serif; padding: 20px; background: #f8f9fa; }
        .icon { margin: 20px 0; padding: 15px; background: white; border-radius: 8px; }
        canvas { border: 1px solid #ddd; margin: 10px 0; }
        button { background: #6c757d; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; margin: 5px; }
        button:hover { background: #5a6268; }
    </style>
</head>
<body>
    <h1>Layout Grid Icons - Convert to PNG</h1>
    <p>Click buttons to download PNG versions of the icons.</p>
    
    <div class="icon">
        <h3>16x16</h3>
        <canvas id="icon16" width="16" height="16"></canvas><br>
        <button onclick="downloadCanvas('icon16', 'icon16.png')">Download icon16.png</button>
    </div>
    
    <div class="icon">
        <h3>48x48</h3>
        <canvas id="icon48" width="48" height="48"></canvas><br>
        <button onclick="downloadCanvas('icon48', 'icon48.png')">Download icon48.png</button>
    </div>
    
    <div class="icon">
        <h3>128x128</h3>
        <canvas id="icon128" width="128" height="128"></canvas><br>
        <button onclick="downloadCanvas('icon128', 'icon128.png')">Download icon128.png</button>
    </div>
    
    <div class="icon">
        <button onclick="downloadAll()" style="background: #00BFFF; font-size: 16px; padding: 15px 30px;">Download All Icons</button>
    </div>

    <script>
        function drawIcon(canvasId, size) {
            const canvas = document.getElementById(canvasId);
            const ctx = canvas.getContext('2d');
            const scale = size / 24;
            
            // Clear with grey background
            ctx.fillStyle = '#6c757d';
            ctx.fillRect(0, 0, size, size);
            
            // Set white color for the grid
            ctx.strokeStyle = '#ffffff';
            ctx.fillStyle = '#ffffff';
            ctx.lineWidth = Math.max(2 * scale, 1);
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            
            // Draw the 4 grid squares
            const rects = [
                {x: 3, y: 3, w: 7, h: 7},
                {x: 14, y: 3, w: 7, h: 7},
                {x: 14, y: 14, w: 7, h: 7},
                {x: 3, y: 14, w: 7, h: 7}
            ];
            
            rects.forEach(rect => {
                const x = rect.x * scale;
                const y = rect.y * scale;
                const w = rect.w * scale;
                const h = rect.h * scale;
                
                // Fill with white
                ctx.globalAlpha = 1.0;
                ctx.fillRect(x, y, w, h);
                
                // Stroke with white
                ctx.globalAlpha = 1.0;
                ctx.strokeRect(x, y, w, h);
            });
        }
        
        function downloadCanvas(canvasId, filename) {
            const canvas = document.getElementById(canvasId);
            const link = document.createElement('a');
            link.download = filename;
            link.href = canvas.toDataURL('image/png');
            link.click();
        }
        
        function downloadAll() {
            downloadCanvas('icon16', 'icon16.png');
            setTimeout(() => downloadCanvas('icon48', 'icon48.png'), 100);
            setTimeout(() => downloadCanvas('icon128', 'icon128.png'), 200);
        }
        
        // Draw all icons on page load
        window.onload = function() {
            drawIcon('icon16', 16);
            drawIcon('icon48', 48);
            drawIcon('icon128', 128);
        };
    </script>
</body>
</html>`;

fs.writeFileSync('convert-icons.html', htmlContent);
console.log('Created convert-icons.html');
console.log('Open this file in your browser to convert SVG to PNG and download the icons.');