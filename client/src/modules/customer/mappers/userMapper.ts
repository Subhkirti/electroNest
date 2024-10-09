import { User } from "../types/userTypes";

function userMap(doc: any): User {
  return {
    id: doc?.id,
    name: doc?.first_name + " " + doc?.last_name,
    avatarText:
      doc?.first_name?.[0] && doc?.last_name?.[0]
        ? doc.first_name[0] + doc?.last_name?.[0]
        : doc.first_name[0],
    email: doc?.email,
    password: doc?.password,
    token: doc?.token,
    role: doc?.role || "customer",
    mobile: doc?.mobile,
    createdAt: doc?.created_at,
  };
}

export { userMap };
