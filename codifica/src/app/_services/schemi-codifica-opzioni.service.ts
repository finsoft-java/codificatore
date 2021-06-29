import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ListBean, SchemaCodificaOptions } from '../_models';

@Injectable({
  providedIn: 'root'
})
export class SchemiCodificaOpzioniService {
  constructor(private http: HttpClient) { }

  getById(idSchema: number): Observable<ListBean<SchemaCodificaOptions>> {
    return this.http.get<ListBean<SchemaCodificaOptions>>(environment.wsUrl
                            + `Opzioni.php?idSchema=${idSchema}`);
  }
}
