<?php

$opzioniManager = new OpzioniManager();

class OpzioniManager {
      
    function getById($id_schema) {
        $sql = "SELECT * FROM schemi_options x WHERE x.id_schema=$id_schema ";
        return select_list($sql);
    }
}
?>