import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { redact } from '@ayos/observability';

const root = resolve(import.meta.dirname, '../..');
const securitySql = readFileSync(
  resolve(root, 'supabase/migrations/20260720000300_security_realtime_jobs.sql'),
  'utf8',
);
const domainSql = readFileSync(
  resolve(root, 'supabase/migrations/20260720000200_domain_rpcs.sql'),
  'utf8',
);
const geospatialSql = readFileSync(
  resolve(root, 'supabase/migrations/20260720000500_geospatial_ai.sql'),
  'utf8',
);

describe('cross-cutting security controls', () => {
  it('enables RLS and private realtime/storage authorization', () => {
    expect(securitySql).toContain('enable row level security');
    expect(securitySql).toContain('alter table realtime.messages enable row level security');
    expect(securitySql).toMatch(/insert into storage\.buckets\(id,name,public,[^)]+\) values/);
    expect(securitySql.match(/false,\d+,array\[/g)?.length).toBe(6);
  });
  it('blocks permanent deletion and makes sensitive commands security definers', () => {
    expect(domainSql).toContain('PERMANENT_DELETION_BLOCKED');
    expect(domainSql.match(/security definer/g)?.length).toBeGreaterThan(8);
  });
  it('redacts tokens, passwords, OTPs, messages, and precise location', () => {
    expect(
      redact({ token: 'x', password: 'x', otp: '123456', messageBody: 'private', longitude: 121 }),
    ).toEqual({
      token: '[REDACTED]',
      password: '[REDACTED]',
      otp: '[REDACTED]',
      messageBody: '[REDACTED]',
      longitude: '[REDACTED]',
    });
  });
  it('uses PostGIS eligibility before recommendation priority', () => {
    expect(geospatialSql).toContain('create extension if not exists postgis');
    expect(geospatialSql).toContain('extensions.st_dwithin');
    expect(geospatialSql).toMatch(
      /suitability_score desc, distance_meters asc, recommendation_priority desc/,
    );
    expect(geospatialSql.match(/using gist/g)?.length).toBeGreaterThanOrEqual(4);
  });
});
