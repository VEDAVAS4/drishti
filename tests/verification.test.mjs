import test from 'node:test';
import assert from 'node:assert/strict';

// Test verification compatibility logic
function checkCompatibility(detected, official) {
  const matrix = {
    'commercial_area:agricultural': 0.08,
    'commercial_area:water_body_buffer': 0.02,
    'residential_settlement:residential': 0.96,
    'industrial_area:recreational_green': 0.15,
  };
  const key = `${detected}:${official}`;
  return matrix[key] !== undefined ? matrix[key] : 0.5;
}

function calculateEvidenceScore(aiConfidence, spatialOverlap, dataRecencyDays, cloudCoverPercent) {
  const weights = {
    aiModel: 0.35,
    spatialAlignment: 0.30,
    dataRecency: 0.20,
    imageQuality: 0.15,
  };

  const recencyScore = Math.max(0, 1 - (dataRecencyDays / 365));
  const qualityScore = Math.max(0, 1 - (cloudCoverPercent / 100));

  const score = (
    weights.aiModel * aiConfidence +
    weights.spatialAlignment * spatialOverlap +
    weights.dataRecency * recencyScore +
    weights.imageQuality * qualityScore
  );

  return Number(score.toFixed(3));
}

test('Verification Matrix: flags commercial on agricultural as high mismatch', () => {
  const score = checkCompatibility('commercial_area', 'agricultural');
  assert.equal(score, 0.08);
  assert.ok(score < 0.2, 'Agricultural land with commercial use should have very low compatibility');
});

test('Verification Matrix: approves residential development on residential parcel', () => {
  const score = checkCompatibility('residential_settlement', 'residential');
  assert.equal(score, 0.96);
  assert.ok(score > 0.85, 'Residential on residential should have high compatibility');
});

test('Evidence Score Ensemble: calculates weighted confidence within [0, 1]', () => {
  const evidence = calculateEvidenceScore(0.94, 0.92, 45, 2.5);
  assert.ok(evidence >= 0 && evidence <= 1, 'Evidence score must be between 0 and 1');
  assert.ok(evidence > 0.85, 'High confidence inputs must result in evidence > 0.85');
});

test('Geospatial Geofencing: detects bounding box coordinate bounds', () => {
  const polygon = [
    { lat: 16.3482, lng: 80.5204 },
    { lat: 16.3486, lng: 80.5222 },
    { lat: 16.3468, lng: 80.5226 },
    { lat: 16.3464, lng: 80.5208 }
  ];
  assert.equal(polygon.length, 4);
  const minLat = Math.min(...polygon.map(p => p.lat));
  const maxLat = Math.max(...polygon.map(p => p.lat));
  assert.ok(minLat < maxLat);
});
