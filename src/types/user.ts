// what /auth/login returns (minus the tokens)
export type AuthUser = {
    id: number;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    gender: string;
    image: string;
};

export type LoginResponse = AuthUser & {
    accessToken: string;
    refreshToken: string;
};

// the full profile from /auth/me
export type User = AuthUser & {
    maidenName: string;
    age: number;
    phone: string;
    birthDate: string;
    university: string;
    address: {
        address: string;
        city: string;
        state: string;
        postalCode: string;
        country: string;
    };
    company: {
        name: string;
        title: string;
        department: string;
    };
};
