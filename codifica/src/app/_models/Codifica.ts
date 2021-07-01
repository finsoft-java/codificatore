import { CodificaDati } from './CodificaDati';

export interface Codifica {
  ID_CODIFICA: number;
  ID_SCHEMA: number;
  CODICE: string;
  DESCRIZIONE: string;
  UTENTE_CODIFICATORE: string;
  DATI?: CodificaDati[];
}
