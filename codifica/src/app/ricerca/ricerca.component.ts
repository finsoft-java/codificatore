import { Component, OnInit } from '@angular/core';
import { SchemaCodifica, SchemaCodificaRegole } from '../_models';
import { SchemiCodificaRegoleService } from '../_services/schemi-codifica-regole.service';
import { SchemiCodificaService } from '../_services/schemi-codifica.service';

// normale array associativo di Javascript
export interface IHash {
  [details: string]: string;
}

@Component({
  selector: 'app-ricerca',
  templateUrl: './ricerca.component.html',
  styleUrls: ['./ricerca.component.css']
})
export class RicercaComponent implements OnInit {
  constructor(private svc: SchemiCodificaService, private regoleSvc: SchemiCodificaRegoleService) { }

  schemi: SchemaCodifica[] = [];
  schemaScelto?: SchemaCodifica;
  regoleSchemaScelto: SchemaCodificaRegole[] = [];
  parametri: IHash = {};

  ngOnInit(): void {
    this.svc.getAllValidi().subscribe(response => {
      this.schemi = response.data;
    });
  }
}
