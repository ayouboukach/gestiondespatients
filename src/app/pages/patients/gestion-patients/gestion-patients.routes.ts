import { Routes } from '@angular/router';
import { ListePatientsComponent } from './liste-patients/liste-patients.component';
import { PatientFormComponent } from './patient-form/patient-form.component';

export const gestionPatientsRoutes: Routes = [
  { path: '', redirectTo: 'liste', pathMatch: 'full' },
  { path: 'liste', component: ListePatientsComponent },
  { path: 'nouveau-patient', component: PatientFormComponent },
  { path: 'modifier/:id', component: PatientFormComponent }
]; 