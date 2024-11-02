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

interface TableColumn<T> {
  id: keyof T;
  label: string;
  align?: "left" | "center" | "right";
  render?: (value: any, row: T) => React.ReactNode;
}
export type { User, RegisterReqBody, LoginReqBody, TableColumn };
