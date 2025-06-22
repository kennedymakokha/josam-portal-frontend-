// store/features/appApi.ts
import { api } from '../slices';

type Theme = {
    background: string;
    color: string;
    app_name: string;
    logo: string | null;
};



export const injectEndpoints = api.injectEndpoints({
    endpoints: (builder) => ({
        generateCode: builder.mutation({
            query: (formData) => ({
                url: '/codes',
                method: 'POST',
                body: formData,
                formData: true, // Ensure proper headers are set
            }),
        }),

       
    }),
    overrideExisting: false,
});

export const {
    useGenerateCodeMutation,
} = injectEndpoints;
