"@typescript-eslint/no-explicit-any"
export type InputOption = {
  label: string;
  value: string;
};

export type InputField = {
  name: string;
  type: 'text' | 'number' | 'password' | 'selectbox' | 'radio' | 'date' | 'checkbox';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: string | boolean | number | any[];
  required: boolean;
  options?: InputOption[];
};

export type LoanDetails = {
  amount?: number;
  interestRate?: number;
  tenure?: number;
  pros?: string[];
  termsAndConditions?: string;
};

export type ServiceData = {
  name: string;
  _id?: string;
  inputs: InputField[];
  app_name: string;
  apiEndpoint?: string;
  image?: File | null;
  category?: string;
  loanDetails?: LoanDetails;
  loanType?: string;
};


