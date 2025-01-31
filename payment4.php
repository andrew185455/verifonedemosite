<?php

function generateUUIDv4() {
    // Generate 16 random bytes
    $data = random_bytes(16);
    
    // Set the version to 4 (random)
    $data[6] = chr(ord($data[6]) & 0x0f | 0x40); // Version 4
    $data[8] = chr(ord($data[8]) & 0x3f | 0x80); // Variant 1

    // Convert bytes to UUID format
    return sprintf('%s-%s-%s-%s-%s',
        bin2hex(substr($data, 0, 4)),
        bin2hex(substr($data, 4, 2)),
        bin2hex(substr($data, 6, 2)),
        bin2hex(substr($data, 8, 2)),
        bin2hex(substr($data, 10, 6))
    );
}

// Load the configuration from the JSON file
$configFile = 'paymentConfig4.json';
$config = json_decode(file_get_contents($configFile), true);

// Check if the configuration was loaded successfully
if ($config === null) {
    die('Failed to load configuration file.');
}

// Credentials from the config
$userID = $config['userID'];
$apiKey = $config['apiKey'];
$keyAlias = $config['keyAlias'];
$currency_code = $config['currency_code'];
$payment_provider_contract = $config['payment_provider_contract'];
$base_url = $config['base_url'];

// Get the payload from the POST request
$json = file_get_contents('php://input');
$payload = json_decode($json, true);

// Extract necessary fields from the payload
$encryptedCard = $payload['cardObject']['encryptedCard'];
$amount = $payload['amount'];


// Setup the API request fields
$bodyPayload = [
    "encrypted_card" => $encryptedCard,
    "public_key_alias" => $keyAlias,
    "currency_code" => $currency_code,
    "merchant_reference" => generateUUIDv4(),
    "payment_provider_contract" => $payment_provider_contract,
    "amount" => $amount
];

$host = "{$base_url}/oidc/api/v2/transactions/card";

$ch = curl_init($host);
curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json'));
//curl_setopt($ch, CURLOPT_HEADER, 1);
curl_setopt($ch, CURLOPT_USERPWD, $userID . ":" . $apiKey);
curl_setopt($ch, CURLOPT_TIMEOUT, 30);
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($bodyPayload));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
$return = curl_exec($ch);
curl_close($ch);

//$decoded_content = json_decode($return, true);

header('Content-Type: application/json; charset=utf-8');

echo $return;



