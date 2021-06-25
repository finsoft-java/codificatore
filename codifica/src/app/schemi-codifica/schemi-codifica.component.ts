import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ColumnDefinition } from '../mat-edit-table';
import { SchemaCodificaRegole } from '../_models';
import { AlertService } from '../_services/alert.service';
import { SchemiCodificaRegoleService } from '../_services/schemi-codifica-regole.service';

@Component({
  selector: 'app-schemi-codifica',
  templateUrl: './schemi-codifica.component.html',
  styleUrls: ['./schemi-codifica.component.css']
})
export class SchemiCodificaComponent implements OnInit {
  service: SchemiCodificaRegoleService;
  datePipe: DatePipe = new DatePipe('en-US');
  alert: AlertService;
  columns: ColumnDefinition<SchemaCodificaRegole>[] = [
    {
      title: 'ID',
      data: 'ID_SCHEMA',
      type: 'number',
      width: '30%',
      disabled: true
    },
    {
      title: 'Titolo',
      data: 'TITOLO',
      type: 'text',
      width: '50%'
    }
  ];
  myDataArray = [{ id: 1, titolo: 'a' }, { id: 2, titolo: 'b' }];
  displayedColumns: string[] = ['id', 'titolo'];
  // commento

  constructor(private svc: SchemiCodificaRegoleService, private alertSvc: AlertService) {
    this.service = svc;
    this.alert = alertSvc;
  }
  setError(errore: any) {
    console.log(errore);
    this.alert.error(errore);
  }
  ngOnInit(): void {
  }
}
