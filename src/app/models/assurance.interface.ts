import { Beneficiary } from './beneficiary.enum';
import { Patient } from './patient.interface';

export interface Assurance {
  id: number;
  address: string;
  beneficiary: Beneficiary;
  birthdate: Date;
  city: string;
  civil_title: string;
  cnie: string;
  first_name: string;
  last_name: string;
  num_affiliation: string;
  organization: string;
  patient?: Patient;
} 