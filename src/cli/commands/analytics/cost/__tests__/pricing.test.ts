/**
 * Pricing lookup unit tests
 */

import { describe, it, expect } from 'vitest';
import { lookupPrice } from '../pricing.js';

describe('lookupPrice', () => {
  it('returns a price for a known Claude model (per-1M USD)', () => {
    const p = lookupPrice('claude-sonnet-4-5-20250929');
    expect(p).not.toBeNull();
    expect(p!.input).toBeGreaterThan(0);
    expect(p!.output).toBeGreaterThan(0);
  });

  it('matches Bedrock-style names via normalization', () => {
    const p = lookupPrice('converse/global.anthropic.claude-haiku-4-5-20251001-v1:0');
    expect(p).not.toBeNull();
  });

  it('prefers the longest matching key (sonnet-4-5 over sonnet-4)', () => {
    const sonnet45 = lookupPrice('claude-sonnet-4-5');
    const sonnet4 = lookupPrice('claude-sonnet-4-0');
    expect(sonnet45).not.toBeNull();
    expect(sonnet4).not.toBeNull();
  });

  it('returns null for an unknown model', () => {
    expect(lookupPrice('totally-made-up-model')).toBeNull();
  });

  it('claude-opus-4-8 has cacheWrite1h of 10.0', () => {
    const p = lookupPrice('claude-opus-4-8');
    expect(p).not.toBeNull();
    expect(p!.cacheWrite1h).toBeCloseTo(10.0, 6);
  });

  it('claude-haiku-4-5 has cacheWrite1h of 2.0', () => {
    const p = lookupPrice('claude-haiku-4-5');
    expect(p).not.toBeNull();
    expect(p!.cacheWrite1h).toBeCloseTo(2.0, 6);
  });

  it('non-Anthropic model (gpt-5) has no cacheWrite1h', () => {
    const p = lookupPrice('gpt-5');
    expect(p).not.toBeNull();
    expect(p!.cacheWrite1h).toBeUndefined();
  });
});
