<?php

$codificaManager = new CodificaManager();

class CodificaManager {
    
    function getAll($top=null, $skip=null) {

        $sql0 = "SELECT COUNT(*) AS cnt ";
        $sql1 = "SELECT * ";
        $sql = "FROM codifiche x ";
        $sql .= "ORDER BY x.ID_CODIFICA DESC ";

        // paginazione
        if ($top) {
            if ($skip) {
                $sql .= "LIMIT $skip,$top ";
            } else {
                $sql .= "LIMIT $top ";
            }
        }

        $count = select_single_value($sql0 . $sql);
        $objects = select_list($sql1 . $sql);        
        return [$objects, $count];
    }
    
    function getById($idCodifica) {
        $sql = "SELECT * FROM codifiche x WHERE x.id_codifica=$idCodifica ";
        return select_single($sql);
    }

    /**
     * Salva sia la tabella codifiche, sia la codifiche_dati
     */
    function crea($json_data) {
        global $logged_user, $con;
        $sql = insert("codifiche", ["ID_CODIFICA" => null,
                                "ID_SCHEMA" => $con->escape_string($json_data->ID_SCHEMA),
                                "CODICE" => $con->escape_string($json_data->CODICE),
                                "DESCRIZIONE" => $con->escape_string($json_data->DESCRIZIONE),
                                "UTENTE_CODIFICATORE" => $logged_user->nome_utente
                                ]);
        execute_update($sql);
        $idCodifica = $con->insert_id;

        if (isset($json_data->DATI)) {
            foreach($json_data->DATI as $d) {
                $sql = insert("codifiche_dati", ["ID_CODIFICA" => $idCodifica,
                                        "ID_SCHEMA" => $con->escape_string($d->ID_SCHEMA),
                                        "NOM_VARIABILE" => $con->escape_string($d->NOM_VARIABILE),
                                        "VALORE" => $con->escape_string($d->VALORE)
                                        ]);
                execute_update($sql);
            }
        }

        return $this->getById($idCodifica);
    }

    function elimina($idCodifica) {
        $sql = "DELETE FROM codifiche WHERE ID_CODIFICA = $idCodifica ";
        execute_update($sql);
    }

}
?>