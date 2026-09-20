import {
  MapPin,
  Landmark,
  Briefcase,
  Truck,
  ShieldAlert,
  ClipboardCheck,
  TrendingUp,
  FileSearch,
  Bot,
  LucideIcon
} from 'lucide-react';

export type PrimaryNavKey = 'HOME' | 'MY_BUSINESSES' | 'NEW_ANALYSIS' | 'REPORTS' | 'LOAN_PLANNER';

export type ExplorerKey =
  | 'MARKET'
  | 'FINANCE'
  | 'BUSINESS'
  | 'OPERATIONS'
  | 'RISK'
  | 'COMPLIANCE'
  | 'GROWTH'
  | 'EVIDENCE'
  | 'ASK';

export interface ExplorerMeta {
  key: ExplorerKey;
  label: string;
  description: string;
  icon: LucideIcon;
}

export const EXPLORE_HUB_ITEMS: ExplorerMeta[] = [
  { key: 'MARKET', label: 'Market Explorer', description: 'Local demand and markets', icon: MapPin },
  { key: 'FINANCE', label: 'Finance Explorer', description: 'Schemes, loans and eligibility', icon: Landmark },
  { key: 'BUSINESS', label: 'Business Explorer', description: 'Business opportunities and comparisons', icon: Briefcase },
  { key: 'OPERATIONS', label: 'Operations Explorer', description: 'Suppliers, infrastructure and logistics', icon: Truck },
  { key: 'RISK', label: 'Risk Explorer', description: 'Risks, seasonality and stress scenarios', icon: ShieldAlert },
  { key: 'COMPLIANCE', label: 'Compliance Explorer', description: 'Licences, registrations and approvals', icon: ClipboardCheck },
  { key: 'GROWTH', label: 'Growth Explorer', description: 'Expansion and new opportunities', icon: TrendingUp },
  { key: 'EVIDENCE', label: 'Evidence Explorer', description: 'Data sources and evidence quality', icon: FileSearch },
  { key: 'ASK', label: 'Ask PRAVIRAK', description: 'Questions about the current analysis', icon: Bot }
];
