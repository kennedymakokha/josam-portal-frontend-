type LoginResponse = {
    token: string;
    id: string
    phone_number: string
    user: {
        id: string;
        name: string;
        email: string;
        phone_number: string
        // etc.
    };
};