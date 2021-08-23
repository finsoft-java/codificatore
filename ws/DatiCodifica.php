<?php

include("include/all.php");
$con = connect();

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    //do nothing, HTTP 200
    exit();
}

require_logged_user_JWT();

$idCodifica = isset($_GET['idCodifica']) ? $con->escape_string($_GET['idCodifica']) : null;

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (!$idCodifica) {
        print_error(400, 'Missing idCodifica');
    }
    [$list, $count] = $codificaManager->getDatiCodifica($idCodifica);
        
    header('Content-Type: application/json');
    echo json_encode(['data' => $list, 'count' => $count]);

} else {
    //==========================================================
    print_error(400, "Unsupported method in request: " . $_SERVER['REQUEST_METHOD']);
}


?>