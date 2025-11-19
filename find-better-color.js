// Find the perfect accessible color for Forest Mid background

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

function rgbToHex(r, g, b) {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

function getLuminance(r, g, b) {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function getContrastRatio(color1, color2) {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);

  const lum1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
  const lum2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);

  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);

  return (lighter + 0.05) / (darker + 0.05);
}

const forestMid = '#2d5a3d';

console.log('Testing lighter orange shades on Forest Mid (#2d5a3d):\n');

const candidates = [
  '#ffa366',  // current (failing)
  '#ffb380',  // lighter
  '#ffc299',  // even lighter
  '#ffcc99',  // very light
  '#ffd6ad',  // lightest
];

candidates.forEach(color => {
  const ratio = getContrastRatio(color, forestMid);
  const pass = ratio >= 4.5 ? '✓ PASS' : '✗ FAIL';
  console.log(`${color}: ${ratio.toFixed(2)}:1 ${pass}`);
});

console.log('\nRecommendation: Use the first one that passes (lightest while maintaining orange hue)');
