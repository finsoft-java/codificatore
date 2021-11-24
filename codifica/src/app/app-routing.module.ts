import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './_guards/auth.guard';
import { SchemiCodificaComponent } from './schemi-codifica/schemi-codifica.component';
import { SchemiCodificaFormComponent } from './schemi-codifica-form/schemi-codifica-form.component';
import { CodificaComponent } from './codifica/codifica.component';
import { RicercaComponent } from './ricerca/ricerca.component';
import { RicercaAvanzataComponent } from './ricerca-avanzata/ricerca-avanzata.component';
import { SchemaRegoleGlobaliComponent } from './schema-regole-globali/schema-regole-globali.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'codifica', component: CodificaComponent, canActivate: [AuthGuard] },
  { path: 'schemi-codifica', component: SchemiCodificaComponent, canActivate: [AuthGuard] },
  { path: 'schemi-codifica/crea', component: SchemiCodificaFormComponent, canActivate: [AuthGuard] },
  { path: 'schemi-codifica/:id', component: SchemiCodificaFormComponent, canActivate: [AuthGuard] },
  { path: 'regole-globali', component: SchemaRegoleGlobaliComponent, canActivate: [AuthGuard] },
  { path: 'ricerca', component: RicercaComponent, canActivate: [AuthGuard] },
  { path: 'ricerca-avanzata', component: RicercaAvanzataComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: 'codifica' }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
