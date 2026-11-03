#!/usr/bin/env node

// Keep the zone on the compatibility path: ECH and HTTP/3 are Chrome-facing
// features that intermittently fail on some filtering/middlebox networks.
const API = 'https://api.cloudflare.com/client/v4';
const zoneName = process.env.CLOUDFLARE_ZONE ?? 'avexel.co';
const required = { ech: 'off', http3: 'off' };
const args = new Set(process.argv.slice(2));
const apply = args.has('--apply');
const dnsOnly = args.has('--dns');

if (args.has('--help')) {
  console.log(`Usage: node tools/cloudflare-zone.mjs [--dns] [--apply]

  --dns    Check the public HTTPS record only (no API token needed).
  --apply  Turn ECH and HTTP/3 off if they are on.

Environment: CLOUDFLARE_API_TOKEN (zone settings read/edit), CLOUDFLARE_ZONE.`);
  process.exit(0);
}

async function checkDns() {
  const response = await fetch(`https://1.1.1.1/dns-query?name=${encodeURIComponent(zoneName)}&type=HTTPS`, {
    headers: { accept: 'application/dns-json' },
  });
  const body = await response.json();
  const record = (body.Answer ?? []).find(answer => answer.type === 65)?.data ?? '';
  const problems = [];
  if (record.includes('ech=')) problems.push('ECH');
  if (/\balpn="?[^"\s]*h3/.test(record)) problems.push('HTTP/3');
  console.log(`HTTPS ${zoneName}: ${record || '(no HTTPS record)'}`);
  if (problems.length) console.error(`The HTTPS record advertises ${problems.join(' and ')}; it should be h2 only.`);
  return problems.length === 0;
}

async function request(path, init) {
  const token = process.env.CLOUDFLARE_API_TOKEN;
  if (!token) throw new Error('CLOUDFLARE_API_TOKEN is required (or pass --dns for a tokenless check)');
  const response = await fetch(`${API}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...init?.headers,
    },
  });
  const body = await response.json();
  if (!body.success) throw new Error(body.errors?.map(error => error.message).join('; ') || `HTTP ${response.status}`);
  return body.result;
}

try {
  if (dnsOnly) process.exit(await checkDns() ? 0 : 1);

  const [zone] = await request(`/zones?name=${encodeURIComponent(zoneName)}`);
  if (!zone) throw new Error(`Zone ${zoneName} was not found`);

  let settingsOk = true;
  for (const [id, expected] of Object.entries(required)) {
    const setting = await request(`/zones/${zone.id}/settings/${id}`);
    if (setting.value === expected) {
      console.log(`${id}: ${setting.value}`);
      continue;
    }
    if (!apply) {
      console.error(`${id}: ${setting.value} (expected ${expected})`);
      settingsOk = false;
      continue;
    }
    const updated = await request(`/zones/${zone.id}/settings/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ value: expected }),
    });
    console.log(`${id}: ${setting.value} -> ${updated.value}`);
  }

  const dnsOk = await checkDns();
  if (apply && !dnsOk) console.log('DNS caches may advertise the old HTTPS record for up to 300 seconds.');
  process.exit(settingsOk && (dnsOk || apply) ? 0 : 1);
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}
