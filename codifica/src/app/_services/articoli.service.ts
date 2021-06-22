import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Articolo, ListBean } from '../_models';
import { environment } from 'src/environments/environment';
import { MockService } from '../mat-edit-table';

@Injectable({
  providedIn: 'root'
})
export class ArticoliService extends MockService<Articolo> {

  constructor(private http: HttpClient) { super(); }
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

  getAll(filter?: any): Observable<ListBean<Articolo>> {
    console.log(filter);
    this.isMock = false;
    if (this.isMock) {
      return new Observable( observer => {
        // JSON parse/stringify serve per eseguire una deep copy
        const list: ListBean<any> = JSON.parse(JSON.stringify(this.mockData));
        observer.next(list);
        observer.complete();
      });
    } else {
      if (!filter) {
        filter = {};
      }
      if (!filter.top) {
        filter.top = 10;
      }
      return this.http.get<ListBean<any>>(environment.wsUrl + 'Articoli.php', { params: filter || {}});
      
    }
  }

}
