import React from 'react';
import { MapPin } from 'lucide-react';
import { ExplorerShell, NoActiveAnalysis } from './ExplorerShell';
import { MarketMap } from '../MarketMap';
import { LocationComparison } from '../LocationComparison';
import { ActiveAnalysis } from './types';

interface MarketExplorerProps {
  analysis: ActiveAnalysis | null;
  baseLocation: import('../../../types').LocationData | null;
  onToggleAlternative: () => void;
  isAlternativeApplied: boolean;
  onBack: () => void;
  onStartNew: () => void;
}

export const MarketExplorer: React.FC<MarketExplorerProps> = ({
  analysis,
  baseLocation,
  onToggleAlternative,
  isAlternativeApplied,
  onBack,
  onStartNew
}) => {
  return (
    <ExplorerShell icon={MapPin} title="Market Explorer" description="Local demand and markets" onBack={onBack}>
      {!analysis || !baseLocation ? (
        <NoActiveAnalysis onStartNew={onStartNew} />
      ) : (
        <div className="space-y-6">
          <MarketMap location={analysis.location} onSelectAlternative={onToggleAlternative} />
          <LocationComparison
            location={baseLocation}
            onApplyAlternative={onToggleAlternative}
            isAlternativeApplied={isAlternativeApplied}
          />
        </div>
      )}
    </ExplorerShell>
  );
};
