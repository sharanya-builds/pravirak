import React from 'react';
import { describe, it, expect, vi, beforeAll } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { LoanPlanner } from './LoanPlanner';
import { LanguageProvider } from '../../context/LanguageContext';

beforeAll(() => {
  window.scrollTo = vi.fn();
});

const renderLoanPlanner = (props = {}) => {
  return render(
    <LanguageProvider>
      <LoanPlanner {...props} />
    </LanguageProvider>
  );
};

describe('LoanPlanner Component', () => {
  describe('Acceptance Test', () => {
    it('entering Telangana > Jangaon > any block, margin 1,00,000, Dairy shows Project Cost Rs 10,00,000, Max Loan Rs 9,00,000, Term Loan 8%, 7 years, 28 quarterly rows, first 2 marked as moratorium', () => {
      renderLoanPlanner();

      // Screen 1: Verify and set inputs
      const stateSelect = screen.getByTestId('state-select') as HTMLSelectElement;
      const districtSelect = screen.getByTestId('district-select') as HTMLSelectElement;
      const blockSelect = screen.getByTestId('block-select') as HTMLSelectElement;
      const marginInput = screen.getByTestId('margin-input') as HTMLInputElement;
      const categorySelect = screen.getByTestId('category-select') as HTMLSelectElement;

      // Select State: Telangana
      fireEvent.change(stateSelect, { target: { value: 'telangana' } });
      // Select District: Jangaon
      fireEvent.change(districtSelect, { target: { value: 'jangaon' } });
      // Select Block: Jangaon Mandal (or any block)
      fireEvent.change(blockSelect, { target: { value: 'jangaon_mandal' } });
      // Category: Dairy
      fireEvent.change(categorySelect, { target: { value: 'Dairy' } });
      // Margin: 100000
      fireEvent.change(marginInput, { target: { value: '100000' } });

      // Click Calculate
      const calcBtn = screen.getByTestId('calculate-button');
      fireEvent.click(calcBtn);

      // Screen 2: Results verification
      expect(screen.getByTestId('loan-planner-results')).toBeInTheDocument();

      // 1. Project Cost: Rs 10,00,000
      const projectCostVal = screen.getByTestId('val-project-cost');
      expect(projectCostVal.textContent).toContain('10,00,000');

      // 2. Max Loan: Rs 9,00,000
      const maxLoanVal = screen.getByTestId('val-max-loan');
      expect(maxLoanVal.textContent).toContain('9,00,000');

      // 3. Scheme: Term Loan Scheme, 8%
      const schemeCard = screen.getByTestId('scheme-card');
      expect(schemeCard.textContent).toContain('Term Loan');
      const schemeRate = screen.getByTestId('scheme-rate');
      expect(schemeRate.textContent).toContain('8%');

      // 4. Tenure: 7 Years (28 Quarters)
      const schemeTenure = screen.getByTestId('scheme-tenure');
      expect(schemeTenure.textContent).toContain('7 Years');
      expect(schemeTenure.textContent).toContain('28 Quarters');

      // 5. Moratorium: 6 Months (2 Quarters)
      const schemeMoratorium = screen.getByTestId('scheme-moratorium');
      expect(schemeMoratorium.textContent).toContain('6 Months');
      expect(schemeMoratorium.textContent).toContain('2 Quarters');

      // 6. 28 quarterly rows
      const table = screen.getByTestId('repayment-table');
      expect(table).toBeInTheDocument();
      const rows = table.querySelectorAll('tbody tr');
      expect(rows.length).toBe(28);

      // 7. First 2 marked as moratorium
      expect(rows[0].getAttribute('data-moratorium')).toBe('true');
      expect(rows[1].getAttribute('data-moratorium')).toBe('true');
      expect(rows[2].getAttribute('data-moratorium')).toBe('false');
      expect(screen.getByTestId('badge-moratorium-1')).toBeInTheDocument();
      expect(screen.getByTestId('badge-moratorium-2')).toBeInTheDocument();
      expect(screen.queryByTestId('badge-moratorium-3')).not.toBeInTheDocument();
    });
  });

  describe('Micro Scheme Case (10,000 Margin)', () => {
    it('margin 10,000 shows Micro Finance Scheme, 6.5%, 3 years, 12 quarters with 1 moratorium', () => {
      renderLoanPlanner();

      const marginInput = screen.getByTestId('margin-input');
      fireEvent.change(marginInput, { target: { value: '10000' } });

      const calcBtn = screen.getByTestId('calculate-button');
      fireEvent.click(calcBtn);

      // Summary Cards
      expect(screen.getByTestId('val-project-cost').textContent).toContain('1,00,000');
      expect(screen.getByTestId('val-max-loan').textContent).toContain('90,000');
      expect(screen.getByTestId('val-own-contribution').textContent).toContain('10,000');

      // Scheme details
      expect(screen.getByTestId('scheme-name').textContent).toContain('Micro Finance Scheme');
      expect(screen.getByTestId('scheme-rate').textContent).toContain('6.5%');
      expect(screen.getByTestId('scheme-tenure').textContent).toContain('3 Years');
      expect(screen.getByTestId('scheme-tenure').textContent).toContain('12 Quarters');
      expect(screen.getByTestId('scheme-moratorium').textContent).toContain('3 Months');
      expect(screen.getByTestId('scheme-moratorium').textContent).toContain('1 Quarter');

      // Schedule: 12 rows, 1 moratorium
      const rows = screen.getByTestId('repayment-table').querySelectorAll('tbody tr');
      expect(rows.length).toBe(12);
      expect(rows[0].getAttribute('data-moratorium')).toBe('true');
      expect(rows[1].getAttribute('data-moratorium')).toBe('false');
    });
  });

  describe('Capped Scheme Case (~138,889 to 140,000)', () => {
    it('margin 14,000 caps loan at 125,000 and displays visible cap notice with shortfall', () => {
      renderLoanPlanner();

      const marginInput = screen.getByTestId('margin-input');
      fireEvent.change(marginInput, { target: { value: '14000' } });

      const calcBtn = screen.getByTestId('calculate-button');
      fireEvent.click(calcBtn);

      // Project Cost: 1,40,000
      expect(screen.getByTestId('val-project-cost').textContent).toContain('1,40,000');
      // Max Loan capped at 1,25,000 (calculated 90% is 1,26,000)
      expect(screen.getByTestId('val-max-loan').textContent).toContain('1,25,000');
      // Own contribution: 14,000 + 1,000 shortfall = 15,000
      expect(screen.getByTestId('val-own-contribution').textContent).toContain('15,000');

      // Cap notice is displayed
      const capNotice = screen.getByTestId('cap-notice');
      expect(capNotice).toBeInTheDocument();
      expect(screen.getByTestId('cap-shortfall').textContent).toContain('1,000');
      expect(screen.getByTestId('cap-total-promoter').textContent).toContain('15,000');
    });
  });

  describe('Beyond Scheme Limits Case (> 50,00,000 Project Cost)', () => {
    it('margin 60,00,000 displays beyond-limits notice and does NOT render schedule table', () => {
      renderLoanPlanner();

      const marginInput = screen.getByTestId('margin-input');
      fireEvent.change(marginInput, { target: { value: '6000000' } });

      const calcBtn = screen.getByTestId('calculate-button');
      fireEvent.click(calcBtn);

      // Beyond limits notice
      const notice = screen.getByTestId('beyond-limits-notice');
      expect(notice).toBeInTheDocument();
      expect(screen.getByTestId('beyond-limits-message').textContent).toMatch(/exceeds maximum scheme limit/i);

      // Schedule table must NOT exist
      expect(screen.queryByTestId('repayment-table')).not.toBeInTheDocument();
      expect(screen.queryByTestId('schedule-section')).not.toBeInTheDocument();

      // Can go back to edit inputs
      const editBtn = screen.getByTestId('edit-inputs-beyond-limits');
      fireEvent.click(editBtn);
      expect(screen.getByTestId('loan-planner-form')).toBeInTheDocument();
    });
  });

  describe('Interactive Features & Controls', () => {
    it('clicking preset margin chips updates the margin input immediately', () => {
      renderLoanPlanner();

      const chip50k = screen.getByTestId('preset-50000');
      fireEvent.click(chip50k);
      const marginInput = screen.getByTestId('margin-input') as HTMLInputElement;
      expect(marginInput.value).toBe('50000');

      const chip5Lakh = screen.getByTestId('preset-500000');
      fireEvent.click(chip5Lakh);
      expect(marginInput.value).toBe('500000');
    });

    it('validates positive margin and blocks calculation when margin is 0', () => {
      renderLoanPlanner();

      const marginInput = screen.getByTestId('margin-input');
      fireEvent.change(marginInput, { target: { value: '0' } });

      const calcBtn = screen.getByTestId('calculate-button');
      fireEvent.click(calcBtn);

      expect(screen.getByTestId('margin-error')).toBeInTheDocument();
      expect(screen.queryByTestId('loan-planner-results')).not.toBeInTheDocument();
    });

    it('switching moratorium interest to "capitalised" recomputes live and adjusts closing balance', () => {
      renderLoanPlanner();

      // Enter 100,000 margin
      fireEvent.click(screen.getByTestId('calculate-button'));

      // In default 'serviced' mode: Q1 total payment is 18,000, closing balance is 9,00,000
      const q1RowServiced = screen.getByTestId('row-quarter-1');
      expect(q1RowServiced.textContent).toContain('18,000');
      expect(q1RowServiced.textContent).toContain('9,00,000');

      // Switch to 'capitalised'
      const capToggle = screen.getByTestId('toggle-moratorium-capitalised');
      fireEvent.click(capToggle);

      // In 'capitalised' mode: Q1 payment is 0.00, closing balance is 9,18,000
      const q1RowCapitalised = screen.getByTestId('row-quarter-1');
      expect(q1RowCapitalised.textContent).toContain('0.00');
      expect(q1RowCapitalised.textContent).toContain('9,18,000');
    });

    it('triggers onContinueToFeasibility callback when button is clicked', () => {
      const handleContinue = vi.fn();
      renderLoanPlanner({ onContinueToFeasibility: handleContinue });

      fireEvent.click(screen.getByTestId('calculate-button'));

      const continueBtn = screen.getByTestId('continue-feasibility-button');
      fireEvent.click(continueBtn);

      expect(handleContinue).toHaveBeenCalledTimes(1);
      expect(handleContinue).toHaveBeenCalledWith(
        expect.objectContaining({
          projectCost: 1000000,
          loanAmount: 900000,
          schemeName: 'Term Loan Scheme',
        }),
        'Dairy',
        expect.stringContaining('Pembarthi')
      );
    });

    it('handles CSV download without error', () => {
      renderLoanPlanner();
      fireEvent.click(screen.getByTestId('calculate-button'));

      const downloadBtn = screen.getByTestId('download-csv-button');
      expect(() => fireEvent.click(downloadBtn)).not.toThrow();
    });
  });
});
