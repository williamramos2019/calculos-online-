<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

function calculateINSS($salary) {
    // Tabela INSS 2025
    $brackets = [
        ['min' => 0, 'max' => 1412.00, 'rate' => 0.075],
        ['min' => 1412.01, 'max' => 2666.68, 'rate' => 0.09],
        ['min' => 2666.69, 'max' => 4000.03, 'rate' => 0.12],
        ['min' => 4000.04, 'max' => 7786.02, 'rate' => 0.14]
    ];
    
    $totalContribution = 0;
    
    foreach ($brackets as $bracket) {
        if ($salary > $bracket['min']) {
            $taxableAmount = min($salary, $bracket['max']) - $bracket['min'] + ($bracket['min'] == 0 ? 0 : 0.01);
            $totalContribution += $taxableAmount * $bracket['rate'];
        }
    }
    
    $effectiveRate = $salary > 0 ? ($totalContribution / $salary) * 100 : 0;
    
    return [
        'salary' => $salary,
        'contribution' => round($totalContribution, 2),
        'percentage' => round($effectiveRate, 2),
        'netSalary' => round($salary - $totalContribution, 2)
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
    
    $result = calculateINSS($salary);
    echo json_encode($result);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Erro interno do servidor']);
}
?>