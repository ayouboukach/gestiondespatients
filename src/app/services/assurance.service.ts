import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Assurance } from '../models/assurance.interface';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class AssuranceService {
  private apiUrl = `${environment.apiUrl}/assurances`;

  constructor(private http: HttpClient) {}

  getAllAssurance(): Observable<Assurance[]> {
    return this.http.get<Assurance[]>(`${this.apiUrl}/all`);
  }

  addAssurance(Assurance: Assurance): Observable<Assurance> {
    return this.http.post<Assurance>(`${this.apiUrl}/add`, Assurance);
  }

  getAssuranceById(id: number) {
    return this.http.get<Assurance>(`${this.apiUrl}/find/${id}`);
  }

  updateAssurance(id: number, Assurance: Assurance) {
    return this.http.put<Assurance>(`${this.apiUrl}/update/${id}`, Assurance);
  }

  deleteAssurance(id: number) {
    return this.http.delete(`${this.apiUrl}/delete/${id}`);
  }
} 