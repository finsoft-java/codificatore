INSERT INTO `schemi_codifica` (`TITOLO`, `DESCRIZIONE`, `TIPOLOGIA`, `TPL_CODICE`, `TPL_DESCRIZIONE`, `PRE_RENDER_JS`, `IS_VALID`, `IMMAGINE`, `NOTE_INTERNE`) VALUES
('prova', 'prova', 'P', 'XX_{{NOME}}', 'Nome {{NOME.toUpperCase()}} Eta {{AGE}} capelli {{capelli}}', NULL, 'Y', NULL, NULL),
('prova2', 'prova2', 'P', 'xxx', 'yyy', NULL, 'Y', NULL, NULL);

INSERT INTO `regole` (`ID_REGOLA`, `NOM_VARIABILE`, `ETICHETTA`, `REQUIRED`, `TIPO`, `MAXLENGTH`, `PATTERN_REGEXP`, `NUM_DECIMALI`, `MIN`, `MAX`) VALUES 
(1, 'AGE', 'Età', 'Y', 'number', NULL, NULL, NULL, 14, NULL),
(2, 'capelli', 'Colore dei capelli', 'n', 'elenco', NULL, NULL, NULL, NULL, NULL),
(3, 'NOME', 'Un nome', 'Y', 'text', 20, NULL, NULL, NULL, NULL);

INSERT INTO `schemi_regole` (`ID_SCHEMA`, `NOM_VARIABILE`, `ORD_PRESENTAZIONE`, `ID_REGOLA`) VALUES
(1, 'AGE', 2, 1),
(1, 'capelli', 3, 2),
(1, 'NOME', 1, 3);

INSERT INTO `regole_options` (`ID_REGOLA`, `VALUE_OPTION`, `ETICHETTA`) VALUES
(1, '1', 'Biondi'),
(1, '2', 'Castani'),
(1, '3', 'Neri'),
(1, '4', 'Viola');

COMMIT;