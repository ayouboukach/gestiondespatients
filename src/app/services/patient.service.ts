import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Patient } from '../models/patient.interface';
import { environment } from '../../environments/environment.development';

@Injectable({ providedIn: 'root' })
export class PatientService {
  private apiUrl = `${environment.apiUrl}/patients`;

  constructor(private http: HttpClient) {}

  getAllPatients(): Observable<Patient[]> {
    return this.http.get<Patient[]>(`${this.apiUrl}/all`);
  }

  addPatient(patient: Patient): Observable<Patient> {
    return this.http.post<Patient>(`${this.apiUrl}/add`, patient);
  }

  getPatientById(id: number) {
    return this.http.get<Patient>(`${this.apiUrl}/find/${id}`);
  }

  updatePatient(id: number, patient: Patient) {
    return this.http.put<Patient>(`${this.apiUrl}/update/${id}`, patient);
  }

  deletePatient(id: number) {
    return this.http.delete(`${this.apiUrl}/delete/${id}`);
  }
} 