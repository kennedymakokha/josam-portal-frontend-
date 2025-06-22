// store/features/appApi.ts
import { api } from '../slices';

type Theme = {
    primaryColor: string;
    tagline: string;
    app_name: string;
    logo: string | null;
};

type FetchThemeParams = {
    name?: string;
};

export const injectEndpoints = api.injectEndpoints({
    endpoints: (builder) => ({
        registerTheme: builder.mutation<void, Theme>({
            query: (body) => ({
                url: '/theme',
                method: 'POST',
                body,
            }),
        }),

        getTheme: builder.query<Theme, FetchThemeParams>({
            query: (params) => `/theme?name=${params.name}`,
        }),
    }),
    overrideExisting: false,
});

export const {
    useRegisterThemeMutation,
    useGetThemeQuery,
} = injectEndpoints;
