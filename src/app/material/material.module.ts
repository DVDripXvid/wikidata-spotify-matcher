import { NgModule } from '@angular/core';
import {
  MatButtonModule,
  MatTreeModule,
  MatIconModule,
  MatProgressSpinnerModule,
  MatProgressBarModule,
  MatPaginatorModule,
  MatExpansionModule,
  MatListModule,
  MatCardModule,
  MatFormFieldModule,
  MatInputModule,
} from '@angular/material';

@NgModule({
  imports: [
    MatButtonModule,
    MatTreeModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatPaginatorModule,
    MatExpansionModule,
    MatListModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  exports: [
    MatButtonModule,
    MatTreeModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatPaginatorModule,
    MatExpansionModule,
    MatListModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
  ]
})
export class MaterialModule { }
