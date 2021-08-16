import { Component, OnInit } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { Codifica, IHash, SchemaCodifica, SchemaCodificaRegole } from '../_models';
import { CodificaService } from '../_services/codifica.service';
import { SchemiCodificaRegoleService } from '../_services/schemi-codifica-regole.service';
import { SchemiCodificaService } from '../_services/schemi-codifica.service';

@Component({
  selector: 'app-ricerca',
  templateUrl: './ricerca.component.html',
  styleUrls: ['./ricerca.component.css']
})
export class RicercaComponent implements OnInit {
  constructor(private svc: SchemiCodificaService,
    private regoleSvc: SchemiCodificaRegoleService,
    private codSvc: CodificaService) { }

  schemi: SchemaCodifica[] = [];
  schemaScelto?: SchemaCodifica;
  regoleSchemaScelto: SchemaCodificaRegole[] = [];
  datiCodifica: IHash[] = []; // Contiene tutti i parametri di tutti i sottoschemi

  ngOnInit(): void {
    this.svc.getValidiPubblici().subscribe(response => {
      this.schemi = response.data;
    });
  }

  /**
   * Quando l'utente sceglie lo schema, aggiorniamo l'intera pagina e disabilitiamo la scelta dello schema.
   */
  onSelectSchema(event: MatSelectChange) {
    const schemaScelto = event.value;
  }

  reset() {
    this.schemaScelto = undefined;
  }
}
