-- phpMyAdmin SQL Dump
-- version 5.0.4
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Creato il: Giu 22, 2021 alle 14:19
-- Versione del server: 10.4.17-MariaDB
-- Versione PHP: 7.3.27

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `codifica`
--

-- --------------------------------------------------------

--
-- Struttura della tabella `codifiche`
--

CREATE TABLE `codifiche` (
  `ID_CODIFICA` int(11) NOT NULL,
  `ID_SCHEMA` int(11) NOT NULL,
  `CODICE` varchar(255) NOT NULL,
  `DESCRIZIONE` varchar(255) NOT NULL,
  `UTENTE_CODIFICATORE` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Struttura della tabella `codifiche_dati`
--

CREATE TABLE `codifiche_dati` (
  `ID_CODIFICA` int(11) NOT NULL,
  `NOM_VARIABILE` varchar(20) NOT NULL,
  `ID_SCHEMA` int(11) NOT NULL,
  `VALORE` varchar(255)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Struttura della tabella `schemi_codifica`
--

CREATE TABLE `schemi_codifica` (
  `ID_SCHEMA` int(11) NOT NULL,
  `TITOLO` varchar(255) NOT NULL,
  `DESCRIZIONE` varchar(2000) NOT NULL,
  `TIPOLOGIA` char(1) NOT NULL,
  `TPL_CODICE` varchar(255) DEFAULT NULL,
  `TPL_DESCRIZIONE` varchar(2000) DEFAULT NULL,
  `PRE_RENDER_JS` varchar(2000) DEFAULT NULL,
  `IS_VALID` char(1) DEFAULT NULL,
  `IMMAGINE` blob DEFAULT NULL,
  `NOTE_INTERNE` varchar(2000) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Struttura della tabella `schemi_options`
--

CREATE TABLE `schemi_options` (
  `ID_SCHEMA` int(11) NOT NULL,
  `NOM_VARIABILE` varchar(20) NOT NULL,
  `VALUE_OPTION` varchar(255) NOT NULL,
  `ETICHETTA` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Struttura della tabella `schemi_regole`
--

CREATE TABLE `schemi_regole` (
  `ID_SCHEMA` int(11) NOT NULL,
  `NOM_VARIABILE` varchar(20) NOT NULL,
  `ORD_PRESENTAZIONE` int(11) NOT NULL,
  `ETICHETTA` varchar(255) NOT NULL,
  `REQUIRED` char(1) NOT NULL,
  `TIPO` varchar(255) NOT NULL,
  `MAXLENGTH` int(11) DEFAULT NULL,
  `PATTERN_REGEXP` int(11) DEFAULT NULL,
  `NUM_DECIMALI` int(11) DEFAULT NULL,
  `MIN` double DEFAULT NULL,
  `MAX` double DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Struttura della tabella `schemi_sottoschemi`
--

CREATE TABLE `schemi_sottoschemi` (
  `ID_SCHEMA` int(11) NOT NULL,
  `NOM_VARIABILE` varchar(20) NOT NULL,
  `ID_SOTTO_SCHEMA` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Indici per le tabelle scaricate
--

--
-- Indici per le tabelle `codifiche`
--
ALTER TABLE `codifiche`
  ADD PRIMARY KEY (`ID_CODIFICA`),
  ADD KEY `ID_SCHEMA` (`ID_SCHEMA`);

ALTER TABLE `codifiche`
  MODIFY `ID_CODIFICA` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;

--
-- Indici per le tabelle `codifiche_dati`
--
ALTER TABLE `codifiche_dati`
  ADD PRIMARY KEY (`ID_CODIFICA`,`NOM_VARIABILE`),
  ADD KEY `ID_SCHEMA` (`ID_SCHEMA`);

--
-- Indici per le tabelle `schemi_codifica`
--
ALTER TABLE `schemi_codifica`
  ADD PRIMARY KEY (`ID_SCHEMA`);

ALTER TABLE `schemi_codifica`
  MODIFY `ID_SCHEMA` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;
--
-- Indici per le tabelle `schemi_options`
--
ALTER TABLE `schemi_options`
  ADD PRIMARY KEY (`ID_SCHEMA`,`NOM_VARIABILE`,`VALUE_OPTION`);

--
-- Indici per le tabelle `schemi_regole`
--
ALTER TABLE `schemi_regole`
  ADD PRIMARY KEY (`ID_SCHEMA`,`NOM_VARIABILE`);

--
-- Indici per le tabelle `schemi_sottoschemi`
--
ALTER TABLE `schemi_sottoschemi`
  ADD PRIMARY KEY (`ID_SCHEMA`,`NOM_VARIABILE`,`ID_SOTTO_SCHEMA`),
  ADD KEY `ID_SOTTO_SCHEMA` (`ID_SOTTO_SCHEMA`);

--
-- Limiti per le tabelle scaricate
--

--
-- Limiti per la tabella `codifiche`
--
ALTER TABLE `codifiche`
  ADD CONSTRAINT `codifiche_ibfk_1` FOREIGN KEY (`ID_SCHEMA`) REFERENCES `schemi_codifica` (`ID_SCHEMA`);

--
-- Limiti per la tabella `codifiche_dati`
--
ALTER TABLE `codifiche_dati`
  ADD CONSTRAINT `codifiche_dati_ibfk_1` FOREIGN KEY (`ID_CODIFICA`) REFERENCES `codifiche` (`ID_CODIFICA`),
  ADD CONSTRAINT `codifiche_dati_ibfk_2` FOREIGN KEY (`ID_SCHEMA`) REFERENCES `schemi_codifica` (`ID_SCHEMA`);

--
-- Limiti per la tabella `schemi_options`
--
ALTER TABLE `schemi_options`
  ADD CONSTRAINT `schemi_options_ibfk_1` FOREIGN KEY (`ID_SCHEMA`,`NOM_VARIABILE`) REFERENCES `schemi_regole` (`ID_SCHEMA`, `NOM_VARIABILE`);

--
-- Limiti per la tabella `schemi_regole`
--
ALTER TABLE `schemi_regole`
  ADD CONSTRAINT `schemi_regole_ibfk_1` FOREIGN KEY (`ID_SCHEMA`) REFERENCES `schemi_codifica` (`ID_SCHEMA`);

--
-- Limiti per la tabella `schemi_sottoschemi`
--
ALTER TABLE `schemi_sottoschemi`
  ADD CONSTRAINT `schemi_sottoschemi_ibfk_1` FOREIGN KEY (`ID_SOTTO_SCHEMA`) REFERENCES `schemi_codifica` (`ID_SCHEMA`),
  ADD CONSTRAINT `schemi_sottoschemi_ibfk_2` FOREIGN KEY (`ID_SCHEMA`,`NOM_VARIABILE`) REFERENCES `schemi_regole` (`ID_SCHEMA`, `NOM_VARIABILE`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
