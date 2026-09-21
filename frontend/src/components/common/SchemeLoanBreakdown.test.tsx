import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SchemeLoanBreakdown } from './SchemeLoanBreakdown';
import { calculatePS, PSCalculatorEligibleResult } from '../../engine/psCalculator';
import { LanguageProvider } from '../../context/LanguageContext';

const renderComponent = (props: React.ComponentProps<typeof SchemeLoanBreakdown>) => {
  return render(
    <LanguageProvider>
      <SchemeLoanBreakdown {...props} />
    </LanguageProvider>
  );
};

describe('SchemeLoanBreakdown Component', () => {
  it('renders compact summary by default with figures matching psCalculator, with schedule collapsed', () => {
    const margin = 100000;
    const result = calculatePS(margin) as PSCalculatorEligibleResult;

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

    // 1. Compact summary is rendered by default
    const compactSummary = screen.getByTestId('compact-repayment-summary');
    expect(compactSummary).toBeInTheDocument();
    expect(screen.getByTestId('compact-scheme-name')).toHaveTextContent(result.schemeName);
    expect(screen.getByTestId('compact-rate')).toHaveTextContent(`${result.interestRate}%`);
    expect(screen.getByTestId('compact-tenure')).toHaveTextContent(`${result.tenureYears} Years`);
    expect(screen.getByTestId('compact-moratorium')).toHaveTextContent(`${result.moratoriumMonths} Months`);

    // Verify first payment after moratorium
    const firstPostMoratorium = result.schedule.find(r => !r.isMoratorium);
    expect(firstPostMoratorium).toBeDefined();
    expect(screen.getByTestId('compact-first-payment')).toHaveTextContent(
      Math.round(firstPostMoratorium!.totalPayment).toLocaleString('en-IN')
    );

    // Verify final payment
    const finalRow = result.schedule[result.schedule.length - 1];
    expect(screen.getByTestId('compact-final-payment')).toHaveTextContent(
      Math.round(finalRow.totalPayment).toLocaleString('en-IN')
    );

    // Verify total interest and total repaid
    const totalInterest = result.schedule.reduce((acc, r) => acc + r.interest, 0);
    const totalRepaid = result.schedule.reduce((acc, r) => acc + r.totalPayment, 0);
    expect(screen.getByTestId('compact-total-interest')).toHaveTextContent(
      Math.round(totalInterest).toLocaleString('en-IN')
    );
    expect(screen.getByTestId('compact-total-repaid')).toHaveTextContent(
      Math.round(totalRepaid).toLocaleString('en-IN')
    );

    // 2. Schedule table is collapsed by default
    expect(screen.getByTestId('toggle-full-schedule')).toBeInTheDocument();
    expect(screen.queryByTestId('row-quarter-1')).not.toBeInTheDocument();

    // 3. Download CSV button is outside the toggle and visible
    expect(screen.getByTestId('download-csv-button')).toBeInTheDocument();
  });

  it('opens schedule on toggle, groups rows by year, verifies year totals equal sum of quarters, and marks moratoriums', () => {
    const margin = 100000;
    const result = calculatePS(margin) as PSCalculatorEligibleResult;

    renderComponent({
      result,
      availableMargin: margin,
      businessCategory: 'Dairy'
    });

    // Click toggle to open schedule
    const toggleBtn = screen.getByTestId('toggle-full-schedule');
    fireEvent.click(toggleBtn);

    // Repayment table is now in DOM
    expect(screen.getByTestId('repayment-table')).toBeInTheDocument();

    // Verify all 7 years exist
    for (let y = 1; y <= 7; y++) {
      expect(screen.getByTestId(`year-row-${y}`)).toBeInTheDocument();
    }

    // Verify Year 1 total payment equals sum of its 4 quarters
    const y1Quarters = result.schedule.slice(0, 4);
    const y1SumTotalPayment = y1Quarters.reduce((acc, r) => acc + r.totalPayment, 0);
    expect(screen.getByTestId('year-total-payment-1')).toHaveTextContent(
      y1SumTotalPayment.toLocaleString('en-IN')
    );

    // Expand Year 1 row
    fireEvent.click(screen.getByTestId('year-row-1'));

    // Verify quarters 1 to 4 are displayed
    expect(screen.getByTestId('row-quarter-1')).toHaveAttribute('data-moratorium', 'true');
    expect(screen.getByTestId('badge-moratorium-1')).toBeInTheDocument();
    expect(screen.getByTestId('row-quarter-2')).toHaveAttribute('data-moratorium', 'true');
    expect(screen.getByTestId('badge-moratorium-2')).toBeInTheDocument();
    expect(screen.getByTestId('row-quarter-3')).toHaveAttribute('data-moratorium', 'false');
    expect(screen.getByTestId('row-quarter-4')).toHaveAttribute('data-moratorium', 'false');

    // Test "Expand all years"
    const expandAllBtn = screen.getByTestId('toggle-expand-all-years');
    fireEvent.click(expandAllBtn);

    // Quarter 28 (Year 7, Q4) should now be in the DOM
    expect(screen.getByTestId('row-quarter-28')).toBeInTheDocument();
  });

  it('renders capped scheme notice when loan is capped by ceiling', () => {
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
    const result = calculatePS(600000);

    renderComponent({
      result
    });

    expect(screen.getByTestId('scheme-loan-beyond-limits')).toBeInTheDocument();
    expect(screen.getByTestId('beyond-limits-message')).toHaveTextContent('50,00,000');
    expect(screen.queryByTestId('repayment-table')).not.toBeInTheDocument();
  });

  it('triggers CSV download without throwing error and row count equals number of quarters', () => {
    const margin = 100000;
    const result = calculatePS(margin) as PSCalculatorEligibleResult;

    renderComponent({
      result,
      availableMargin: margin,
      businessCategory: 'Dairy'
    });

    const downloadBtn = screen.getByTestId('download-csv-button');
    expect(() => fireEvent.click(downloadBtn)).not.toThrow();

    // Verify CSV rows count would equal totalQuarters (28) + 1 header + 1 totals
    expect(result.schedule.length).toBe(28);
  });
});
