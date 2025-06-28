
export type InputOption = {
    label: string;
    value: string;
};
export interface RawService {
    _id?: string;
    name: string;
    inputs: string[] | InputField[]; // could be either
    app_name: string;
    apiEndpoint: string;
    image?: File | string | null;
    active?: boolean;
    category?: string;
}
export type InputField = {
    name: string;
    type: 'text' | 'number' | 'password' | 'selectbox' | 'radio' | 'date' | 'checkbox';
    value: string | number | boolean;
    required: boolean;
    options?: InputOption[]; // only for selectbox or radio
};
export interface Service {
    _id?: string;
    name: string;
    inputs: InputField[];
    app_name: string;
    apiEndpoint: string;
    image?: File | string | null;
    active?: boolean;
    category?: string;
    services?: any
}

export interface ServiceResponse {
    services: Service[];
    page: number;
    totalPages: number;
}