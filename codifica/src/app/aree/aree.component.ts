import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ColumnDefinition } from '../mat-edit-table';
import { Area } from '../_models';
import { AreeService } from '../_services/aree.service';
import { AlertService } from '../_services/alert.service';

@Component({
  selector: 'app-aree',
  templateUrl: './aree.component.html',
  styleUrls: ['./aree.component.css']
})
export class AreeComponent implements OnInit {
  service: AreeService;
  datePipe: DatePipe = new DatePipe('en-US');
  alert: AlertService;
  columns: ColumnDefinition<Area>[] = [
    {
      title: 'Codice',
      data: 'COD_AREA',
      type: 'text',
      width: '30%',
      disabled: true
    },
    {
      title: 'Descrizione',
      data: 'DESCRIZIONE',
      type: 'text',
      width: '50%'
    }
  ];

  constructor(private areeSvc: AreeService, private alertSvc: AlertService) {
    this.service = areeSvc;
    this.alert = alertSvc;
  }
  setError(errore: any) {
    console.log(errore);
    this.alert.error(errore);
  }
  ngOnInit(): void {
  }
}
