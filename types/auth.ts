type LoginResponse = {
    token: string;
    id: string
    phone_number: string
    user: {
        app_id: string | undefined;
        _id: string;
        name: string;
        email: string;
        phone_number: string
        role: 'user' | 'admin' | 'superadmin'; // Optional role field
        // etc.
    };
};