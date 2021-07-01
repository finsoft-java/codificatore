import { CodificaDati } from './CodificaDati';

export interface Codifica {
  ID_CODIFICA: number|null;
  ID_SCHEMA: number;
  CODICE: string;
  DESCRIZIONE: string;
  UTENTE_CODIFICATORE?: string;
  DATI?: CodificaDati[];
}
