import { Address } from "../types/addressTypes";
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
    expiresAt: doc?.expires_at,
    createdAt: doc?.created_at,
    updatedAt: doc?.updated_at,
  };
}

function addressMap(doc: any): Address {
  return {
    addressId: doc?.id || 0,
    userId: doc?.user_id || 0,
    firstName: doc?.first_name || "",
    lastName: doc?.last_name || "",
    street: doc?.street || "",
    city: doc?.city || "",
    state: doc?.state || "",
    zipCode: doc?.zip_code || "",
    landmark: doc?.landmark || "",
    isActive: doc?.active === 1 ? true : false,
  };
}
export { userMap, addressMap };
