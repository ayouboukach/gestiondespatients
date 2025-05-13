import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-gestion-patients',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './gestion-patients.component.html',
  styleUrls: ['./gestion-patients.component.css']
})
export class GestionPatientsComponent {
} 