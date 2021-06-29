import { Component, OnInit } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { SchemaCodifica, SchemaCodificaRegole } from '../_models';
import { SchemiCodificaRegoleService } from '../_services/schemi-codifica-regole.service';
import { SchemiCodificaService } from '../_services/schemi-codifica.service';

// normale array associativo di Javascript
export interface IHash {
  [details: string]: string;
}

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
  calcoloCompletato = false;
  codiceCalcolato = '';
  descrizioneCalcolata = '';
  parametri: IHash = {};

  ngOnInit(): void {
    // ***TODO*** CARICARE SOLO GLI SCHEMI VALIDI

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
    this.codiceCalcolato = '';
    this.descrizioneCalcolata = '';
    this.calcoloCompletato = false;
  }

  onChangeInputRule(nomVariabile: string, evt: Event) {
    this.parametri[nomVariabile] = (<HTMLInputElement>evt.target).value;
    console.log(this.parametri);
    this.componiCodiceDescrizione();
  }

  onChangeSelectRule(nomVariabile: string, evt: MatSelectChange) {
    this.parametri[nomVariabile] = evt.value;
    console.log(this.parametri);
    this.componiCodiceDescrizione();
  }

  componiCodice(): boolean {
    if (!this.schemaScelto) return false;
    if (!this.schemaScelto!.TPL_CODICE) return false;

    let codice = this.schemaScelto!.TPL_CODICE;

    const matches = codice.match(/{{\s*[\w]+\s*}}/g);
    console.log(matches);
    let completed = true;
    if (matches != null) {
      matches.forEach(m => {
        const name = m.substring(2, m.length - 2);
        if (!(name in this.parametri)) {
          completed = false;
          codice = codice.replace(m, '');
        } else {
          codice = codice.replace(m, this.parametri[name]);
        }
      });
    }

    this.codiceCalcolato = codice;
    return completed;
  }

  componiDescrizione(): boolean {
    if (!this.schemaScelto) return false;
    if (!this.schemaScelto!.TPL_DESCRIZIONE) return false;

    let descrizione = this.schemaScelto!.TPL_DESCRIZIONE;

    const matches = descrizione.match(/{{\s*[\w]+\s*}}/g);
    console.log(matches);
    let completed = true;
    if (matches != null) {
      matches.forEach(m => {
        const name = m.substring(2, m.length - 2);
        if (!(name in this.parametri)) {
          completed = false;
          descrizione = descrizione.replace(m, '');
        } else {
          descrizione = descrizione.replace(m, this.parametri[name]);
        }
      });
    }

    this.descrizioneCalcolata = descrizione;
    return completed;
  }

  componiCodiceDescrizione() {
    if (!this.schemaScelto) return;
    this.calcoloCompletato = this.componiCodice() && this.componiDescrizione();
  }
}
