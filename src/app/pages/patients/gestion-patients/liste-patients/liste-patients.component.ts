import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Patient } from '../../../../models/patient.interface';
import { FormsModule } from '@angular/forms';
import { PatientService } from '../../../../services/patient.service';

@Component({
  selector: 'app-liste-patients',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './liste-patients.component.html',
  styleUrls: ['./liste-patients.component.css']
})
export class ListePatientsComponent implements OnInit {
  patients: Patient[] = [];
  filteredPatients: Patient[] = [];
  selectedPatient: Patient | null = null;
  showDeleteConfirmation = false;
  patientToDelete: number | null = null;
  searchTerm: string = '';
  showAssurancesFor: number | null = null;

  constructor(private router: Router, private patientService: PatientService) {}

  ngOnInit() {
    this.chargerPatients();
    this.router.events.subscribe(() => {
      this.chargerPatients();
    });
  }

  chargerPatients() {
    this.patientService.getAllPatients().subscribe((data) => {
      this.patients = data;
      this.filtrerPatients();
    });
  }

  filtrerPatients() {
    if (!this.searchTerm.trim()) {
      this.filteredPatients = this.patients;
    } else {
      const search = this.searchTerm.toLowerCase();
      this.filteredPatients = this.patients.filter(patient => 
        patient.last_name?.toLowerCase().includes(search) ||
        patient.first_name?.toLowerCase().includes(search)
      );
    }
  }

  onSearch() {
    this.filtrerPatients();
  }

  supprimerUtilisateur(id: number) {
    this.patientToDelete = id;
    this.showDeleteConfirmation = true;
  }

  annulerSuppression() {
    this.showDeleteConfirmation = false;
    this.patientToDelete = null;
  }

  confirmerSuppression() {
    if (this.patientToDelete !== null) {
      this.patientService.deletePatient(this.patientToDelete).subscribe({
        next: () => {
          this.chargerPatients();
          this.showDeleteConfirmation = false;
          this.patientToDelete = null;
        },
        error: err => alert('Erreur lors de la suppression du patient : ' + err.message)
      });
    }
  }

  afficherDetailsUtilisateur(patient: Patient) {
    this.selectedPatient = patient;
  }

  cacherDetailsUtilisateur() {
    this.selectedPatient = null;
  }

  modifierPatient(patient: Patient) {
    this.router.navigate(['/admin/patients/gestion/modifier', patient.id], { state: { patient } });
  }

  basculerAssurances(patient: Patient) {
    this.showAssurancesFor = this.showAssurancesFor === patient.id ? null : patient.id;
  }
} 