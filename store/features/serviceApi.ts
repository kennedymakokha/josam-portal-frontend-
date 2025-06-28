
import { Service } from '../../types/forms';
import { api } from '../slices';

type FetchParams = {
    name?: string;
};

export const injectEndpoints = api.injectEndpoints({
    endpoints: (builder) => ({
        registerService: builder.mutation<void, FormData>({
            query: (body) => ({
                url: '/services',
                method: 'POST',
                body,
            }),
        }),
        toggleactiveService: builder.mutation<void, string>({
            query: (id) => ({
                url: `/services/toggle-active/${id}`,
                method: 'PUT',
            }),
        }),
        deleteService: builder.mutation<void, string>({
            query: (id) => ({
                url: `/services/${id}`,
                method: 'DELETE',
            }),
        }),
        updateService: builder.mutation<void, { _id: string; data: FormData }>({
            query: (body) => ({
                url: `/services/${body._id}`,
                method: 'PUT',
                body,
            }),
        }),
        getServices: builder.query<Service[], FetchParams>({
            query: ({ name }) => `/services`,
        }),
    }),
});

export const {
    useRegisterServiceMutation,
    useToggleactiveServiceMutation,
    useDeleteServiceMutation,
    useUpdateServiceMutation,


    useGetServicesQuery,
} = injectEndpoints;
