import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Ubicazione, ListBean } from '../_models';
import { environment } from 'src/environments/environment';
import { MockService } from '../mat-edit-table';

@Injectable({
  providedIn: 'root'
})
export class ReportSegnalazioniService extends MockService<Ubicazione> {

  constructor(private http: HttpClient) { super(); }

  getAll(filter: any): Observable<ListBean<any>> {
    return this.http.get<ListBean<any>>(environment.wsUrl + 'SegnalazioniAttive.php', { params: filter });
  }
}
