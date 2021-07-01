/* eslint-disable no-eval */
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { IHash, SchemaCodifica, SchemaCodificaRegole } from '../_models';
import { SchemiCodificaRegoleService } from '../_services/schemi-codifica-regole.service';
import { SchemiCodificaService } from '../_services/schemi-codifica.service';

@Component({
  selector: 'app-codifica-subform',
  templateUrl: './codifica-subform.component.html',
  styleUrls: ['./codifica-subform.component.css']
})
export class CodificaSubformComponent implements OnInit {
  constructor(private svcSchemi: SchemiCodificaService,
    private regoleSvc: SchemiCodificaRegoleService) { }

  @Input()
  idSchema!: number;
  @Input()
  soloSchemiInterni = true;

  @Output()
  changeCodice: EventEmitter<string> = new EventEmitter<string>();
  @Output()
  changeDescrizione: EventEmitter<string> = new EventEmitter<string>();
  @Output()
  changeDatiCodifica: EventEmitter<IHash[]> = new EventEmitter<IHash[]>();

  schema?: SchemaCodifica;
  regole: SchemaCodificaRegole[] = [];
  schemi: SchemaCodifica[] = [];
  parametri: IHash = {};
  codiceCalcolato = '';
  descrizioneCalcolata = '';
  parametriSottoSchemi: IHash[] = [];

  ngOnInit(): void {
    // Carico lo schema (ma serve??)
    this.svcSchemi.getById(this.idSchema).subscribe(response => {
      this.schema = response.value;
    });
    // Carico le regole
    this.regoleSvc.getAll(this.idSchema).subscribe(response => {
      this.regole = response.data;
      this.regole.forEach(r => {
        this.parametri[r.NOM_VARIABILE] = '';
        if (r.TIPO === 'sottoschema') {
          this.parametri[r.NOM_VARIABILE + '.codice'] = '';
          this.parametri[r.NOM_VARIABILE + '.descrizione'] = '';
        }
      });
    });
    // Carico gli schemi interni (in realtà servono solo
    // se ci sono delle regole con sottoschema)
    if (this.soloSchemiInterni) {
      this.svcSchemi.getValidiInterni().subscribe(response => {
        this.schemi = response.data;
      });
    } else {
      // solo i pubblici: ok??
      this.svcSchemi.getValidiPubblici().subscribe(response => {
        this.schemi = response.data;
      });
    }
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
   * @param nomVariabileFull nomVariabile.nomesottovariabile (codice o descrizione)
   */
  onChangeVariabileSottoschema(nomVariabile: string, nomSottoVariabile: string, evt: string) {
    this.parametri[nomVariabile + '.' + nomSottoVariabile] = evt;
    this.componiCodiceDescrizione();
  }

  parseInt(s: string) {
    return Number(s);
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
    if (!this.schema) return;

    this.codiceCalcolato = this.componi(this.schema!.TPL_CODICE);
    this.descrizioneCalcolata = this.componi(this.schema!.TPL_DESCRIZIONE);

    this.changeCodice.emit(this.codiceCalcolato);
    this.changeDescrizione.emit(this.descrizioneCalcolata);

    const datiCodifica = [];
    // clone preserving indexes
    this.parametriSottoSchemi.forEach((x, i) => { datiCodifica[i] = x; });
    datiCodifica[this.idSchema] = this.parametri;

    this.changeDatiCodifica.emit(datiCodifica);
  }
}
