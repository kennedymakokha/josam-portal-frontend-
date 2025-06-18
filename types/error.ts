type ApiError = Error & {
    data?: string;
    error?: string;
};