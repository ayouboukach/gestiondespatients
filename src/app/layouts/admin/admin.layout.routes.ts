import { Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { AccueilComponent } from '../../pages/accueil/accueil.component';
import { ParametresComponent } from '../../pages/parametres/parametres.component';
import { RapportsComponent } from '../../pages/rapports/rapports.component';
import { patientsRoutes } from '../../pages/patients/Patients.routes';
import { NotFoundComponent } from '../../shared/components/not-found/not-found.component';

export const adminLayoutRoutes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      { path: '', redirectTo: 'accueil', pathMatch: 'full' },
      { path: 'accueil', component: AccueilComponent },
      { path: 'patients', children: patientsRoutes },
      { path: 'parametres', component: ParametresComponent },
      { path: 'rapports', component: RapportsComponent },
      { path: '**', component: NotFoundComponent }
    ]
  }
]; 