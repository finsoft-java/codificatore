import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './_guards/auth.guard';
import { RegoleCodificaComponent } from './regole-codifica/regole-codifica.component';
import { RegoleCodificaFormComponent } from './regole-codifica-form/regole-codifica-form.component';
import { CodificaComponent } from './codifica/codifica.component';
import { RicercaComponent } from './ricerca/ricerca.component';
import { RicercaAvanzataComponent } from './ricerca-avanzata/ricerca-avanzata.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent},
  { path: 'codifica', component: CodificaComponent, canActivate: [AuthGuard]},
  { path: 'regole-codifica', component: RegoleCodificaComponent, canActivate: [AuthGuard]},
  { path: 'regole-codifica/crea', component: RegoleCodificaFormComponent, canActivate: [AuthGuard]},
  { path: 'regole-codifica/:id', component: RegoleCodificaFormComponent, canActivate: [AuthGuard]},
  { path: 'ricerca', component: RicercaComponent, canActivate: [AuthGuard]},
  { path: 'ricerca-avanzata', component: RicercaAvanzataComponent, canActivate: [AuthGuard]},
  { path: '**', redirectTo: 'codifica' }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
