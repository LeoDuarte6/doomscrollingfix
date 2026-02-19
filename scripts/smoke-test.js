#!/usr/bin/env node
/**
 * Smoke test: validates that all files referenced in manifest.json exist.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const manifestPath = path.join(ROOT, 'manifest.json');

if (!fs.existsSync(manifestPath)) {
  console.error('❌ manifest.json not found');
  process.exit(1);
}

const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
const errors = [];

function checkFile(filePath, context) {
  const full = path.join(ROOT, filePath);
  if (!fs.existsSync(full)) {
    errors.push(`Missing: ${filePath} (referenced in ${context})`);
  }
}

// Check icons
if (manifest.icons) {
  for (const [size, file] of Object.entries(manifest.icons)) {
    checkFile(file, `icons.${size}`);
  }
}

// Check action icons
if (manifest.action?.default_icon) {
  for (const [size, file] of Object.entries(manifest.action.default_icon)) {
    checkFile(file, `action.default_icon.${size}`);
  }
}

// Check background service worker
if (manifest.background?.service_worker) {
  checkFile(manifest.background.service_worker, 'background.service_worker');
}

// Check content scripts
if (manifest.content_scripts) {
  for (const cs of manifest.content_scripts) {
    for (const jsFile of cs.js || []) {
      checkFile(jsFile, 'content_scripts.js');
    }
    for (const cssFile of cs.css || []) {
      checkFile(cssFile, 'content_scripts.css');
    }
  }
}

// Check options page
if (manifest.options_page) {
  checkFile(manifest.options_page, 'options_page');
}

// Check web accessible resources
if (manifest.web_accessible_resources) {
  for (const war of manifest.web_accessible_resources) {
    for (const resource of war.resources || []) {
      checkFile(resource, 'web_accessible_resources');
    }
  }
}

if (errors.length > 0) {
  console.error('❌ Smoke test failed:\n');
  errors.forEach(e => console.error(`  • ${e}`));
  process.exit(1);
} else {
  console.log('✅ Smoke test passed — all manifest-referenced files exist.');
}
