import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { NewBusinessFlow } from './NewBusinessFlow';
import { LanguageProvider } from '../../context/LanguageContext';

describe('NewBusinessFlow - Capital Step with psCalculator Live Preview', () => {
  const renderFlowAtStep3 = () => {
    render(
      <LanguageProvider>
        <NewBusinessFlow
          onSubmit={vi.fn()}
          onCancel={vi.fn()}
        />
      </LanguageProvider>
    );

    // Fill Step 1
    const ideaInput = screen.getByPlaceholderText(/e\.g\./i);
    fireEvent.change(ideaInput, { target: { value: 'Bakery shop' } });

    // Step 1 Continue
    fireEvent.click(screen.getByRole('button', { name: /Continue/i }));

    // Step 2: Confirm location
    fireEvent.click(screen.getByRole('button', { name: /Use This Location/i }));

    // Step 2 Continue to Step 3
    fireEvent.click(screen.getByRole('button', { name: /Continue/i }));
  };

  it('relabels capital input to "Your own capital (margin money)" and shows live scheme preview', () => {
    renderFlowAtStep3();

    // Check label
    expect(screen.getByText(/Your own capital \(margin money\)/i)).toBeInTheDocument();

    // Check live preview for default capital (e.g. 50,000 or 1,00,000)
    const preview = screen.getByTestId('capital-live-preview');
    expect(preview).toBeInTheDocument();
    expect(preview).toHaveTextContent(/supports a project up to/i);
  });

  it('updates live preview when a preset chip is clicked', () => {
    renderFlowAtStep3();

    // Click ₹1,00,000 preset
    const preset1L = screen.getByRole('button', { name: '₹1,00,000' });
    fireEvent.click(preset1L);

    const preview = screen.getByTestId('capital-live-preview');
    expect(preview).toHaveTextContent('₹1,00,000 supports a project up to ₹10,00,000 (Term Loan Scheme, 8%)');
  });

  it('handles beyond-limit capital gracefully in live preview', () => {
    renderFlowAtStep3();

    // Enter ₹6,00,000 margin -> ₹60,00,000 project > ₹50,00,000 scheme ceiling
    const input = screen.getByRole('spinbutton');
    fireEvent.change(input, { target: { value: '600000' } });

    const preview = screen.getByTestId('capital-live-preview');
    expect(preview).toBeInTheDocument();
    expect(preview).toHaveTextContent(/exceeds/i);
  });
});
