import React from 'react';
import { LoanDetails } from './types';

interface LoanDetailsSectionProps {
    loanDetails: LoanDetails | undefined;
    setLoanDetails: (loanDetails: LoanDetails) => void;
}

const LoanDetailsSection: React.FC<LoanDetailsSectionProps> = ({
    loanDetails,
    setLoanDetails,
}) => {
    const handleChange = <K extends keyof LoanDetails>(key: K, value: LoanDetails[K]) => {
        setLoanDetails({ ...loanDetails, [key]: value });
    };

    const updatePros = (index: number, value: string) => {
        const updatedPros = [...(loanDetails?.pros || [])];
        updatedPros[index] = value;
        handleChange('pros', updatedPros);
    };

    return (
        <div className="p-4 bg-gray-100 border rounded space-y-3">
            <h3 className="font-semibold text-lg">Loan Details</h3>

            <label>
                Amount
                <input
                    type="number"
                    className="w-full border px-3 py-2 rounded"
                    value={loanDetails?.amount || ''}
                    onChange={(e) => handleChange('amount', Number(e.target.value))}
                />
            </label>

            <label>
                Interest Rate (%)
                <input
                    type="number"
                    step="0.1"
                    className="w-full border px-3 py-2 rounded"
                    value={loanDetails?.interestRate || ''}
                    onChange={(e) => handleChange('interestRate', Number(e.target.value))}
                />
            </label>

            <label>
                Tenure (months)
                <input
                    type="number"
                    className="w-full border px-3 py-2 rounded"
                    value={loanDetails?.tenure || ''}
                    onChange={(e) => handleChange('tenure', Number(e.target.value))}
                />
            </label>

            <div>
                <label className="block font-semibold mb-1">Pros</label>
                {(loanDetails?.pros || []).map((pro, index) => (
                    <input
                        key={index}
                        type="text"
                        className="w-full border px-3 py-2 rounded mb-2"
                        value={pro}
                        onChange={(e) => updatePros(index, e.target.value)}
                    />
                ))}
                <button
                    type="button"
                    className="text-sm underline text-blue-600"
                    onClick={() => handleChange('pros', [...(loanDetails?.pros || []), ''])}
                >
                    + Add More Pros
                </button>
            </div>

            <label>
                Terms and Conditions
                <textarea
                    rows={4}
                    className="w-full border px-3 py-2 rounded"
                    placeholder="Terms and Conditions"
                    value={loanDetails?.termsAndConditions || ''}
                    onChange={(e) => handleChange('termsAndConditions', e.target.value)}
                />
            </label>
        </div>
    );
};

export default LoanDetailsSection;
