export interface LoginBody {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface RegisterBody {
  name: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  token: string;
  user: User;
}

export interface GetMeResponse {
  user: User;
}

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string | null;
  city?: string | null;
  shippingAddress?: string | null;
  role: string;
  createdAt: string;
}

export interface UpdateProfileBody {
  name: string;
  email: string;
  phone: string;
  city: string;
  shippingAddress: string;
}
