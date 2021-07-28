import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ListBean, ValueBean, Codifica, IHash } from '../_models';

@Injectable({
  providedIn: 'root'
})
export class CodificaService {
  constructor(private http: HttpClient) { }

  getAll(): Observable<ListBean<Codifica>> {
    return this.http.get<ListBean<Codifica>>(environment.wsUrl + 'Codifica.php');
  }

  getById(idCodifica: number): Observable<ValueBean<Codifica>> {
    return this.http.get<ValueBean<Codifica>>(environment.wsUrl + `Codifica.php?idCodifica=${idCodifica}`);
  }

  getByDatiCodifica(datiCodifica: IHash): Observable<ListBean<Codifica>> {
    console.log("DEBUG datiCodifica=", datiCodifica);
    return this.http.post<ListBean<Codifica>>(environment.wsUrl + 'RicercaCodifiche.php', datiCodifica);
  }

  create(obj: Codifica): Observable<ValueBean<Codifica>> {
    return this.http.post<ValueBean<Codifica>>(environment.wsUrl + 'Codifica.php', obj);
  }

  // NO UPDATE

  delete(obj: Codifica): Observable<void> {
    return this.http.delete<any>(environment.wsUrl + `Codifica.php?idCodifica=${obj.ID_CODIFICA}`);
  }
}
