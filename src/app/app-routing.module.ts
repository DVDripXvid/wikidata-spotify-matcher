import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LibraryTreeComponent } from './components/library-tree/library-tree.component';
import { HomeComponent } from './components/home/home.component';

const routes: Routes = [
  { path: 'library', component: LibraryTreeComponent },
  { path: '', component: HomeComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
