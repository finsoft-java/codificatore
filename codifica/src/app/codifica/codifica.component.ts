/* eslint-disable no-eval */
import { Component, OnInit } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { Codifica, CodificaDati, IHash, SchemaCodifica, SchemaCodificaRegole } from '../_models';
import { AlertService } from '../_services/alert.service';
import { CodificaService } from '../_services/codifica.service';
import { SchemiCodificaRegoleService } from '../_services/schemi-codifica-regole.service';
import { SchemiCodificaService } from '../_services/schemi-codifica.service';

@Component({
  selector: 'app-codifica',
  templateUrl: './codifica.component.html',
  styleUrls: ['./codifica.component.css']
})
export class CodificaComponent implements OnInit {
  constructor(private svc: SchemiCodificaService,
    private regoleSvc: SchemiCodificaRegoleService,
    private codSvc: CodificaService,
    private alertService: AlertService) { }

  schemi: SchemaCodifica[] = [];
  schemaScelto?: SchemaCodifica;
  parametriObbligatoriSettati = false;
  subschemeCodificationIsActive = false;
  codiceCalcolato = '';
  descrizioneCalcolata = '';
  codificaSalvata?: Codifica;
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
    this.codiceCalcolato = '';
    this.descrizioneCalcolata = '';
    this.parametriObbligatoriSettati = false;
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
    console.log(this.datiCodifica);
    this.datiCodifica.forEach((parametri, idSchema) => {
      Object.keys(parametri).forEach(nomeParametro => {
        const d: CodificaDati = {
          ID_CODIFICA: null,
          ID_SCHEMA: idSchema,
          NOM_VARIABILE: nomeParametro,
          VALORE: parametri[nomeParametro]
        };
        c.DATI!.push(d);
      });
    });
    console.log('SAVING', c);

    this.codSvc.create(c).subscribe(response => {
      this.codificaSalvata = response.value;
      console.log('Codifica was saved;', this.codificaSalvata);
      this.alertService.success('Codifica salvata con successo!');
    },
    error => {
      if (error.status === 401 || error.status === 403) {
        this.alertService.error('Errore del Server');
      } else {
        this.alertService.error(error);
      }
    });
  }

  setParametriObbligatori($event: boolean) {
    this.parametriObbligatoriSettati = $event;
  }

  showError(error: string) {
    this.alertService.error(error);
  }

  activateSubschemeCodification() {
    this.reset();
    if (this.subschemeCodificationIsActive) {
      this.svc.getValidiPubblici().subscribe(response => {
        this.schemi = response.data;
        this.subschemeCodificationIsActive = false;
      },
      error => {
        this.alertService.error('Errore nel caricare i dati');
      });
    }
    else {
      this.svc.getAll().subscribe(response => {
        this.schemi = response.data;
        this.subschemeCodificationIsActive = true;
      },
      error => {
        this.alertService.error('Errore nel caricare i dati');
      });
    }
  }
}
