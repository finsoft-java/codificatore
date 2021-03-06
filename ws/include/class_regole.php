<?php

$regoleManager = new RegoleManager();

class RegoleManager {
    
    function getAllByIdSchema($idSchema) {
        $sql0 = "SELECT COUNT(*) AS cnt ";
        $sql1 = "SELECT s.*,r.GLOBAL,r.HINT,r.ETICHETTA,r.REQUIRED,r.TIPO,r.MAXLENGTH,r.PATTERN_REGEXP,r.NUM_DECIMALI,r.MIN,r.MAX ";
        $sql = "FROM schemi_regole s JOIN regole r ON r.ID_REGOLA=s.ID_REGOLA WHERE ID_SCHEMA=$idSchema " .
               "ORDER BY s.ORD_PRESENTAZIONE ";
        $count = select_single_value($sql0 . $sql);
        $objects = select_list($sql1 . $sql);

        foreach($objects as $id => $o) {
            $objects[$id] = $this->_completaRegola($o);
        }
        return [$objects, $count];
    }

    function getAllGlobali() {
        $sql0 = "SELECT COUNT(*) AS cnt ";
        $sql1 = "SELECT NULL AS IS_SCHEMA, NULL AS ORD_PRESENTAZIONE, r.* ";
        $sql = "FROM regole r WHERE GLOBAL='Y' " .
               "ORDER BY r.NOM_VARIABILE ";
        $count = select_single_value($sql0 . $sql);
        $objects = select_list($sql1 . $sql);

        foreach($objects as $id => $o) {
            $objects[$id] = $this->_completaRegola($o);
        }
        return [$objects, $count];
    }
    
    function getById($idSchema, $nomVariabile) {
        $sql = "SELECT s.*,r.GLOBAL,r.HINT,r.ETICHETTA,r.REQUIRED,r.TIPO,r.MAXLENGTH,r.PATTERN_REGEXP,r.NUM_DECIMALI,r.MIN,r.MAX " .
                "FROM schemi_regole s JOIN regole r ON r.ID_REGOLA=s.ID_REGOLA " .
                "WHERE s.ID_SCHEMA=$idSchema AND s.NOM_VARIABILE='$nomVariabile' " .
                "ORDER BY s.ORD_PRESENTAZIONE ";
        $o = select_single($sql);

        return $this->_completaRegola($o);
    }

    function getRegolaGlobale($idRegola) {
        $sql = "SELECT *" .
                "FROM regole r " .
                "WHERE r.ID_REGOLA=$idRegola ";
        $o = select_single($sql);

        return $this->_completaRegola($o);
    }

    function _completaRegola(&$regola) {
        $sql = "SELECT * FROM regole_options " .
            "WHERE ID_REGOLA=$regola[ID_REGOLA] " .
            "ORDER BY ORD_PRESENTAZIONE";
        $regola["OPTIONS"] = select_list($sql);

        $sql = "SELECT rs.*, s.TITOLO FROM regole_sottoschemi rs " .
            "JOIN schemi_codifica s ON s.ID_SCHEMA=rs.ID_SOTTO_SCHEMA " .
            "WHERE rs.ID_REGOLA=$regola[ID_REGOLA] " .
            "ORDER BY rs.ORDINE";
        $regola["SOTTOSCHEMI"] = select_list($sql);

        return $regola;
    }

    function crea($json_data) {
        global $con; 
        $con->begin_transaction();
        try {
            if($con->escape_string($json_data->ID_REGOLA)<0){
                $sql = insert("regole", ["NOM_VARIABILE" => $con->escape_string($json_data->NOM_VARIABILE),
                                    "GLOBAL" => $con->escape_string($json_data->GLOBAL),
                                    "ETICHETTA" => $con->escape_string($json_data->ETICHETTA),
                                    "HINT" => $con->escape_string($json_data->HINT),
                                    "REQUIRED" => $con->escape_string($json_data->REQUIRED),
                                    "TIPO" => $con->escape_string($json_data->TIPO),
                                    "MAXLENGTH" => $con->escape_string($json_data->MAXLENGTH),
                                    "PATTERN_REGEXP" => $con->escape_string($json_data->PATTERN_REGEXP),
                                    "NUM_DECIMALI" => $con->escape_string($json_data->NUM_DECIMALI),
                                    "MIN" => $con->escape_string($json_data->MIN),
                                    "MAX" => $con->escape_string($json_data->MAX)
                                    ]);
                execute_update($sql);
                $idRegola = $con->insert_id;
            }
            else $idRegola = $con->escape_string($json_data->ID_REGOLA);
            if(property_exists($json_data, 'ID_SCHEMA') && $con->escape_string($json_data->ID_SCHEMA)!= null){
                $sql = insert("schemi_regole", ["ID_SCHEMA" => $con->escape_string($json_data->ID_SCHEMA),
                    "NOM_VARIABILE" => $con->escape_string($json_data->NOM_VARIABILE),
                    "ORD_PRESENTAZIONE" => $con->escape_string($json_data->ORD_PRESENTAZIONE),
                    "ID_REGOLA" => $idRegola
                    ]);
                execute_update($sql);
            }

            $con->commit();
        } catch (mysqli_sql_exception $exception) {
            $con->rollback();

            throw $exception;
        }
        return property_exists($json_data, 'ID_SCHEMA' && $con->escape_string($json_data->ID_SCHEMA)!= null)
            ?$this->getById($json_data->ID_SCHEMA, $json_data->NOM_VARIABILE)
            :$this->getRegolaGlobale($idRegola);
    }
    
    function aggiorna($json_data) {     
        global $con;
        $con->begin_transaction();
        try {
            // sulla tabella schemi_regole posso aggiornare solamente l'ordinamento
            if(property_exists($json_data, 'ID_SCHEMA')){
                $sql = update("schemi_regole", ["ORD_PRESENTAZIONE" => $con->escape_string($json_data->ORD_PRESENTAZIONE)], 
                                    ["ID_SCHEMA" => $con->escape_string($json_data->ID_SCHEMA),
                                    "NOM_VARIABILE" => $con->escape_string($json_data->NOM_VARIABILE)]);
                execute_update($sql);
            }

            // sulla tabella regole *non * posso aggiornare GLOBAL, n?? NOM_VARIABILE
            $sql = update("regole", ["ETICHETTA" => $con->escape_string($json_data->ETICHETTA),
                                    "HINT" => $con->escape_string($json_data->HINT),
                                    "REQUIRED" => $con->escape_string($json_data->REQUIRED),
                                    "TIPO" => $con->escape_string($json_data->TIPO),
                                    "MAXLENGTH" => $con->escape_string($json_data->MAXLENGTH),
                                    "PATTERN_REGEXP" => $con->escape_string($json_data->PATTERN_REGEXP),
                                    "NUM_DECIMALI" => $con->escape_string($json_data->NUM_DECIMALI),
                                    "MIN" => $con->escape_string($json_data->MIN),
                                    "MAX" => $con->escape_string($json_data->MAX)], 
                                ["ID_REGOLA" => $con->escape_string($json_data->ID_REGOLA)]);
            execute_update($sql);

            $sql = "DELETE FROM regole_options WHERE ID_REGOLA = $json_data->ID_REGOLA ";
            execute_update($sql);

            if (isset($json_data->OPTIONS)) {
                foreach ($json_data->OPTIONS as $o) {
                    $sql = insert("regole_options", ["ID_REGOLA" => $con->escape_string($o->ID_REGOLA),
                        "VALUE_OPTION" => $con->escape_string($o->VALUE_OPTION),
                        "ETICHETTA" => $con->escape_string($o->ETICHETTA),
                        "ORD_PRESENTAZIONE" => $con->escape_string($o->ORD_PRESENTAZIONE)
                        ]);
                    execute_update($sql);
                }
            }

            $sql = "DELETE FROM regole_sottoschemi WHERE ID_REGOLA = $json_data->ID_REGOLA ";
            execute_update($sql);

            $giaInseriti = [];  // evito di inserire duplicati
            if (isset($json_data->SOTTOSCHEMI)) {
                foreach ($json_data->SOTTOSCHEMI as $o) {
                    if (!in_array($o->ID_SOTTO_SCHEMA, $giaInseriti)) {
                        $sql = insert("regole_sottoschemi", ["ID_REGOLA" => $con->escape_string($o->ID_REGOLA),
                            "ID_SOTTO_SCHEMA" => $con->escape_string($o->ID_SOTTO_SCHEMA),
                            "ORDINE" => $con->escape_string($o->ORDINE)
                            ]);
                        execute_update($sql);
                        $giaInseriti[] = $o->ID_SOTTO_SCHEMA;
                    }
                }
            }

            $con->commit();
        } catch (mysqli_sql_exception $exception) {
            $con->rollback();

            throw $exception;
        }
    }

    function elimina($idSchema, $nomVariabile) {
        // Elimino anche dalla tabella regole, ma solo se non ?? globale
        $sql = "SELECT r.ID_REGOLA FROM schemi_regole s JOIN regole r ON s.ID_REGOLA=r.ID_REGOLA " .
                "WHERE s.ID_SCHEMA=$idSchema AND s.NOM_VARIABILE='$nomVariabile' AND GLOBAL='N' ";
        $idRegola = select_single_value($sql);

        $sql = "DELETE FROM schemi_regole WHERE ID_SCHEMA = $idSchema AND NOM_VARIABILE='$nomVariabile' ";
        execute_update($sql);

        if ($idRegola) {
            $sql = "DELETE FROM regole_options WHERE ID_REGOLA=$idRegola";
            execute_update($sql);
            $sql = "DELETE FROM regole_sottoschemi WHERE ID_REGOLA=$idRegola ";
            execute_update($sql);
            $sql = "DELETE FROM regole WHERE ID_REGOLA=$idRegola ";
            execute_update($sql);
        }
    }

    function eliminaGenerale($idRegola) {
        $sql = "DELETE FROM schemi_regole WHERE ID_REGOLA=$idRegola";
        execute_update($sql);
        $sql = "DELETE FROM regole_options WHERE ID_REGOLA=$idRegola";
        execute_update($sql);
        $sql = "DELETE FROM regole_sottoschemi WHERE ID_REGOLA=$idRegola";
        execute_update($sql);
        $sql = "DELETE FROM regole WHERE ID_REGOLA=$idRegola ";
        execute_update($sql);
    }
}
?>