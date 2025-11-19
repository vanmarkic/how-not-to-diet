// WCAG Contrast Checker
// AA: 4.5:1 for normal text, 3:1 for large text
// AAA: 7:1 for normal text, 4.5:1 for large text

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
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

function checkWCAG(ratio, isLargeText = false) {
  const aaPass = isLargeText ? ratio >= 3 : ratio >= 4.5;
  const aaaPass = isLargeText ? ratio >= 4.5 : ratio >= 7;

  return {
    ratio: ratio.toFixed(2),
    aaPass,
    aaaPass,
    level: aaaPass ? 'AAA ✓✓' : aaPass ? 'AA ✓' : 'FAIL ✗'
  };
}

// Color palette from Layout.astro
const colors = {
  forestDeep: '#1a3d2e',
  forestMid: '#2d5a3d',
  kale: '#5b8c5a',
  sage: '#a8b5a0',
  beet: '#8b2e3f',
  carrot: '#e67e22',
  carrotLight: '#ff914d',
  carrotLighter: '#ffb380',
  golden: '#d4a574',
  cream: '#faf8f3',
  sand: '#f0ede5',
  stone: '#e8e4dc',
  charcoal: '#2c2c2c',
  slate: '#5a5a5a',
  white: '#ffffff'
};

console.log('\n=== WCAG Contrast Analysis ===\n');

// Test combinations used in the site
const tests = [
  { name: 'Header: Cream text on Forest Deep', fg: colors.cream, bg: colors.forestDeep, large: false },
  { name: 'Header: Cream text on Forest Mid', fg: colors.cream, bg: colors.forestMid, large: false },
  { name: 'Header Links: Carrot Light on Forest Deep (hover) ✨ FIXED', fg: colors.carrotLight, bg: colors.forestDeep, large: false },
  { name: 'Body: Charcoal text on Cream', fg: colors.charcoal, bg: colors.cream, large: false },
  { name: 'Body: Slate text on Cream (muted)', fg: colors.slate, bg: colors.cream, large: false },
  { name: 'Footer: Sand text on Forest Mid', fg: colors.sand, bg: colors.forestMid, large: false },
  { name: 'Footer: Sand text on Forest Deep', fg: colors.sand, bg: colors.forestDeep, large: false },
  { name: 'Footer Developer: Carrot Light on Forest Deep ✨ FIXED', fg: colors.carrotLight, bg: colors.forestDeep, large: false },
  { name: 'Footer Links: Cream on Forest Mid', fg: colors.cream, bg: colors.forestMid, large: false },
  { name: 'Footer Links Hover: Carrot Lighter on Forest Mid ✨ FIXED', fg: colors.carrotLighter, bg: colors.forestMid, large: false },
  { name: 'Logo: Cream on Forest Deep', fg: colors.cream, bg: colors.forestDeep, large: true },
  { name: 'Elevated BG: Charcoal on White', fg: colors.charcoal, bg: colors.white, large: false }
];

tests.forEach(test => {
  const ratio = getContrastRatio(test.fg, test.bg);
  const result = checkWCAG(ratio, test.large);

  console.log(`${test.name}`);
  console.log(`  Contrast: ${result.ratio}:1 - ${result.level}`);
  console.log('');
});

console.log('\n=== Legend ===');
console.log('AA ✓   - Meets WCAG AA (minimum)');
console.log('AAA ✓✓ - Meets WCAG AAA (enhanced)');
console.log('FAIL ✗ - Does not meet WCAG standards');
console.log('\nStandards:');
console.log('- Normal text: AA = 4.5:1, AAA = 7:1');
console.log('- Large text: AA = 3:1, AAA = 4.5:1');
console.log('');
