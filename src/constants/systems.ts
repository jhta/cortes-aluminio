export type SystemId = '520' | '744' | '16' | '8020';

export interface SystemDefinition {
  id: SystemId;
  name: string;
  available: boolean;
}

export const systemDefinitions: SystemDefinition[] = [
  { id: '520', name: 'Sistema 520', available: true },
  { id: '744', name: 'Sistema 744', available: true },
  { id: '16', name: 'Sistema 16', available: false },
  { id: '8020', name: 'Sistema 80-20', available: false },
];
