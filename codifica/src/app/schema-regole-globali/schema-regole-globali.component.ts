import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { SchemiCodificaRegoleService } from '../_services/schemi-codifica-regole.service';
import { SchemaCodifica, SchemaCodificaRegole } from '../_models';
import { AlertService } from '../_services/alert.service';
import { SchemiCodificaService } from '../_services/schemi-codifica.service';

@Component({
  selector: 'app-schema-regole-globali',
  templateUrl: './schema-regole-globali.component.html',
  styleUrls: ['./schema-regole-globali.component.css']
})
export class SchemaRegoleGlobaliComponent implements OnInit {
  regoleGlobali: SchemaCodificaRegole[] = [];
  regoleByPage: SchemaCodificaRegole[] = [];
  nuovaRegola!: SchemaCodificaRegole;
  pageSize: number = 10;
  pageIndex: number = 0;
  listaSchemiInterni: SchemaCodifica[] = [];
  newRuleFormOpened: boolean = false;

  constructor(
    private regoleService: SchemiCodificaRegoleService,
    private schemiCodificaService: SchemiCodificaService,
    private alertService: AlertService
  ) { }

  ngOnInit(): void {
    this.getAll();
    this.getAllSubschema();
  }

  getAll() {
    this.regoleService.getAllGlobali().subscribe(response => {
      this.regoleGlobali = response.data;
      this.regoleByPage = this.regoleGlobali.slice(0, this.pageSize);
    },
    error => {
      if (error.status === 401 || error.status === 403) {
        this.alertService.error('Errore del Server');
      } else {
        // Ad esempio: Impossibile conettersi al server PHP
        this.alertService.error(error);
      }
    });
  }

  getAllSubschema() {
    this.schemiCodificaService.getValidiInterni().subscribe(response => {
      this.listaSchemiInterni = response.data;
    });
  }

  changePage(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    const last: number = this.regoleGlobali.length - (this.pageIndex * this.pageSize) < 10
      ? this.regoleGlobali.length
      : (this.pageIndex * this.pageSize) + this.pageSize;
    this.regoleByPage = this.regoleGlobali.slice(this.pageIndex * this.pageSize, last);
  }

  refreshRegole(message: string) {
    this.alertService.success(message);
    this.getAll();
    this.pageIndex = 0;
  }

  newRegola(message: string) {
    this.toggleNewRuleForm();
    this.alertService.success(message);
    this.getAll();
    this.pageIndex = 0;
  }

  toggleNewRuleForm() {
    this.nuovaRegola = {
      ID_SCHEMA: null,
      ID_REGOLA: -1, // deve essere settato server-side
      NOM_VARIABILE: '',
      GLOBAL: 'Y',
      ORD_PRESENTAZIONE: 10,
      ETICHETTA: '',
      REQUIRED: 'N',
      TIPO: 'text',
      MAXLENGTH: null,
      PATTERN_REGEXP: null,
      NUM_DECIMALI: null,
      MIN: null,
      MAX: null,
      OPTIONS: [],
      SOTTOSCHEMI: []
    };
    this.newRuleFormOpened = !this.newRuleFormOpened;
  }
}
