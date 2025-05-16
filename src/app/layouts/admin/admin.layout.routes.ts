import { Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { AccueilComponent } from '../../pages/accueil/accueil.component';
import { RapportsComponent } from '../../pages/rapports/rapports.component';
import { patientsRoutes } from '../../pages/patients/Patients.routes';
import { NotFoundComponent } from '../../shared/components/not-found/not-found.component';
import { assurancesRoutes } from '../../pages/assurances/Assurances.routes';

export const adminLayoutRoutes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      { path: '', redirectTo: 'accueil', pathMatch: 'full' },
      { path: 'accueil', component: AccueilComponent },
      { path: 'patients', children: patientsRoutes },
      { path: 'assurances', children: assurancesRoutes },
      { path: 'rapports', component: RapportsComponent },
      { path: '**', component: NotFoundComponent }
    ]
  }
]; 