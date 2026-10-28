const storeTargets = new Set(['chromium-store', 'firefox']);
const replacements = new Map([
  ['index.html', [
    ['You may email me occasional updates about SlotDesk and our future projects. I can opt out at any time.',
      'You may email me occasional updates about SlotDesk. I can opt out at any time.', 2]
  ]],
  ['privacy.html', [
    ['whether you checked the optional project-updates box.',
      'whether you checked the optional SlotDesk-updates box.', 1],
    ['If you opted in, the owners may use your address for occasional updates about SlotDesk and their future projects;',
      'If you opted in, the owners may use your address for occasional updates about SlotDesk;', 1]
  ]]
]);

// Keep the unpacked beta source intact; only generated store payloads narrow consent.
export function storeDistributionFile(name, data, target) {
  if (!storeTargets.has(target) || !replacements.has(name)) return data;
  let text = new TextDecoder('utf-8', {fatal: true}).decode(data);
  for (const [before, after, expected] of replacements.get(name)) {
    const parts = text.split(before);
    if (parts.length - 1 !== expected) {
      throw new Error(`${target}: ${name} expected ${expected} updates-scope fragment(s); review store consent wording before packaging`);
    }
    text = parts.join(after);
  }
  return Buffer.from(text);
}
