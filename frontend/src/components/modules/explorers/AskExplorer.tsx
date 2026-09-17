import React from 'react';
import { Bot } from 'lucide-react';
import { ExplorerShell, NoActiveAnalysis } from './ExplorerShell';
import { AskPravirak } from '../AskPravirak';
import { ActiveAnalysis } from './types';

interface AskExplorerProps {
  analysis: ActiveAnalysis | null;
  onBack: () => void;
  onStartNew: () => void;
}

export const AskExplorer: React.FC<AskExplorerProps> = ({ analysis, onBack, onStartNew }) => {
  return (
    <ExplorerShell icon={Bot} title="Ask PRAVIRAK" description="Questions about the current analysis" onBack={onBack}>
      {!analysis ? (
        <NoActiveAnalysis onStartNew={onStartNew} />
      ) : (
        <AskPravirak
          input={analysis.input}
          location={analysis.location}
          financials={analysis.financials}
          decisionResult={analysis.decisionResult}
        />
      )}
    </ExplorerShell>
  );
};
