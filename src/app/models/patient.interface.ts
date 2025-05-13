import { Gender } from './gender.enum';
import { Assurance } from './assurance.interface';

export interface Patient {
  id: number;
  address: string;
  age: number;
  birth_date: Date;
  category: string;
  city: string;
  cnie: string;
  country: string;
  email: string;
  emergency_contact: string;
  ethnicity: string;
  first_name: string;
  gender: Gender;
  is_assured: boolean;
  is_confidential: boolean;
  is_favorite: boolean;
  last_name: string;
  marital_status: string;
  nationality: string;
  num_dossier_papier: string;
  num_passport: string;
  phone: string;
  postal_code: string;
  prefecture: string;
  pricing: string;
  profession: string;
  spoken_languages: string;
  vip: boolean;
  assurances?: Assurance[];
} 