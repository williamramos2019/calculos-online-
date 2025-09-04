<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

function calculateFGTS($salary) {
    // FGTS é sempre 8% do salário bruto
    $monthlyDeposit = $salary * 0.08;
    $yearlyDeposit = $monthlyDeposit * 12;
    
    return [
        'salary' => $salary,
        'monthlyDeposit' => round($monthlyDeposit, 2),
        'yearlyDeposit' => round($yearlyDeposit, 2)
    ];
}

try {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($input['salary']) || !is_numeric($input['salary'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Salário inválido']);
        exit;
    }
    
    $salary = floatval($input['salary']);
    
    if ($salary <= 0) {
        http_response_code(400);
        echo json_encode(['error' => 'Salário deve ser maior que zero']);
        exit;
    }
    
    $result = calculateFGTS($salary);
    echo json_encode($result);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Erro interno do servidor']);
}
?>