export interface UserInput {
  name: string;
  email: string;
  password: string;
  phone: number;
}

export interface UserLogInput {
  email: string;
  password: string;
}

export interface UserUpdateInput {
  name?: string;
  password?: string;
  phone?: number;
}
