import { Component, OnInit } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { SchemaCodifica, SchemaCodificaRegole } from '../_models';
import { SchemiCodificaRegoleService } from '../_services/schemi-codifica-regole.service';
import { SchemiCodificaService } from '../_services/schemi-codifica.service';

@Component({
  selector: 'app-codifica',
  templateUrl: './codifica.component.html',
  styleUrls: ['./codifica.component.css']
})
export class CodificaComponent implements OnInit {
  constructor(private svc: SchemiCodificaService, private regoleSvc: SchemiCodificaRegoleService) { }

  schemi: SchemaCodifica[] = [];
  schemaScelto?: SchemaCodifica;
  regoleSchemaScelto: SchemaCodificaRegole[] = [];

  ngOnInit(): void {
    this.svc.getAll().subscribe(response => {
      this.schemi = response.data;
    });
  }

  /**
   * Quando l'utente sceglie lo schema, aggiorniamo l'intera pagina e disabilitiamo la scelta dello schema.
   */
  onSelect(event: MatSelectChange) {
    const schemaScelto = event.value;
    if (schemaScelto !== undefined && schemaScelto !== null) {
      this.regoleSvc.getAll(schemaScelto.ID_SCHEMA).subscribe(response => {
        this.regoleSchemaScelto = response.data;
      });
    }
  }

  reset() {
    this.schemaScelto = undefined;
    this.regoleSchemaScelto = [];
  }
}
