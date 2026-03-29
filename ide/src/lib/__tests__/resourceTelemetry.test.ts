import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useResourceTelemetry } from '../resourceTelemetry';

describe('ResourceTelemetryService', () => {
  beforeEach(() => {
    // Manually reset state to default before each test
    useResourceTelemetry.setState({
      buildMinutesUsed: 895,
      buildMinutesLimit: 1000,
      storageUsed: 1540,
      storageLimit: 2000,
      isUpdating: false
    });
  });

  it('calculates build minutes usage correctly', () => {
    const state = useResourceTelemetry.getState();
    expect(state.buildMinutesUsed).toBe(895);
    expect(state.buildMinutesLimit).toBe(1000);
  });

  it('updates build minutes after a build', () => {
    const { updateAfterBuild } = useResourceTelemetry.getState();
    updateAfterBuild(10);
    const updatedState = useResourceTelemetry.getState();
    expect(updatedState.buildMinutesUsed).toBe(905);
  });

  it('caps build minutes at the limit', () => {
    const { updateAfterBuild } = useResourceTelemetry.getState();
    updateAfterBuild(200); // 895 + 200 = 1095
    const updatedState = useResourceTelemetry.getState();
    expect(updatedState.buildMinutesUsed).toBe(1000);
  });

  it('simulates fetching usage', async () => {
    const { fetchUsage } = useResourceTelemetry.getState();
    const fetchPromise = fetchUsage();
    expect(useResourceTelemetry.getState().isUpdating).toBe(true);
    await fetchPromise;
    expect(useResourceTelemetry.getState().isUpdating).toBe(false);
  });
});
