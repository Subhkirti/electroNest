export type User = {
  id: number;
  name: string;
  email: string;
  password: string;
  token: string;
  role: "customer" | "admin";
  createdAt: Date;
  mobile: number | null;
  avatarText?: string;
};
