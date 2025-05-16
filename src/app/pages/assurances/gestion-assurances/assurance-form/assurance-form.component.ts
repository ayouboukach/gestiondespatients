import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Assurance } from '../../../../models/assurance.interface';
import { Beneficiary } from '../../../../models/beneficiary.enum';
import { AssuranceService } from '../../../../services/assurance.service';
import { PatientService } from '../../../../services/patient.service';
import { Patient } from '../../../../models/patient.interface';

@Component({
  selector: 'app-assurance-form',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './assurance-form.component.html',
  styleUrls: ['./assurance-form.component.css']
})
export class AssuranceFormComponent implements OnInit, OnDestroy {
  assuranceForm!: FormGroup;
  isFormValid = false;
  isEditMode = false;
  assuranceId: number | null = null;
  beneficiaryTypes = Object.values(Beneficiary);
  patients: Patient[] = [];
  selectedPatient: Patient | null = null;
  private routeSubscription!: Subscription;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private assuranceService: AssuranceService,
    private patientService: PatientService
  ) {
    this.initialiserFormulaire();
  }

  ngOnInit(): void {
    this.chargerPatients();
    this.configurerSouscriptionRoute();
    this.configurerEcouteurPatientId();
  }

  private configurerSouscriptionRoute(): void {
    this.routeSubscription = this.route.params.subscribe(params => {
      const idParam = params['id'];
      if (idParam) {
        this.isEditMode = true;
        this.assuranceId = +idParam;
        this.chargerAssurance(this.assuranceId);
      }
    });
  }

  private chargerAssurance(id: number): void {
    this.assuranceService.getAssuranceById(id).subscribe(assurance => {
      if (!assurance) return;
      
      const formattedAssurance = {
        ...assurance,
        birthdate: this.formaterDate(assurance.birthdate)
      };

      if (assurance.patient) {
        this.mettreAJourFormulaireAvecPatient(formattedAssurance, assurance.patient);
      } else if (assurance.patient_id) {
        this.chargerEtMettreAJourPatient(formattedAssurance, assurance.patient_id);
      } else {
        this.assuranceForm.patchValue(formattedAssurance);
      }
    });
  }

  private mettreAJourFormulaireAvecPatient(assurance: any, patient: Patient): void {
    this.selectedPatient = patient;
    this.assuranceForm.patchValue({
      ...assurance,
      patientId: patient.id
    });
  }

  private chargerEtMettreAJourPatient(assurance: any, patientId: string): void {
    const id = parseInt(patientId);
    this.patientService.getPatientById(id).subscribe(patient => {
      if (patient) {
        this.mettreAJourFormulaireAvecPatient(assurance, patient);
      }
    });
  }

  private configurerEcouteurPatientId(): void {
    this.assuranceForm.get('patientId')?.valueChanges.subscribe(patientId => {
      if (!patientId) return;
      
      const patient = this.patients.find(p => p.id === +patientId);
      if (patient) {
        this.selectedPatient = patient;
        this.mettreAJourDetailsPatient(patient);
      }
    });
  }

  private mettreAJourDetailsPatient(patient: Patient): void {
    this.assuranceForm.patchValue({
      address: patient.address,
      city: patient.city,
      cnie: patient.cnie
    });
  }

  private formaterDate(date: any): string {
    if (Array.isArray(date)) {
      const [year, month, day] = date;
      const dateObj = new Date(Date.UTC(year, month-1, day));
      return dateObj.toISOString().split('T')[0];
    }
    if (typeof date === 'string') {
      return date.split('T')[0];
    }
    return '';
  }

  private initialiserFormulaire(): void {
    this.assuranceForm = this.fb.group({
      organization: ['', Validators.required],
      num_affiliation: ['', Validators.required],
      beneficiary: ['', Validators.required],
      civil_title: ['', Validators.required],
      last_name: ['', [Validators.required, Validators.minLength(2)]],
      first_name: ['', [Validators.required, Validators.minLength(2)]],
      birthdate: ['', Validators.required],
      cnie: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      patientId: ['', Validators.required]
    });

    this.assuranceForm.valueChanges.subscribe(() => {
      this.isFormValid = this.assuranceForm.valid;
    });
  }

  chargerPatients(): void {
    this.patientService.getAllPatients().subscribe({
      next: (patients) => this.patients = patients,
      error: (error) => console.error('Erreur lors du chargement des patients:', error)
    });
  }

  onSubmit(): void {
    if (!this.assuranceForm.valid || !this.selectedPatient) return;

    const assuranceData: Assurance = {
      ...this.assuranceForm.value,
      patient_id: this.selectedPatient.id.toString(),
      birthdate: this.ajouterTempsADate(this.assuranceForm.value.birthdate)
    };

    const action = this.isEditMode 
      ? this.assuranceService.updateAssurance(this.assuranceId!, assuranceData)
      : this.assuranceService.addAssurance(assuranceData);

    action.subscribe({
      next: () => this.router.navigate(['/admin/assurances/gestion/liste']),
      error: err => alert(`Erreur lors de ${this.isEditMode ? 'la modification' : "l'ajout"} de l'assurance : ${err.message}`)
    });
  }

  private ajouterTempsADate(date: string): string {
    return date.includes('T') ? date : `${date}T00:00:00`;
  }

  estChampInvalide(fieldName: string): boolean {
    const field = this.assuranceForm.get(fieldName);
    return field?.invalid && (field.dirty || field.touched) || false;
  }

  ngOnDestroy(): void {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }
} 