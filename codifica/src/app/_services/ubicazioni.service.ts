import { Articolo } from './../_models/area';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpCrudService } from './HttpCrudService';
import { Ubicazione, ListBean, ValueBean } from '../_models';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UbicazioniService implements HttpCrudService<Ubicazione> {

  constructor(private http: HttpClient) { }
  isMock = true;

  mockData: ListBean<Articolo> = {
    data: [
      {
        ID_ARTICOLO: '1',
        DESCRIZIONE: 'PRODOTTO M1'
      },
      {
        ID_ARTICOLO: '2',
        DESCRIZIONE: 'PRODOTTO M2'
      },
      {
        ID_ARTICOLO: '3',
        DESCRIZIONE: 'PRODOTTO M3'
      },
      {
        ID_ARTICOLO: '4',
        DESCRIZIONE: 'PRODOTTO M4'
      },
      {
        ID_ARTICOLO: '5',
        DESCRIZIONE: 'PRODOTTO M5'
      }
    ],
    count: 5
  };

  getAll(filter?: any): Observable<ListBean<any>> {
    this.isMock = false;
    if (this.isMock) {
      return new Observable( observer => {
        // JSON parse/stringify serve per eseguire una deep copy
        const list: ListBean<any> = JSON.parse(JSON.stringify(this.mockData));
        observer.next(list);
        observer.complete();
      });
    } else {
      return this.http.get<ListBean<any>>(environment.wsUrl + 'Ubicazioni.php', { params: filter || {}});
    }
  }

  create(obj: any): Observable<ValueBean<any>> {
    this.isMock = false;
    if (this.isMock) {
      return new Observable( observer => {
        observer.next({ value: obj });
        observer.complete();
      });
    } else {
      return this.http.post<ValueBean<any>>(environment.wsUrl + 'Ubicazioni.php', obj);
    }
  }

  update(obj: any): Observable<ValueBean<any>> {
    this.isMock = false;
    if (this.isMock) {
      return new Observable( observer => {
        observer.next({ value: obj });
        observer.complete();
      });
    } else {
      return this.http.put<ValueBean<any>>(environment.wsUrl + 'Ubicazioni.php', obj);
    }
  }

  delete(obj: any): Observable<void> {
    console.log(obj);
    this.isMock = false;
    if (this.isMock) {
      return new Observable( observer => {
        observer.next(undefined);
        observer.complete();
      });
    } else {
      return this.http.delete<any>(environment.wsUrl + `Ubicazioni.php?COD_UBICAZIONE=${obj.COD_UBICAZIONE}`);
    }
  }
}
