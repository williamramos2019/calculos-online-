<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

function calculateINSSDeduction($salary) {
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
    
    return $totalContribution;
}

function calculateIRRF($salary, $dependents = 0) {
    // Cálculo INSS primeiro
    $inssDeduction = calculateINSSDeduction($salary);
    
    // Dedução por dependente (2025)
    $dependentsDeduction = $dependents * 189.59;
    
    // Base de cálculo do IRRF
    $taxableIncome = $salary - $inssDeduction - $dependentsDeduction;
    
    // Cálculo do IRRF com tabela progressiva 2025
    $irrf = 0;
    
    if ($taxableIncome <= 2112.00) {
        $irrf = 0;
    } elseif ($taxableIncome <= 2826.65) {
        $irrf = ($taxableIncome * 0.075) - 158.40;
    } elseif ($taxableIncome <= 3751.05) {
        $irrf = ($taxableIncome * 0.15) - 370.40;
    } elseif ($taxableIncome <= 4664.68) {
        $irrf = ($taxableIncome * 0.225) - 651.73;
    } else {
        $irrf = ($taxableIncome * 0.275) - 884.96;
    }
    
    $irrf = max(0, $irrf);
    $effectiveRate = $salary > 0 ? ($irrf / $salary) * 100 : 0;
    $netSalary = $salary - $inssDeduction - $irrf;
    
    return [
        'salary' => $salary,
        'inssDeduction' => round($inssDeduction, 2),
        'dependentsDeduction' => round($dependentsDeduction, 2),
        'taxableIncome' => round($taxableIncome, 2),
        'irrf' => round($irrf, 2),
        'effectiveRate' => round($effectiveRate, 2),
        'netSalary' => round($netSalary, 2)
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
    $dependents = isset($input['dependents']) ? intval($input['dependents']) : 0;
    
    if ($salary <= 0) {
        http_response_code(400);
        echo json_encode(['error' => 'Salário deve ser maior que zero']);
        exit;
    }
    
    $result = calculateIRRF($salary, $dependents);
    echo json_encode($result);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Erro interno do servidor']);
}
?>