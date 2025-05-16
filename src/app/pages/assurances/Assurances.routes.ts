import { Routes } from '@angular/router';
import { AssurancesComponent } from './assurances.component';
import { GestionAssurancesComponent } from './gestion-assurances/gestion-assurances.component';
import { UtilisateursActifsComponent } from './utilisateurs-actifs/utilisateurs-actifs.component';
import { EnCoursRealisationComponent } from './en-cours-realisation/en-cours-realisation.component';
import { gestionAssurancesRoutes } from './gestion-assurances/gestion-assurances.routes';

export const assurancesRoutes: Routes = [
  {
    path: '',
    component: AssurancesComponent,
    children: [
      { path: '', redirectTo: 'gestion', pathMatch: 'full' },
      { 
        path: 'gestion', 
        component: GestionAssurancesComponent,
        children: gestionAssurancesRoutes
      },
      { path: 'actifs', component: UtilisateursActifsComponent },
      { path: 'en-cours', component: EnCoursRealisationComponent }
    ]
  }
]; 