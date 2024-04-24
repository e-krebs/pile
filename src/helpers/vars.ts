export type VarKeys = 'refreshInterval';
export type ServiceVarKeys = 'showCountOnBadge' | 'active';

export const vars: Record<VarKeys, string> = {
  refreshInterval: 'refresh_interval',
};

export const serviceVars: Record<ServiceVarKeys, string> = {
  showCountOnBadge: 'show_count_on-badge',
  active: 'service_active',
};

export const defaultVars: Record<VarKeys, number> = {
  refreshInterval: 10,
};

export const color = '#F1B602';
export const colorSelected = '#22C55E';
