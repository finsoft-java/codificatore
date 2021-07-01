<?php

include("include/all.php");
$con = connect();

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    //do nothing, HTTP 200
    exit();
}

require_logged_user_JWT();

$idCodifica = isset($_GET['idCodifica']) ? $con->escape_string($_GET['idCodifica']) : null;
$top = isset($_GET['top']) ? $con->escape_string($_GET['top']) : null;
$skip = isset($_GET['skip']) ? $con->escape_string($_GET['skip']) : null;

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    
    if ($idCodifica) {
        $object = $codificaManager->getById($idCodifica);
        header('Content-Type: application/json');
        echo json_encode(['value' => $object]);
    
    } else {
        [$list, $count] = $codificaManager->getAll($top, $skip);
          
        header('Content-Type: application/json');
        echo json_encode(['data' => $list, 'count' => $count]);
    }
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    //==========================================================
    $postdata = file_get_contents("php://input");
    $json_data = json_decode($postdata);
    if (!$json_data) {
        print_error(400, "Missing JSON data");
    }
    $object = $codificaManager->crea($json_data);
    
    header('Content-Type: application/json');
    echo json_encode(['value' => $object]);
    
} elseif ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    //==========================================================
    if (!$idCodifica) {
        print_error(400, 'Missing idCodifica');
    }
    $object = $codificaManager->getById($idCodifica);
    if (!$object) {
        print_error(404, 'Not found');
    }
    
    $codificaManager->elimina($idCodifica);
    
} else {
    //==========================================================
    print_error(400, "Unsupported method in request: " . $_SERVER['REQUEST_METHOD']);
}


?>