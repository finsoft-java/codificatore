import { StoricoOperazione } from './../_models/area';
import { Articolo } from '../_models/area';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ListBean } from '../_models';
import { environment } from 'src/environments/environment';
import { MockService } from '../mat-edit-table';

@Injectable({
  providedIn: 'root'
})
export class StoricoOperazioniService extends MockService<StoricoOperazione> {

  constructor(private http: HttpClient) {
    super();
  }

  isMock = false;
  mockData: ListBean<StoricoOperazione> = {
    data: [
      {
        ID_OPERAZIONE: 1,
        COD_UTENTE: 'UTENTE 1',
        COD_OPERAZIONE : 'OPERAZIONE 1',
        COD_ARTICOLO : 'ARTICOLO 1',
        COD_UBICAZIONE : 'UBICAZIONE 1',
        COD_AREA : 'AREA 1',
        TIMESTAMP : ''
      }
    ],
    count: 5
  };

  getAll(filter: any): Observable<ListBean<StoricoOperazione>> {
    if (this.isMock){
      return new Observable( observer => {
        // JSON parse/stringify serve per eseguire una deep copy
        const list: ListBean<StoricoOperazione> = JSON.parse(JSON.stringify(this.mockData));
        observer.next(list);
        observer.complete();
      });
    } else {
      return this.http.get<ListBean<StoricoOperazione>>(environment.wsUrl + 'StoricoOperazioni.php', { params: filter });
    }
  }

}
