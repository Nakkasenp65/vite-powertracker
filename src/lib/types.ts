export interface HistoryRecord {
    set: number;
    work: number;
    rest: number | null;
    reps: number | null;
}

export type Phase = 'idle' | 'working' | 'resting' | 'finished';
