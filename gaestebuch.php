<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: Content-Type');

$dataFile = 'gaestebuch.json';

// Funktion zum Lesen der Einträge
function getEintraege() {
    global $dataFile;
    if (file_exists($dataFile)) {
        return json_decode(file_get_contents($dataFile), true) ?? [];
    }
    return [];
}

// Funktion zum Speichern der Einträge
function saveEintraege($eintraege) {
    global $dataFile;
    file_put_contents($dataFile, json_encode($eintraege, JSON_PRETTY_PRINT));
}

// GET-Anfrage: Alle Einträge zurückgeben
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    echo json_encode(getEintraege());
    exit;
}

// POST-Anfrage: Neuen Eintrag speichern
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    if ($data) {
        $eintraege = getEintraege();
        array_unshift($eintraege, $data); // Neuen Eintrag am Anfang hinzufügen
        saveEintraege($eintraege);
        echo json_encode(['success' => true, 'eintrag' => $data]);
    } else {
        http_response_code(400);
        echo json_encode(['error' => 'Ungültige Daten']);
    }
    exit;
}
?> 