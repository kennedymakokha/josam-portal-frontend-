import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
    isAuthenticated: boolean;
    token: string | null;

    user: { id: string; phone_number: string } | null;
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
        loginSuccess: (state, action: PayloadAction<{
            token: string | null; id: string; phone_number: string
        }>) => {
            state.isAuthenticated = true;
            state.user = action.payload;
            state.token = action?.payload?.token
        },
        logout: (state) => {
            state.isAuthenticated = false;
            state.user = null;
        },
    },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
