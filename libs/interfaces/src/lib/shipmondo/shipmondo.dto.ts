import { ShipmondoAddress } from './shipmondo-address.interface';
import { ShipmondoContactInfo } from './shipmondo-contact-info.interface';

export interface CreateSHipmentRequest {
  instruction?: string;
  address: ShipmondoAddress;
  contact: ShipmondoContactInfo;
  parcels: unknown[];
  isHomeDelivery: boolean;
}
