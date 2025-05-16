import { Component, OnInit, OnChanges, DoCheck, AfterContentInit, AfterContentChecked, AfterViewInit, AfterViewChecked, OnDestroy, SimpleChanges, Input, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { Patient } from '../../../../models/patient.interface';
import { Gender } from '../../../../models/gender.enum';
import { Subscription } from 'rxjs';
import { PatientService } from '../../../../services/patient.service';

@Component({
  selector: 'app-patient-form',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './patient-form.component.html',
  styleUrls: ['./patient-form.component.css']
})
export class PatientFormComponent implements 
  OnInit, OnChanges, DoCheck, OnDestroy {
  
  @Input() initialData: Patient | null = null;
  @ViewChild('formContainer') formContainer!: ElementRef;
  
  userForm!: FormGroup;
  isFormValid = false;
  isEditMode = false;
  userId: number | null = null;
  genders = Object.values(Gender);
  availableLanguages = ['Français', 'Arabe', 'Anglais', 'Espagnol', 'Amazigh'];
  private routeSubscription!: Subscription;
  private formChangesSubscription!: Subscription;
  private previousFormValue: any;
  formattedDate: string = '';

  constructor(
    private fb: FormBuilder,
    public router: Router,
    private route: ActivatedRoute,
    private patientService: PatientService
  ) {
    this.initForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['initialData'] && changes['initialData'].currentValue) {
      const data = { ...changes['initialData'].currentValue };
      if (data.birth_date && Array.isArray(data.birth_date)) {
        const birthDate = data.birth_date as number[];
        const date = new Date(
          birthDate[0],
          birthDate[1] - 1,
          birthDate[2],
          birthDate[3], 
          birthDate[4] 
        );
        this.userForm.patchValue({
          ...data,
          birth_date: date.toISOString().split('T')[0]
        });
      } else {
        this.userForm.patchValue(data);
      }
    }
  }

  ngOnInit(): void {
    this.routeSubscription = this.route.params.subscribe(params => {
      const idParam = params['id'];
      if (idParam) {
        this.isEditMode = true;
        this.userId = +idParam;
  
        this.patientService.getPatientById(this.userId).subscribe(patient => {
          if (patient) {
            if (patient.birth_date && Array.isArray(patient.birth_date)) {
              const birthDate = patient.birth_date as number[];
              const date = new Date(
                birthDate[0], // year
                birthDate[1] - 1, // month (0-based)
                birthDate[2], // day
                birthDate[3], // hour
                birthDate[4] // minute
              );
              this.userForm.patchValue({
                ...patient,
                birth_date: date.toISOString().split('T')[0]
              });
            } else {
              this.userForm.patchValue(patient);
            }
          }
        });
      }
    });
  }
  

  ngDoCheck(): void {
    if (this.userForm && this.previousFormValue !== this.userForm.value) {
      this.previousFormValue = this.userForm.value;
    }
  }

  ngOnDestroy(): void {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
    if (this.formChangesSubscription) {
      this.formChangesSubscription.unsubscribe();
    }
  }

  private initForm(): void {
    this.userForm = this.fb.group({
      last_name: ['', [Validators.required, Validators.minLength(2)]],
      first_name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^\+212[0-9]{9}$/)]],
      address: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      postal_code: ['', Validators.required],
      prefecture: ['', Validators.required],
      profession: ['', Validators.required],
      category: ['', Validators.required],
      spoken_languages: [[], Validators.required],
      emergency_contact: ['', Validators.required],
      ethnicity: ['', Validators.required],
      gender: ['', Validators.required],
      birth_date: ['', Validators.required],
      age: ['', Validators.required],
      cnie: ['', Validators.required],
      nationality: ['', Validators.required],
      num_dossier_papier: ['', Validators.required],
      num_passport: ['', Validators.required],
      marital_status: ['', Validators.required],
      pricing: ['', Validators.required],
      assurances: [[]],
      vip: [false],
      is_assured: [false],
      is_confidential: [false],
      is_favorite: [false]
    });
    this.userForm.valueChanges.subscribe(() => this.isFormValid = this.userForm.valid);
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      const patientToSend = { ...this.userForm.value };

      // Gestion des langues parlées
      if (Array.isArray(patientToSend.spoken_languages)) {
        patientToSend.spoken_languages = patientToSend.spoken_languages.join(', ');
      }

      // Formatage de la date de naissance
      if (patientToSend.birth_date) {
        const date = new Date(patientToSend.birth_date);
        // Convert to array format expected by backend
        patientToSend.birth_date = [
          date.getFullYear(),
          date.getMonth() + 1,
          date.getDate(),
          date.getHours(),
          date.getMinutes()
        ];
      }

      // Gestion du genre en minuscules
      if (patientToSend.gender) {
        patientToSend.gender = patientToSend.gender.toLowerCase();
      }

      if (this.isEditMode && this.userId) {
        this.patientService.updatePatient(this.userId, patientToSend).subscribe({
          next: () => this.router.navigate(['/admin/patients/gestion/liste']),
          error: err => alert('Erreur lors de la modification du patient : ' + err.message)
        });
      } else {
        this.patientService.addPatient(patientToSend).subscribe({
          next: () => this.router.navigate(['/admin/patients/gestion/liste']),
          error: err => alert('Erreur lors de l\'ajout du patient : ' + err.message)
        });
      }
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.userForm.get(fieldName);
    return field?.invalid && (field.dirty || field.touched) || false;
  }

  checkFormValidity(): void {
    this.isFormValid = this.userForm.valid;
  }

  onLanguageChange(lang: string, event: any) {
    const langs = this.userForm.get('spoken_languages')?.value as string[];
    if (event.target.checked) {
      this.userForm.get('spoken_languages')?.setValue([...langs, lang]);
    } else {
      this.userForm.get('spoken_languages')?.setValue(langs.filter(l => l !== lang));
    }
    this.userForm.get('spoken_languages')?.updateValueAndValidity();
  }
} 