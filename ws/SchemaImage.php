<?php

include("include/all.php");
$con = connect();

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    //do nothing, HTTP 200
    exit();
}

require_logged_user_JWT();

$idSchema = isset($_GET['idSchema']) ? $con->escape_string($_GET['idSchema']) : null;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    //==========================================================
    
    
    /*$postdata = file_get_contents("php://input");
    $json_data = json_decode($postdata);
    if (!$json_data) {
        print_error(400, "Missing JSON data");
    }
    $object = $schemiManager->crea($json_data);
    
    header('Content-Type: application/json');
    echo json_encode(['value' => $object]);*/
    
} elseif ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    //==========================================================
    if (!$idSchema) {
        print_error(400, 'Missing idSchema');
    }
    $object = $schemiManager->getById($idSchema);
    if (!$object) {
        print_error(404, 'Not found');
    }
    
    $schemiManager->eliminaImmagine($idSchema);
    
} else {
    //==========================================================
    print_error(400, "Unsupported method in request: " . $_SERVER['REQUEST_METHOD']);
}


?>