<?php

$codificaManager = new CodificaManager();

class CodificaManager {
    
    function getAll() {
        // TODO qui serviranno filtri e paginazione

        $sql0 = "SELECT COUNT(*) AS cnt ";
        $sql1 = "SELECT * ";
        $sql = "FROM codifiche x ";
        $sql .= "ORDER BY x.ID_CODIFICA DESC ";
        $count = select_single_value($sql0 . $sql);
        $objects = select_list($sql1 . $sql);        
        return [$objects, $count];
    }
    
    function getById($idCodifica) {
        $sql = "SELECT * FROM codifiche x WHERE x.id_codifica=idCodifica ";
        return select_single($sql);
    }

/*    function crea($json_data) {

        $sql = insert("codifiche", ["ID_SCHEMA" => $con->escape_string($json_data->ID_SCHEMA),
                                "NOM_VARIABILE" => $con->escape_string($json_data->NOM_VARIABILE),
                                "ORD_PRESENTAZIONE" => $con->escape_string($json_data->ORD_PRESENTAZIONE),
                                "ETICHETTA" => $con->escape_string($json_data->ETICHETTA),
                                "REQUIRED" => $con->escape_string($json_data->REQUIRED),
                                "TIPO" => $con->escape_string($json_data->TIPO),
                                "MAXLENGTH" => $con->escape_string($json_data->MAXLENGTH),
                                "PATTERN_REGEXP" => $con->escape_string($json_data->PATTERN_REGEXP),
                                "NUM_DECIMALI" => $con->escape_string($json_data->NUM_DECIMALI),
                                "MIN" => $con->escape_string($json_data->MIN),
                                "MAX" => $con->escape_string($json_data->MAX)
                                ]);
        execute_update($sql);
        return $this->getById($json_data->ID_CODIFICA);
    }
*/
    function elimina($idCodifica) {
        $sql = "DELETE FROM codifiche WHERE ID_CODIFICA = $idCodifica' ";
        execute_update($sql);
    }

}
?>