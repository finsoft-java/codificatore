import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpCrudService } from './HttpCrudService';
import { ListBean, ValueBean, SchemaCodificaRegole } from '../_models';

@Injectable({
  providedIn: 'root'
})
export class SchemiCodificaRegoleService {
  constructor(private http: HttpClient) { }

  getAll(idSchema: number): Observable<ListBean<SchemaCodificaRegole>> {
    return this.http.get<ListBean<SchemaCodificaRegole>>(environment.wsUrl + `Regole.php?idSchema=${idSchema}`);
  }

  getAllGlobali(): Observable<ListBean<SchemaCodificaRegole>> {
    return this.http.get<ListBean<SchemaCodificaRegole>>(environment.wsUrl + `Regole.php?soloGlobali=true`);
  }

  getById(idSchema: number, nomVariabile: string): Observable<ValueBean<SchemaCodificaRegole>> {
    return this.http.get<ValueBean<SchemaCodificaRegole>>(environment.wsUrl
                            + `Regole.php?idSchema=${idSchema}&nomVariabile=${nomVariabile}`);
  }

  create(obj: SchemaCodificaRegole): Observable<ValueBean<SchemaCodificaRegole>> {
    return this.http.post<ValueBean<SchemaCodificaRegole>>(environment.wsUrl + 'Regole.php', obj);
  }

  update(obj: SchemaCodificaRegole): Observable<ValueBean<SchemaCodificaRegole>> {
    return this.http.put<ValueBean<SchemaCodificaRegole>>(environment.wsUrl + 'Regole.php', obj);
  }

  delete(obj: SchemaCodificaRegole): Observable<void> {
    return this.http.delete<any>(environment.wsUrl + `Regole.php?idSchema=${obj.ID_SCHEMA}&nomVariabile=${obj.NOM_VARIABILE}`);
  }
}
