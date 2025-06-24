import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// interface AuthState {
//     isAuthenticated: boolean;
//     token: string | null;
//     user: {
//         user: { id: string; phone_number: string } | null;
//     } | null


// }
export interface AuthUser {
    id: string;
    phone_number: string;
    name?: string;
    email?: string;
    app_id?: string; // Optional app_id field
    role?: 'user' | 'admin' | 'superadmin'; // Optional role field
}

interface AuthState {
    isAuthenticated: boolean;
    token: string | null;
    user: AuthUser | null;
}

const initialState: AuthState = {
    isAuthenticated: false,
    user: null,
    token: null
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginSuccess: (
            state,
            action: PayloadAction<{
                token: string;
                user: {
                    _id: string;
                    phone_number: string;
                    name: string;
                    email: string;
                    app_id?: string; // Optional app_id
                    role: 'user' | 'admin' | 'superadmin';
                };
            }>
        ) => {
            state.isAuthenticated = true;
            state.user = {
                id: action.payload.user._id,
                phone_number: action.payload.user.phone_number,
                name: action.payload.user.name,
                email: action.payload.user.email,
                app_id: action.payload.user.app_id || undefined, // Optional app_id
                role: action.payload.user.role || 'user', // Default role if not provided
            };
            state.token = action.payload.token;
        },
        // loginSuccess: (state, action: PayloadAction<{
        //     token: string | null; id: string; phone_number: string
        // }>) => {
        //     state.isAuthenticated = true;
        //     state.user = action.payload;
        //     state.token = action?.payload?.token
        // },
        logout: (state) => {
            state.isAuthenticated = false;
            state.user = null;
            state.token = null;
        },

    },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
