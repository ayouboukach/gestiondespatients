import { Routes } from '@angular/router';
import { PatientsComponent } from './patients.component';
import { GestionPatientsComponent } from './gestion-patients/gestion-patients.component';
import { UtilisateursActifsComponent } from './utilisateurs-actifs/utilisateurs-actifs.component';
import { EnCoursRealisationComponent } from './en-cours-realisation/en-cours-realisation.component';
import { gestionPatientsRoutes } from './gestion-patients/gestion-patients.routes';

export const patientsRoutes: Routes = [
  {
    path: '',
    component: PatientsComponent,
    children: [
      { path: '', redirectTo: 'gestion', pathMatch: 'full' },
      { 
        path: 'gestion', 
        component: GestionPatientsComponent,
        children: gestionPatientsRoutes
      },
      { path: 'actifs', component: UtilisateursActifsComponent },
      { path: 'en-cours', component: EnCoursRealisationComponent }
    ]
  }
]; 