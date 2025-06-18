import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// interface AuthState {
//     isAuthenticated: boolean;
//     token: string | null;
//     user: {
//         user: { id: string; phone_number: string } | null;
//     } | null


// }
interface AuthUser {
    id: string;
    phone_number: string;
    name?: string;
    email?: string;
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
            action: PayloadAction<{ token: string | null; id: string; phone_number: string; name?: string; email?: string }>
        ) => {
            state.isAuthenticated = true;
            state.user = {
                id: action.payload.id,
                phone_number: action.payload.phone_number,
                name: action.payload.name,
                email: action.payload.email,
            };
            state.token = action.payload.token;
        },

        logout: (state) => {
            state.isAuthenticated = false;
            state.user = null;
            state.token = null;
        },

    },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
