const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function generateFavicons() {
  const svgBuffer = fs.readFileSync(path.join(__dirname, '../assets/favicon.svg'));
  const publicDir = path.join(__dirname, '../public');

  // Generate PNG favicons
  const sizes = [
    { size: 16, name: 'favicon-16x16.png' },
    { size: 32, name: 'favicon-32x32.png' },
    { size: 180, name: 'apple-touch-icon.png' },
    { size: 192, name: 'android-chrome-192x192.png' },
    { size: 512, name: 'android-chrome-512x512.png' },
  ];

  for (const { size, name } of sizes) {
    await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toFile(path.join(publicDir, name));
    console.log(`✅ Generated ${name}`);
  }

  // Copy SVG as safari-pinned-tab.svg
  fs.copyFileSync(
    path.join(__dirname, '../assets/favicon.svg'),
    path.join(publicDir, 'safari-pinned-tab.svg')
  );
  console.log('✅ Generated safari-pinned-tab.svg');

  // Generate ICO from 32x32 PNG
  await sharp(svgBuffer)
    .resize(32, 32)
    .toFile(path.join(publicDir, 'favicon.ico'));
  console.log('✅ Generated favicon.ico');

  console.log('\n✨ All favicons generated successfully!');
}

generateFavicons().catch(console.error);