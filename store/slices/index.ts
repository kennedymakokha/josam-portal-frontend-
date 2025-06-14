import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
// import { API_URL } from '@env';
// let API_URL = "http://localhost:4930"
let API_URL = "https://formbuilder.mtandao.app"
const baseUrl = `${API_URL}/api`;
export const api = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl,
        // credentials: 'include', // use this if your backend uses cookies
        prepareHeaders: (headers, { getState }) => {
            const token = (getState() as any).auth?.token;
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    endpoints: builder => ({}),
});

