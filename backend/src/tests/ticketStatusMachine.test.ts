import { describe, it, expect } from 'vitest';
import { validateStatusTransition, VALID_TRANSITIONS } from '../services/ticketStatusMachine';
import { InvalidStatusTransitionError } from '../utils/AppError';
import { TicketStatus } from '../types/domain';

describe('ticketStatusMachine', () => {
  it('defines valid transitions per spec', () => {
    expect(VALID_TRANSITIONS.OPEN).toEqual(['IN_PROGRESS', 'CANCELLED']);
    expect(VALID_TRANSITIONS.IN_PROGRESS).toEqual(['RESOLVED', 'CANCELLED']);
    expect(VALID_TRANSITIONS.RESOLVED).toEqual(['CLOSED']);
    expect(VALID_TRANSITIONS.CLOSED).toEqual([]);
    expect(VALID_TRANSITIONS.CANCELLED).toEqual([]);
  });

  it('allows OPEN → IN_PROGRESS', () => {
    expect(() => validateStatusTransition('OPEN', 'IN_PROGRESS')).not.toThrow();
  });

  it('allows IN_PROGRESS → RESOLVED', () => {
    expect(() => validateStatusTransition('IN_PROGRESS', 'RESOLVED')).not.toThrow();
  });

  it('allows RESOLVED → CLOSED', () => {
    expect(() => validateStatusTransition('RESOLVED', 'CLOSED')).not.toThrow();
  });

  it('allows OPEN → CANCELLED', () => {
    expect(() => validateStatusTransition('OPEN', 'CANCELLED')).not.toThrow();
  });

  it('allows IN_PROGRESS → CANCELLED', () => {
    expect(() => validateStatusTransition('IN_PROGRESS', 'CANCELLED')).not.toThrow();
  });

  it('rejects OPEN → RESOLVED', () => {
    expect(() => validateStatusTransition('OPEN', 'RESOLVED')).toThrow(
      InvalidStatusTransitionError,
    );
    try {
      validateStatusTransition('OPEN', 'RESOLVED');
    } catch (err) {
      expect((err as InvalidStatusTransitionError).message).toBe(
        'Invalid status transition from OPEN to RESOLVED',
      );
    }
  });

  it('rejects RESOLVED → OPEN', () => {
    expect(() => validateStatusTransition('RESOLVED', 'OPEN')).toThrow(
      InvalidStatusTransitionError,
    );
  });

  it('rejects CLOSED → OPEN', () => {
    expect(() => validateStatusTransition('CLOSED', 'OPEN')).toThrow(
      InvalidStatusTransitionError,
    );
  });

  it('rejects no-op transitions', () => {
    const statuses: TicketStatus[] = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED', 'CANCELLED'];
    for (const status of statuses) {
      expect(() => validateStatusTransition(status, status)).toThrow(
        InvalidStatusTransitionError,
      );
    }
  });
});
