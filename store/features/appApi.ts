// store/features/appApi.ts
import { api } from '../slices';

type Theme = {
    primaryColor: string;
    tagline: string;
    app_name: string;
    logo: string | null;
};

type FetchThemeParams = {
    id?: string;
};

export const injectEndpoints = api.injectEndpoints({
    endpoints: (builder) => ({
        registerTheme: builder.mutation({
            query: (formData) => ({
                url: '/theme',
                method: 'POST',
                body: formData,
                formData: true, // Ensure proper headers are set
            }),
        }),

        getThemes: builder.query<Theme, FetchThemeParams>({
            query: (params) => `/theme/apps/all?id=${params.id}`,
        }),
        getTheme: builder.query<Theme, FetchThemeParams>({
            query: (params) => `/theme/apps/id=${params.id}`,
        }),
        deleteTheme: builder.mutation<void, string>({
            query: (id) => ({
                url: `/theme/${id}`,
                method: 'DELETE',
            }),
        }),
        updateTheme: builder.mutation<void, { _id: string; data: FormData }>({
            query: (body) => ({
                url: `/theme/${body._id}`,
                method: 'PUT',
                body,
            }),
        }),
    }),

    overrideExisting: false,
});

export const {
    useRegisterThemeMutation,
    useGetThemeQuery,
    useGetThemesQuery,
    // uaseDeleteThemeMutation,
    useUpdateThemeMutation,
} = injectEndpoints;
