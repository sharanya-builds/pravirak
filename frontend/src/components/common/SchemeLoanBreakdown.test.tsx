import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SchemeLoanBreakdown } from './SchemeLoanBreakdown';
import { calculatePS } from '../../engine/psCalculator';
import { LanguageProvider } from '../../context/LanguageContext';

const renderComponent = (props: React.ComponentProps<typeof SchemeLoanBreakdown>) => {
  return render(
    <LanguageProvider>
      <SchemeLoanBreakdown {...props} />
    </LanguageProvider>
  );
};

describe('SchemeLoanBreakdown Component', () => {
  it('renders all summary cards, scheme details, and repayment schedule for eligible result', () => {
    const margin = 100000;
    const result = calculatePS(margin);

    renderComponent({
      result,
      availableMargin: margin,
      businessCategory: 'Dairy',
      locationSummary: 'Pembarthi, Jangaon'
    });

    // Summary cards
    expect(screen.getByTestId('card-project-cost')).toBeInTheDocument();
    expect(screen.getByTestId('val-project-cost')).toHaveTextContent('10,00,000');
    expect(screen.getByTestId('card-max-loan')).toBeInTheDocument();
    expect(screen.getByTestId('val-max-loan')).toHaveTextContent('9,00,000');
    expect(screen.getByTestId('card-own-contribution')).toBeInTheDocument();
    expect(screen.getByTestId('val-own-contribution')).toHaveTextContent('1,00,000');

    // Scheme card
    expect(screen.getByTestId('scheme-name')).toHaveTextContent('Term Loan Scheme');
    expect(screen.getByTestId('scheme-rate')).toHaveTextContent('8% p.a.');
    expect(screen.getByTestId('scheme-tenure')).toHaveTextContent('7 Years');
    expect(screen.getByTestId('scheme-moratorium')).toHaveTextContent('6 Months');

    // Repayment table
    expect(screen.getByTestId('repayment-table')).toBeInTheDocument();
    expect(screen.getByTestId('row-quarter-1')).toHaveAttribute('data-moratorium', 'true');
    expect(screen.getByTestId('badge-moratorium-1')).toBeInTheDocument();
    expect(screen.getByTestId('badge-moratorium-2')).toBeInTheDocument();
    expect(screen.getByTestId('schedule-totals-row')).toBeInTheDocument();
  });

  it('renders capped scheme notice when loan is capped by ceiling', () => {
    // Margin 5,00,000 -> Project Cost 50,00,000 -> 90% is 45,00,000 (at ceiling)
    // Wait, let's test a case where 0.90 * cost > schemeMaxLoan:
    // Micro Finance Scheme: max loan 1,25,000. For project cost 1,40,000, 90% is 1,26,000 > 1,25,000!
    // Margin 14,000 -> Project Cost 1,40,000
    const margin = 14000;
    const result = calculatePS(margin);

    expect(result.isEligible).toBe(true);
    if (result.isEligible) {
      expect(result.cappedByScheme).toBe(true);
    }

    renderComponent({
      result,
      availableMargin: margin
    });

    expect(screen.getByTestId('cap-notice')).toBeInTheDocument();
    expect(screen.getByTestId('cap-shortfall')).toHaveTextContent('1,000');
    expect(screen.getByTestId('cap-total-promoter')).toHaveTextContent('15,000');
  });

  it('switches moratorium interest between serviced and capitalised when availableMargin is provided', () => {
    const margin = 100000;
    const result = calculatePS(margin);
    const onOptionChange = vi.fn();

    renderComponent({
      result,
      availableMargin: margin,
      onOptionChange
    });

    const capitalisedBtn = screen.getByTestId('toggle-moratorium-capitalised');
    fireEvent.click(capitalisedBtn);

    expect(onOptionChange).toHaveBeenCalledWith(
      expect.objectContaining({ moratoriumInterest: 'capitalised' })
    );

    const servicedBtn = screen.getByTestId('toggle-moratorium-serviced');
    fireEvent.click(servicedBtn);

    expect(onOptionChange).toHaveBeenCalledWith(
      expect.objectContaining({ moratoriumInterest: 'serviced' })
    );
  });

  it('renders beyond-limits notice cleanly when result is beyond scheme limits', () => {
    const result = calculatePS(600000); // 6,00,000 margin -> 60,00,000 cost > 50L limit

    renderComponent({
      result
    });

    expect(screen.getByTestId('scheme-loan-beyond-limits')).toBeInTheDocument();
    expect(screen.getByTestId('beyond-limits-message')).toHaveTextContent('50,00,000');
    expect(screen.queryByTestId('repayment-table')).not.toBeInTheDocument();
  });

  it('triggers CSV download without throwing error', () => {
    const margin = 100000;
    const result = calculatePS(margin);

    renderComponent({
      result,
      availableMargin: margin,
      businessCategory: 'Dairy'
    });

    const downloadBtn = screen.getByTestId('download-csv-button');
    expect(() => fireEvent.click(downloadBtn)).not.toThrow();
  });
});
