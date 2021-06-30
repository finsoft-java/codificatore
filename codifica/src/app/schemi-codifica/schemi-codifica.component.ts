import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { ColumnDefinition } from '../mat-edit-table';
import { SchemaCodifica } from '../_models';
import { AlertService } from '../_services/alert.service';
import { SchemiCodificaService } from '../_services/schemi-codifica.service';

@Component({
  selector: 'app-schemi-codifica',
  templateUrl: './schemi-codifica.component.html',
  styleUrls: ['./schemi-codifica.component.css']
})
export class SchemiCodificaComponent implements OnInit {
  service: SchemiCodificaService;
  datePipe: DatePipe = new DatePipe('en-US');
  alert: AlertService;
  routerFrontend: Router;
  schemaCodificaList: SchemaCodifica[] = [];

  displayedColumns: string[] = ['TITOLO', 'DESCRIZIONE', 'TIPOLOGIA'];
  // commento

  constructor(private svc: SchemiCodificaService, private alertSvc: AlertService, private router: Router) {
    this.service = svc;
    this.alert = alertSvc;
    this.routerFrontend = router;
  }

  setError(errore: any) {
    console.log(errore);
    this.alert.error(errore);
  }
  ngOnInit(): void {
    this.service.getAll()
      .subscribe(
        response => {
          this.schemaCodificaList = response.data;
          console.log(this.schemaCodificaList);
        },
        error => {
          if (error.status === 401 || error.status === 403) {
            this.alertSvc.error('Errore del Server');
          } else {
            // Ad esempio: Impossibile conettersi al server PHP
            this.alertSvc.error(error);
          }
          // this.loading = false;
        }
      );
  }
}
