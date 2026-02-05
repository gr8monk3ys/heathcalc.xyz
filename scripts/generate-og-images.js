const { spawnSync } = require('node:child_process');
const { mkdirSync, existsSync } = require('node:fs');

const outputRoot = 'public/images';
const calculatorsDir = `${outputRoot}/calculators`;
const blogDir = `${outputRoot}/blog`;
const ogDir = `${outputRoot}/og`;

mkdirSync(calculatorsDir, { recursive: true });
mkdirSync(blogDir, { recursive: true });
mkdirSync(ogDir, { recursive: true });

const magickBin = existsSync('/usr/local/opt/imagemagick-full/bin/magick')
  ? '/usr/local/opt/imagemagick-full/bin/magick'
  : 'magick';
const fontRegular = '/System/Library/Fonts/Helvetica.ttc';
const fontBold = '/System/Library/Fonts/HelveticaNeue.ttc';

const images = [
  {
    file: `${ogDir}/og-image.jpg`,
    title: 'HealthCheck',
    subtitle: 'Health & fitness calculators\nbacked by real formulas',
    accent: '#4f46e5',
  },
  {
    file: `${blogDir}/measuring-body-fat.jpg`,
    title: 'Measuring Body Fat',
    subtitle: 'Pros & cons of today\'s most popular methods',
    accent: '#10b981',
  },
  {
    file: `${blogDir}/calorie-deficit-myths.jpg`,
    title: 'Calorie Deficit Myths',
    subtitle: '5 misconceptions holding back your progress',
    accent: '#f59e0b',
  },
  {
    file: `${blogDir}/tdee-explained.jpg`,
    title: 'TDEE Explained',
    subtitle: 'How many calories you really need',
    accent: '#3b82f6',
  },
  {
    file: `${blogDir}/understanding-absi.jpg`,
    title: 'Understanding ABSI',
    subtitle: 'Beyond BMI for health risk insights',
    accent: '#ef4444',
  },
  {
    file: `${blogDir}/understanding-body-fat-percentage.jpg`,
    title: 'Body Fat Percentage',
    subtitle: 'What your numbers really mean',
    accent: '#10b981',
  },
  {
    file: `${blogDir}/waist-to-hip-ratio-guide.jpg`,
    title: 'Waist-to-Hip Ratio',
    subtitle: 'Understanding body shape & risk',
    accent: '#f59e0b',
  },
  {
    file: `${blogDir}/best-smart-scales-body-composition.jpg`,
    title: 'Best Smart Scales',
    subtitle: 'Top picks for body composition tracking',
    accent: '#10b981',
  },
  {
    file: `${blogDir}/best-fitness-trackers-calorie-tracking.jpg`,
    title: 'Best Fitness Trackers',
    subtitle: 'Accurate calorie burn & heart rate',
    accent: '#3b82f6',
  },
  {
    file: `${blogDir}/best-kitchen-scales-portion-control.jpg`,
    title: 'Best Kitchen Scales',
    subtitle: 'Portion control made precise',
    accent: '#f59e0b',
  },
  {
    file: `${blogDir}/best-fitness-apps-macro-tracking.jpg`,
    title: 'Best Fitness Apps',
    subtitle: 'Track macros and calories with ease',
    accent: '#6366f1',
  },
  {
    file: `${blogDir}/meal-delivery-services-weight-loss.jpg`,
    title: 'Meal Delivery for Weight Loss',
    subtitle: 'Calorie-smart meals delivered',
    accent: '#ef4444',
  },
  { file: `${calculatorsDir}/bmi-calculator.jpg`, title: 'BMI Calculator', subtitle: 'Calculate your body mass index', accent: '#3b82f6' },
  { file: `${calculatorsDir}/body-fat-calculator.jpg`, title: 'Body Fat Calculator', subtitle: 'Estimate body fat percentage', accent: '#10b981' },
  { file: `${calculatorsDir}/army-body-fat-calculator.jpg`, title: 'Army Body Fat', subtitle: 'Circumference method', accent: '#ef4444' },
  { file: `${calculatorsDir}/body-fat-burn-calculator.jpg`, title: 'Body Fat Burn', subtitle: 'Estimate calories burned', accent: '#ef4444' },
  { file: `${calculatorsDir}/tdee-calculator.jpg`, title: 'TDEE Calculator', subtitle: 'Total daily energy expenditure', accent: '#f59e0b' },
  { file: `${calculatorsDir}/calorie-calculator.jpg`, title: 'Calorie Calculator', subtitle: 'Daily calorie targets', accent: '#10b981' },
  { file: `${calculatorsDir}/calories-burned-calculator.jpg`, title: 'Calories Burned', subtitle: 'Workout calorie estimate', accent: '#3b82f6' },
  { file: `${calculatorsDir}/calories-burned-walking-calculator.jpg`, title: 'Calories Burned Walking', subtitle: 'Walking calorie estimate', accent: '#06b6d4' },
  { file: `${calculatorsDir}/calories-burned-running-calculator.jpg`, title: 'Calories Burned Running', subtitle: 'Running calorie estimate', accent: '#10b981' },
  { file: `${calculatorsDir}/calories-burned-cycling-calculator.jpg`, title: 'Calories Burned Cycling', subtitle: 'Cycling calorie estimate', accent: '#10b981' },
  { file: `${calculatorsDir}/calories-burned-swimming-calculator.jpg`, title: 'Calories Burned Swimming', subtitle: 'Swimming calorie estimate', accent: '#06b6d4' },
  { file: `${calculatorsDir}/calorie-deficit-calculator.jpg`, title: 'Calorie Deficit', subtitle: 'Plan your weight loss pace', accent: '#10b981' },
  { file: `${calculatorsDir}/weight-management-calculator.jpg`, title: 'Weight Management', subtitle: 'Build a sustainable plan', accent: '#3b82f6' },
  { file: `${calculatorsDir}/maximum-fat-loss-calculator.jpg`, title: 'Maximum Fat Loss', subtitle: 'Optimize cutting calories', accent: '#ef4444' },
  { file: `${calculatorsDir}/absi-calculator.jpg`, title: 'ABSI Calculator', subtitle: 'A Body Shape Index', accent: '#3b82f6' },
  { file: `${calculatorsDir}/whr-calculator.jpg`, title: 'Waist-to-Hip Ratio', subtitle: 'Assess fat distribution', accent: '#f59e0b' },
  { file: `${calculatorsDir}/waist-to-height-ratio-calculator.jpg`, title: 'Waist-to-Height Ratio', subtitle: 'Check central fat risk', accent: '#6366f1' },
  { file: `${calculatorsDir}/body-frame-size-calculator.jpg`, title: 'Body Frame Size', subtitle: 'Small, medium, or large frame', accent: '#06b6d4' },
  { file: `${calculatorsDir}/adjusted-body-weight-calculator.jpg`, title: 'Adjusted Body Weight', subtitle: 'Refine ideal weight estimates', accent: '#10b981' },
  { file: `${calculatorsDir}/conversions-calculator.jpg`, title: 'Conversions', subtitle: 'Unit conversions made easy', accent: '#3b82f6' },
  { file: `${calculatorsDir}/age-calculator.jpg`, title: 'Age Calculator', subtitle: 'Exact age in years & days', accent: '#06b6d4' },
  { file: `${calculatorsDir}/steps-to-miles-calculator.jpg`, title: 'Steps to Miles', subtitle: 'Convert steps to distance', accent: '#06b6d4' },
  { file: `${calculatorsDir}/steps-to-calories-calculator.jpg`, title: 'Steps to Calories', subtitle: 'Estimate calorie burn', accent: '#f59e0b' },
  { file: `${calculatorsDir}/macro-calculator.jpg`, title: 'Macro Calculator', subtitle: 'Protein, carbs, and fat targets', accent: '#6366f1' },
  { file: `${calculatorsDir}/carb-intake-calculator.jpg`, title: 'Carb Intake', subtitle: 'Daily carbs in grams', accent: '#f59e0b' },
  { file: `${calculatorsDir}/fat-intake-calculator.jpg`, title: 'Fat Intake', subtitle: 'Daily fat targets', accent: '#ef4444' },
  { file: `${calculatorsDir}/protein-calculator.jpg`, title: 'Protein Calculator', subtitle: 'Daily protein recommendations', accent: '#10b981' },
  { file: `${calculatorsDir}/one-rep-max-calculator.jpg`, title: 'One Rep Max', subtitle: 'Estimate your 1RM safely', accent: '#f59e0b' },
  { file: `${calculatorsDir}/blood-pressure-calculator.jpg`, title: 'Blood Pressure', subtitle: 'Understand your BP category', accent: '#ef4444' },
  { file: `${calculatorsDir}/heart-rate-zones-calculator.jpg`, title: 'Heart Rate Zones', subtitle: 'Train smarter with zones', accent: '#3b82f6' },
  { file: `${calculatorsDir}/target-heart-rate-calculator.jpg`, title: 'Target Heart Rate', subtitle: 'Find your training zone', accent: '#3b82f6' },
  { file: `${calculatorsDir}/water-intake-calculator.jpg`, title: 'Water Intake', subtitle: 'Daily hydration targets', accent: '#06b6d4' },
  { file: `${calculatorsDir}/sleep-calculator.jpg`, title: 'Sleep Calculator', subtitle: 'Optimize sleep cycles', accent: '#6366f1' },
  { file: `${calculatorsDir}/ideal-weight-calculator.jpg`, title: 'Ideal Weight', subtitle: 'Estimate a healthy range', accent: '#10b981' },
  { file: `${calculatorsDir}/body-surface-area-calculator.jpg`, title: 'Body Surface Area', subtitle: 'Estimate total BSA', accent: '#f472b6' },
  { file: `${calculatorsDir}/lean-body-mass-calculator.jpg`, title: 'Lean Body Mass', subtitle: 'Estimate lean mass', accent: '#10b981' },
  { file: `${calculatorsDir}/max-heart-rate-calculator.jpg`, title: 'Max Heart Rate', subtitle: 'Estimate your HR max', accent: '#3b82f6' },
  { file: `${calculatorsDir}/pregnancy-due-date-calculator.jpg`, title: 'Pregnancy Due Date', subtitle: 'Estimate your due date', accent: '#f472b6' },
  { file: `${calculatorsDir}/due-date-by-conception-calculator.jpg`, title: 'Due Date by Conception', subtitle: 'Estimate by conception date', accent: '#f472b6' },
  { file: `${calculatorsDir}/pregnancy-weight-gain-calculator.jpg`, title: 'Pregnancy Weight Gain', subtitle: 'Recommended gain ranges', accent: '#f472b6' },
  { file: `${calculatorsDir}/ovulation-calculator.jpg`, title: 'Ovulation Calculator', subtitle: 'Estimate fertile window', accent: '#f59e0b' },
  { file: `${calculatorsDir}/bmr-calculator.jpg`, title: 'BMR Calculator', subtitle: 'Calories burned at rest', accent: '#6366f1' },
  { file: `${calculatorsDir}/vo2-max-calculator.jpg`, title: 'VO2 Max', subtitle: 'Estimate cardio fitness', accent: '#3b82f6' },
  { file: `${calculatorsDir}/running-pace-calculator.jpg`, title: 'Running Pace', subtitle: 'Pace per mile & km', accent: '#10b981' },
  { file: `${calculatorsDir}/resting-heart-rate-calculator.jpg`, title: 'Resting Heart Rate', subtitle: 'Gauge fitness level', accent: '#06b6d4' },
];

function runMagick({ file, title, subtitle, accent }) {
  const args = [
    '-size',
    '1200x630',
    'gradient:#f0f2f5-#ffffff',
    '-gravity',
    'NorthWest',
    '-fill',
    'rgba(79,70,229,0.08)',
    '-draw',
    'roundrectangle 40,40 1160,590 32,32',
    '-fill',
    `rgba(${hexToRgb(accent)},0.18)`,
    '-draw',
    'circle 980,240 1180,240',
    '-fill',
    `rgba(${hexToRgb(accent)},0.12)`,
    '-draw',
    'circle 920,420 1050,420',
    '-fill',
    '#4f46e5',
    '-font',
    fontRegular,
    '-pointsize',
    '28',
    '-annotate',
    '+80+90',
    'HealthCheck',
    '-fill',
    '#111827',
    '-font',
    fontBold,
    '-pointsize',
    '64',
    '-interline-spacing',
    '8',
    '-annotate',
    '+80+190',
    title,
    '-fill',
    '#4b5563',
    '-font',
    fontRegular,
    '-pointsize',
    '30',
    '-interline-spacing',
    '4',
    '-annotate',
    '+80+280',
    subtitle,
    '-fill',
    accent,
    '-draw',
    'roundrectangle 80,420 430,480 18,18',
    '-fill',
    '#ffffff',
    '-font',
    fontBold,
    '-pointsize',
    '24',
    '-annotate',
    '+110+455',
    'Free Calculator',
    '-quality',
    '92',
    file,
  ];

  const result = spawnSync(magickBin, args, { stdio: 'inherit' });
  if (result.status !== 0) {
    throw new Error(`ImageMagick failed for ${file}`);
  }
}

function hexToRgb(hex) {
  const normalized = hex.replace('#', '');
  const bigint = parseInt(normalized, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `${r},${g},${b}`;
}

images.forEach(image => runMagick(image));
console.log(`Generated ${images.length} OG images.`);
