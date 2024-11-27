interface Address {
  addressId: number;
  userId: number;
  isActive: boolean;
  firstName: string;
  lastName: string;
  street: string;
  city: string;
  state: string;
  zipCode: number;
  landmark: string;
}

interface AddressReqBody {
  userId?: number;
  firstName: string;
  lastName: string;
  street: string;
  city: string;
  state: string;
  zipCode: number;
  landmark: string;
  mobile: number;
}

export type { Address, AddressReqBody };
