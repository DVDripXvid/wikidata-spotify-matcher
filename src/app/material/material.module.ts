import { NgModule } from '@angular/core';
import {
  MatButtonModule,
  MatTreeModule,
  MatIconModule,
  MatProgressSpinnerModule,
  MatProgressBarModule,
  MatPaginatorModule,
} from '@angular/material';


@NgModule({
  imports: [
    MatButtonModule,
    MatTreeModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatPaginatorModule,
  ],
  exports: [
    MatButtonModule,
    MatTreeModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatPaginatorModule,
  ]
})
export class MaterialModule { }
