interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  token: string;
  role: "customer" | "admin";
  createdAt: Date;
  mobile: number | null;
  avatarText?: string;
}

interface RegisterReqBody {
  firstName: FormDataEntryValue | null;
  lastName: FormDataEntryValue | null;
  email: FormDataEntryValue | null;
  password: FormDataEntryValue | null;
}

interface LoginReqBody {
  email: FormDataEntryValue | null;
  password: FormDataEntryValue | null;
}
export type { User, RegisterReqBody, LoginReqBody };
