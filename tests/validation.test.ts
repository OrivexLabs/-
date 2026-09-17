/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { defaultLoganReport } from '../src/data/fengshuiData';
import { parseAndValidateReport } from '../server/report-validation';
import { RequestValidationError, validateAnalysisRequest } from '../server/validation';

describe('request validation', () => {
  it('normalizes valid fields', () => {
    assert.deepEqual(validateAnalysisRequest({
      orientation: ' 坐北朝南 ',
      layoutDesc: ' 两室一厅 ',
      environmentDesc: ' 临近公园 ',
    }), {
      orientation: '坐北朝南',
      layoutDesc: '两室一厅',
      environmentDesc: '临近公园',
    });
  });

  it('rejects missing, wrong-type, and overlong fields', () => {
    assert.throws(() => validateAnalysisRequest({}), (error: unknown) => {
      return error instanceof RequestValidationError && error.field === 'orientation' && error.reason === 'required';
    });
    assert.throws(() => validateAnalysisRequest({ orientation: 1, layoutDesc: 'x', environmentDesc: 'x' }), (error: unknown) => {
      return error instanceof RequestValidationError && error.reason === 'type';
    });
    assert.throws(() => validateAnalysisRequest({ orientation: 'x'.repeat(257), layoutDesc: 'x', environmentDesc: 'x' }), (error: unknown) => {
      return error instanceof RequestValidationError && error.reason === 'too_long';
    });
  });
});

describe('model response validation', () => {
  it('accepts the repository fixture report', () => {
    const parsed = parseAndValidateReport(JSON.stringify(defaultLoganReport));
    assert.equal(parsed.scores.comfort, defaultLoganReport.scores.comfort);
  });

  it('rejects malformed or structurally unsafe model output', () => {
    assert.throws(() => parseAndValidateReport('not-json'));
    assert.throws(() => parseAndValidateReport(JSON.stringify({ ...defaultLoganReport, scores: { ...defaultLoganReport.scores, comfort: 101 } })));
    assert.throws(() => parseAndValidateReport(JSON.stringify({ ...defaultLoganReport, internalFengShui: { rooms: [{ key: 'shell' }] } })));
  });
});
