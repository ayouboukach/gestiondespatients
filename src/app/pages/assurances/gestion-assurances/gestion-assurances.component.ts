import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-gestion-patients',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './gestion-assurances.component.html',
  styleUrls: ['./gestion-assurances.component.css']
})
export class GestionAssurancesComponent {
}