import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AssuranceService } from '../../../../services/assurance.service';
import { Assurance } from '../../../../models/assurance.interface';

// Material imports
import { MatInputModule } from '@angular/material/input';
import { MatTableModule, MatTable } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTooltipModule } from '@angular/material/tooltip';

// Confirmation Dialog Component
@Component({
  selector: 'app-delete-confirmation-dialog',
  template: `
    <h2 mat-dialog-title>Confirmer la suppression</h2>
    <mat-dialog-content>
      Êtes-vous sûr de vouloir supprimer cette assurance ? Cette action est irréversible.
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Annuler</button>
      <button mat-button [mat-dialog-close]="true" color="warn">Supprimer</button>
    </mat-dialog-actions>
  `,
  standalone: true,
  imports: [MatDialogModule, MatButtonModule]
})
export class DeleteConfirmationDialogComponent {}

@Component({
  selector: 'app-liste-assurances',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    FormsModule,
    MatInputModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatFormFieldModule,
    MatDialogModule,
    MatSortModule,
    MatPaginatorModule,
    MatExpansionModule,
    MatTooltipModule
  ],
  templateUrl: './liste-assurances.component.html',
  styleUrls: ['./liste-assurances.component.css']
})
export class ListeAssurancesComponent implements OnInit {
  assurances: Assurance[] = [];
  filteredAssurances: Assurance[] = [];
  selectedAssurance: Assurance | null = null;
  searchTerm = '';
  displayedColumns: string[] = ['organization', 'num_affiliation', 'beneficiary', 'last_name', 'first_name', 'actions'];
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 25, 50];
  pageIndex = 0;

  constructor(
    private assuranceService: AssuranceService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.chargerAssurances();
  }

  private chargerAssurances(): void {
    this.assuranceService.getAllAssurance().subscribe({
      next: (assurances) => {
        this.assurances = assurances.map(assurance => ({
          ...assurance,
          birthdate: this.formaterDate(assurance.birthdate)
        }));
        this.appliquerFiltre();
      },
      error: this.gererErreur('chargement des assurances')
    });
  }

  private formaterDate(date: any): string {
    if (Array.isArray(date)) {
      const [year, month, day] = date;
      return new Date(Date.UTC(year, month-1, day)).toISOString();
    }
    if (typeof date === 'string') {
      return date;
    }
    return '';
  }

  onSearch(): void {
    this.appliquerFiltre();
    this.pageIndex = 0;
  }

  private appliquerFiltre(): void {
    const searchTerm = this.searchTerm.toLowerCase().trim();
    if (!searchTerm) {
      this.filteredAssurances = this.assurances;
      return;
    }
    this.filteredAssurances = this.assurances.filter(assurance => 
      this.assuranceCorrespondARecherche(assurance, searchTerm)
    );
  }

  private assuranceCorrespondARecherche(assurance: Assurance, searchTerm: string): boolean {
    return [
      assurance.organization,
      assurance.num_affiliation,
      assurance.last_name,
      assurance.first_name
    ].some(field => field?.toLowerCase().includes(searchTerm));
  }

  afficherDetails(assurance: Assurance): void {
    this.selectedAssurance = this.estSelectionne(assurance) ? null : {
      ...assurance,
      birthdate: this.formaterDate(assurance.birthdate)
    };
  }

  estSelectionne(assurance: Assurance): boolean {
    return this.selectedAssurance?.id === assurance.id;
  }

  modifierAssurance(assurance: Assurance): void {
    if (!assurance.id) return;
    this.router.navigate(['/admin/assurances/gestion/modifier', assurance.id]);
  }

  supprimerAssurance(id: number): void {
    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.assuranceService.deleteAssurance(id).subscribe({
          next: () => {
            this.chargerAssurances();
          },
          error: this.gererErreur('suppression')
        });
      }
    });
  }

  onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
  }

  sortData(sort: Sort): void {
    if (!sort.active || sort.direction === '') {
      this.appliquerFiltre();
      return;
    }
    this.filteredAssurances = [...this.filteredAssurances].sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'organization': return this.compare(a.organization, b.organization, isAsc);
        case 'num_affiliation': return this.compare(a.num_affiliation, b.num_affiliation, isAsc);
        case 'beneficiary': return this.compare(a.beneficiary, b.beneficiary, isAsc);
        case 'last_name': return this.compare(a.last_name, b.last_name, isAsc);
        case 'first_name': return this.compare(a.first_name, b.first_name, isAsc);
        default: return 0;
      }
    });
  }

  private compare(a: string | number, b: string | number, isAsc: boolean): number {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  private gererErreur(operation: string) {
    return (error: any) => {
      console.error(`Erreur lors de ${operation}:`, error);
    };
  }
} 