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
  ]
})
export class MaterialModule { }
