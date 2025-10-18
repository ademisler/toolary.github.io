import fs from 'fs';
import { createCanvas } from 'canvas';

// Check if canvas is available
let canvas;
try {
  const { createCanvas } = await import('canvas');
  canvas = createCanvas;
} catch (error) {
  console.log('Canvas not available, creating HTML generator instead...');
  createHTMLGenerator();
  process.exit(0);
}

function createHTMLGenerator() {
  const htmlContent = `<!DOCTYPE html>
<html>
<head>
    <title>Toolary Grey Icons Generator</title>
    <style>
        body { 
            font-family: Arial, sans-serif; 
            padding: 20px; 
            background: #f8f9fa; 
        }
        .icon { 
            margin: 20px 0; 
            padding: 15px; 
            background: white; 
            border-radius: 8px; 
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        canvas { 
            border: 1px solid #e1e5e9; 
            margin: 10px 0; 
            background: #6c757d;
        }
        button { 
            background: #6c757d; 
            color: white; 
            border: none; 
            padding: 10px 20px; 
            border-radius: 6px; 
            cursor: pointer; 
            margin: 5px; 
        }
        button:hover { 
            background: #5a6268; 
        }
    </style>
</head>
<body>
    <h1>Toolary Layout Grid Icons - Grey Theme</h1>
    <p>Gri arka plan üzerinde beyaz layout-grid ikonları oluşturuluyor.</p>
    
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
        <button onclick="downloadAll()">Download All Icons</button>
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
                ctx.globalAlpha = 0.9;
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

  fs.writeFileSync('grey-icons-generator.html', htmlContent);
  console.log('Created grey-icons-generator.html');
  console.log('Open this file in your browser to generate the grey icons.');
}

// If canvas is available, create the icons directly
if (canvas) {
  function drawIcon(size) {
    const canvasElement = canvas(size, size);
    const ctx = canvasElement.getContext('2d');
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
        ctx.globalAlpha = 0.9;
        ctx.fillRect(x, y, w, h);
        
        // Stroke with white
        ctx.globalAlpha = 1.0;
        ctx.strokeRect(x, y, w, h);
    });
    
    return canvasElement;
  }
  
  // Create icons
  const sizes = [16, 48, 128];
  sizes.forEach(size => {
    const icon = drawIcon(size);
    const buffer = icon.toBuffer('image/png');
    fs.writeFileSync(`extension/icons/icon${size}.png`, buffer);
    console.log(`Created icon${size}.png`);
  });
  
  console.log('All grey icons created successfully!');
}
