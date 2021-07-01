/* eslint-disable no-eval */
import { Component, OnInit } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { Codifica, CodificaDati, SchemaCodifica, SchemaCodificaRegole } from '../_models';
import { CodificaService } from '../_services/codifica.service';
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
  constructor(private svc: SchemiCodificaService,
    private regoleSvc: SchemiCodificaRegoleService,
    private codSvc: CodificaService) { }

  schemi: SchemaCodifica[] = [];
  schemaScelto?: SchemaCodifica;
  regoleSchemaScelto: SchemaCodificaRegole[] = [];
  calcoloCompletato = true; // FIXME la dovrebbe settare l'interfaccia
  codiceCalcolato = '';
  descrizioneCalcolata = '';
  parametri: IHash = {};
  codificaSalvata?: Codifica;

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
    if (schemaScelto !== undefined && schemaScelto !== null) {
      this.regoleSvc.getAll(schemaScelto.ID_SCHEMA).subscribe(response => {
        this.regoleSchemaScelto = response.data;
        this.regoleSchemaScelto.forEach(r => {
          this.parametri[r.NOM_VARIABILE] = '';
        });
      });
    }
  }

  reset() {
    this.schemaScelto = undefined;
    this.regoleSchemaScelto = [];
    this.codiceCalcolato = '';
    this.descrizioneCalcolata = '';
    // this.calcoloCompletato = false;
    this.parametri = {};
  }

  onChangeInputRule(nomVariabile: string, evt: Event) {
    this.parametri[nomVariabile] = (<HTMLInputElement>evt.target).value;
    this.componiCodiceDescrizione();
  }

  onChangeSelectRule(nomVariabile: string, evt: MatSelectChange) {
    this.parametri[nomVariabile] = evt.value;
    this.componiCodiceDescrizione();
  }

  /**
   * Compone una stringa template con i parametri presenti in this.parametri
   * @returns rendered template
   */
  componi(template: string): string {
    if (!template) return '';

    const matches = template.match(/{{[^}]*}}/g);
    console.log(this.parametri);

    let result = template;
    if (matches != null) {
      matches.forEach(m => {
        let formula = '';
        Object.keys(this.parametri).forEach(p => {
          formula += `var ${p}='${this.parametri[p]}';`;
        });
        formula += m.substring(2, m.length - 2);
        const repl = eval(formula);
        result = result.replace(m, repl || '');
      });
    }

    return result;
  }

  componiCodiceDescrizione() {
    if (!this.schemaScelto) return;

    this.codiceCalcolato = this.componi(this.schemaScelto!.TPL_CODICE);
    this.descrizioneCalcolata = this.componi(this.schemaScelto!.TPL_DESCRIZIONE);
  }

  /**
   * Da richiamare a calcolo completato
   */
  salvaCodifica() {
    const c: Codifica = {
      ID_CODIFICA: null,
      ID_SCHEMA: this.schemaScelto!.ID_SCHEMA,
      CODICE: this.codiceCalcolato,
      DESCRIZIONE: this.descrizioneCalcolata,
      DATI: []
    };
    const dati: CodificaDati[] = Object.keys(this.parametri).map(p => ({
      ID_CODIFICA: null,
      ID_SCHEMA: this.schemaScelto!.ID_SCHEMA,
      NOM_VARIABILE: p,
      VALORE: this.parametri[p]
    }));
    c.DATI!.push(...dati);

    this.codSvc.create(c).subscribe(response => {
      this.codificaSalvata = response.value;
      console.log('Codifica was saved;', this.codificaSalvata);
    });
  }
}
