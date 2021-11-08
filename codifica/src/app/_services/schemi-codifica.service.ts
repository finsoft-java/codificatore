import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpCrudService } from './HttpCrudService';
import { SchemaCodifica, ListBean, ValueBean } from '../_models';

@Injectable({
  providedIn: 'root'
})
export class SchemiCodificaService implements HttpCrudService<SchemaCodifica> {
  constructor(private http: HttpClient) { }

  getAll(): Observable<ListBean<SchemaCodifica>> {
    return this.http.get<ListBean<SchemaCodifica>>(environment.wsUrl + 'Schemi.php');
  }

  getValidiPubblici(): Observable<ListBean<SchemaCodifica>> {
    return this.http.get<ListBean<SchemaCodifica>>(environment.wsUrl + 'Schemi.php?soloValidi=true&tipo=P');
  }

  getValidiInterni(): Observable<ListBean<SchemaCodifica>> {
    return this.http.get<ListBean<SchemaCodifica>>(environment.wsUrl + 'Schemi.php?soloValidi=true&tipo=I');
  }

  getById(idSchema: number): Observable<ValueBean<SchemaCodifica>> {
    return this.http.get<ValueBean<SchemaCodifica>>(environment.wsUrl + `Schemi.php?idSchema=${idSchema}`);
  }

  create(obj: SchemaCodifica): Observable<ValueBean<SchemaCodifica>> {
    return this.http.post<ValueBean<SchemaCodifica>>(environment.wsUrl + 'Schemi.php', obj);
  }

  update(obj: SchemaCodifica): Observable<ValueBean<SchemaCodifica>> {
    return this.http.put<ValueBean<SchemaCodifica>>(environment.wsUrl + 'Schemi.php', obj);
  }

  delete(obj: SchemaCodifica): Observable<void> {
    return this.http.delete<void>(environment.wsUrl + `Schemi.php?idSchema=${obj.ID_SCHEMA}`);
  }

  deleteImage(idSchemaCodifica: number) {
    return this.http.delete<void>(environment.wsUrl + `SchemaImage.php?idSchema=${idSchemaCodifica}`);
  }

  uploadImage(idSchemaCodifica: number, image: File) {
    const formData = new FormData();
    formData.append('image', image);
    console.log(formData.get('image'));
    return this.http.post<void>(environment.wsUrl + `SchemaImage.php?idSchema=${idSchemaCodifica}`, formData);
  }

  getSchemiPadre(idSchema: number) {
    return this.http.get<ListBean<SchemaCodifica>>(environment.wsUrl + `SchemiPadre.php?idSchema=${idSchema}`);
  }
}
