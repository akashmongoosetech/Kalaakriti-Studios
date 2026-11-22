const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const UPLOADS_ROOT = path.resolve(__dirname, '../uploads');
const AVATARS_DIR = path.join(UPLOADS_ROOT, 'avatars');

/**
 * Normalizes an Indian mobile number to its 10-digit local format (6-9 start) when possible.
 */
function normalizeIndianMobile(raw) {
  const digits = String(raw || '').replace(/\D/g, '');
  if (digits.length === 12 && digits.startsWith('91')) {
    return digits.slice(2);
  }
  if (digits.length === 11 && digits.startsWith('0')) {
    return digits.slice(1);
  }
  return digits;
}

function splitFullName(fullName) {
  const trimmed = String(fullName || '').trim().replace(/\s+/g, ' ');
  const parts = trimmed.split(' ');
  const firstName = parts[0] || trimmed;
  const lastName = parts.slice(1).join(' ');
  return { firstName, lastName, fullName: trimmed };
}

function generateContactId() {
  const year = new Date().getFullYear();
  const num = crypto.randomInt(1000, 9999);
  const suffix = crypto.randomBytes(1).toString('hex').toUpperCase();
  return `CNT-${year}-${num}${suffix}`;
}

function generateBookingReference() {
  const year = new Date().getFullYear();
  const num = crypto.randomInt(1000, 9999);
  const suffix = crypto.randomBytes(1).toString('hex').toUpperCase();
  return `KS-${year}-${num}${suffix}`;
}

function deriveUsername(firstName, lastName, email) {
  const base = `${firstName || ''}.${lastName || ''}`
    .toLowerCase()
    .replace(/[^a-z0-9.]/g, '')
    .replace(/\.+/g, '.')
    .replace(/^\.|\.$/g, '');

  if (base.length >= 3) {
    return base.slice(0, 32);
  }
  const emailPrefix = String(email || 'admin')
    .split('@')[0]
    .toLowerCase()
    .replace(/[^a-z0-9._-]/g, '');
  return (emailPrefix || 'studio.admin').slice(0, 32);
}

function escapeRegex(value) {
  return String(value || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Safely deletes a previously uploaded local avatar file only if it resolves
 * strictly inside backend/src/uploads/avatars/.
 */
function safeDeleteAvatarFile(avatarUrl) {
  if (!avatarUrl || typeof avatarUrl !== 'string') return;
  if (!avatarUrl.startsWith('/uploads/avatars/')) return;

  const fileName = path.basename(avatarUrl);
  if (!fileName || fileName === '.gitkeep') return;

  const resolvedPath = path.resolve(AVATARS_DIR, fileName);
  if (!resolvedPath.startsWith(AVATARS_DIR + path.sep)) {
    return;
  }

  fs.promises.unlink(resolvedPath).catch(() => {
    // Ignore missing file errors on cleanup
  });
}

function escapeCsvCell(value) {
  const raw = value === null || value === undefined ? '' : String(value);
  // Neutralize spreadsheet formula triggers (=, +, -, @, tab, CR)
  const neutralized = /^[=+\-@\t\r]/.test(raw) ? `'${raw}` : raw;
  const escaped = neutralized.replace(/"/g, '""');
  return `"${escaped}"`;
}

function buildCsv(headers, rows) {
  const headerLine = headers.map(escapeCsvCell).join(',');
  const dataLines = rows.map((row) => row.map(escapeCsvCell).join(','));
  return [headerLine, ...dataLines].join('\r\n');
}

module.exports = {
  UPLOADS_ROOT,
  AVATARS_DIR,
  normalizeIndianMobile,
  splitFullName,
  generateContactId,
  generateBookingReference,
  deriveUsername,
  escapeRegex,
  safeDeleteAvatarFile,
  escapeCsvCell,
  buildCsv,
};
