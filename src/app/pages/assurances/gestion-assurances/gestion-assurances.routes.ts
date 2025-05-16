import { Routes } from '@angular/router';
import { ListeAssurancesComponent } from './liste-assurances/liste-assurances.component';
import { AssuranceFormComponent } from './assurance-form/assurance-form.component';

export const gestionAssurancesRoutes: Routes = [
  { path: '', redirectTo: 'liste', pathMatch: 'full' },
  { path: 'liste', component: ListeAssurancesComponent },
  { path: 'nouveau-assurance', component: AssuranceFormComponent },
  { path: 'modifier/:id', component: AssuranceFormComponent }
]; 