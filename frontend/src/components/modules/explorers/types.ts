import { BusinessInput, BusinessDecisionResult, FinancialAnalysis, LocationData } from '../../../types';

export interface ActiveAnalysis {
  input: BusinessInput;
  location: LocationData;
  financials: FinancialAnalysis;
  decisionResult: BusinessDecisionResult;
}
