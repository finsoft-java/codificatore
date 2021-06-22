import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpCrudService } from './HttpCrudService';
import { Area, ListBean, ValueBean } from '../_models';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AreeService implements HttpCrudService<Area> {

  constructor(private http: HttpClient) { }

  isMock = false;
  mockData: ListBean<Area> = {
    data: [
      {
        COD_AREA: 'M1',
        DESCRIZIONE: 'Area M1'
      },
      {
        COD_AREA: 'M2',
        DESCRIZIONE: 'Area M2'
      },
      {
        COD_AREA: 'M3',
        DESCRIZIONE: 'Area M3'
      },
      {
        COD_AREA: 'M5',
        DESCRIZIONE: 'Area M5'
      },
      {
        COD_AREA: 'M6',
        DESCRIZIONE: 'Area M6'
      },
    ],
    count: 5
  };

  getAll(): Observable<ListBean<Area>> {
    if (this.isMock) {
      return new Observable( observer => {
        // JSON parse/stringify serve per eseguire una deep copy
        const list: ListBean<Area> = JSON.parse(JSON.stringify(this.mockData));
        observer.next(list);
        observer.complete();
      });
    } else {
      return this.http.get<ListBean<Area>>(environment.wsUrl + 'Aree.php');
    }
  }

  create(obj: Area): Observable<ValueBean<Area>> {
    if (this.isMock) {
      return new Observable( observer => {
        observer.next({ value: obj });
        observer.complete();
      });
    } else {
      return this.http.post<ValueBean<Area>>(environment.wsUrl + 'Aree.php', obj);
    }
  }

  update(obj: Area): Observable<ValueBean<Area>> {
    if (this.isMock) {
      return new Observable( observer => {
        observer.next({ value: obj });
        observer.complete();
      });
    } else {
      return this.http.put<ValueBean<Area>>(environment.wsUrl + 'Aree.php', obj);
    }
  }

  delete(obj: Area): Observable<void> {
    if (this.isMock) {
      return new Observable( observer => {
        observer.next(undefined);
        observer.complete();
      });
    } else {
      return this.http.delete<any>(environment.wsUrl + `Aree.php?COD_AREA=${obj.COD_AREA}`);
    }
  }
}
