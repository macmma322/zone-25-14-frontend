import api from './api';

interface LoginResponse {
    token: string;
}

interface RegisterFormData {
    username: string;
    email: string;
    password: string;
}

export const loginUser = async (username: string, password: string) => {
    const res = await api.post<LoginResponse>('/auth/login', { username, password });
    if (res.data.token) {
        localStorage.setItem('authToken', res.data.token);
    }
    return res.data;
};

export const registerUser = async (formData: RegisterFormData) => {
    const res = await api.post('/auth/register', formData);
    return res.data;
};

export const fetchUserProfile = async () => {
    const res = await api.get('/users/me');
    return res.data;
};

export interface Product {
    product_id: string;
    name: string;
    base_price: number;
    exclusive_to_niche?: string;
}

export const fetchProducts = async (): Promise<Product[]> => {
    const res = await api.get<Product[]>('/products');
    return res.data;
};
