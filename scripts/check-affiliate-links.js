const { readFileSync } = require('node:fs');
const { resolve } = require('node:path');

const affiliatesPath = resolve(__dirname, '../src/constants/affiliates.ts');

try {
  const contents = readFileSync(affiliatesPath, 'utf8');
  const pendingMatches = contents.match(/PENDING_DIRECT_PARTNER_URL/g) || [];

  if (pendingMatches.length > 0) {
    // Keep this as a warning only so local builds still run.
    console.warn(
      `\n[affiliate-check] ${pendingMatches.length} direct partner links are still pending.\n` +
        '[affiliate-check] Replace PENDING_DIRECT_PARTNER_URL entries in src/constants/affiliates.ts before launch.\n'
    );
  }
} catch (error) {
  console.warn(
    '[affiliate-check] Unable to read src/constants/affiliates.ts. Skipping affiliate link check.'
  );
}
