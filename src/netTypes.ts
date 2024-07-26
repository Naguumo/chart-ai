export type NetNode = {
  id: string;
  layer?: number;
};
export type NetLink = {
  sourceId: string;
  targetId: string;
  value: number;
};

export type NetData = {
  nodes: NetNode[];
  links: NetLink[];
};
