
export interface Area {
  COD_AREA: string;
  DESCRIZIONE: string;
}

export interface Articolo {
  ID_ARTICOLO: string;
  DESCRIZIONE: string;
}

export interface Ubicazione {
  COD_UBICAZIONE: string;
  COD_ARTICOLO_CONTENUTO: string;
  QUANTITA_PREVISTA: number;
  COD_AREA: string;
  SEGNALAZIONE_ESAURIMENTO: string;
  DESCRIZIONE_AREA: string;
}

export interface StoricoOperazione {
  ID_OPERAZIONE: number;
  COD_UTENTE: string;
  COD_OPERAZIONE: string;
  COD_ARTICOLO: string;
  COD_UBICAZIONE: string;
  COD_AREA: string;
  TIMESTAMP: string;
}

export class User {
  username = '';
  password = '';
}

export interface UbicazionePerArea {
  COD_AREA: string;
  DESCRIZIONE: string;
  NUM_UBICAZIONI: number;
  IN_ESAURIMENTO: number;
}

