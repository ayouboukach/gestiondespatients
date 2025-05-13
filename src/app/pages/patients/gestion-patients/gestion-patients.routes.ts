import { Routes } from '@angular/router';
import { ListeUtilisateursComponent } from './liste-patients/liste-patients.component';
import { PatientFormComponent } from './patient-form/patient-form.component';

export const gestionPatientsRoutes: Routes = [
  { path: '', redirectTo: 'liste', pathMatch: 'full' },
  { path: 'liste', component: ListeUtilisateursComponent },
  { path: 'nouveau-patient', component: PatientFormComponent },
  { path: 'modifier/:id', component: PatientFormComponent }
]; 