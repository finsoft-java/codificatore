import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ListBean, ValueBean, Codifica } from '../_models';

@Injectable({
  providedIn: 'root'
})
export class CodificaService {
  constructor(private http: HttpClient) { }

  // PER EMANUELE: al getALl() puoi agiungere tutti i filtri che ti servono
  getAll(): Observable<ListBean<Codifica>> {
    return this.http.get<ListBean<Codifica>>(environment.wsUrl + 'Codifica.php');
  }

  getById(idCodifica: number): Observable<ValueBean<Codifica>> {
    return this.http.get<ValueBean<Codifica>>(environment.wsUrl + `Codifica.php?idCodifica=${idCodifica}`);
  }

  create(obj: Codifica): Observable<ValueBean<Codifica>> {
    return this.http.post<ValueBean<Codifica>>(environment.wsUrl + 'Codifica.php', obj);
  }

  // NO UPDATE

  delete(obj: Codifica): Observable<void> {
    return this.http.delete<any>(environment.wsUrl + `Codifica.php?idCodifica=${obj.ID_CODIFICA}`);
  }
}
