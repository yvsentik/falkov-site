<?php
/* Приём заявок с falkov-marketing.ru.
   1) проверяет токен Yandex SmartCaptcha серверным ключом;
   2) отправляет заявку в Telegram. Токен бота живёт только здесь, на хостинге. */

$cfg = require __DIR__ . '/config.php';

$allowed = ['https://falkov-marketing.ru', 'https://www.falkov-marketing.ru'];
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: ' . (in_array($origin, $allowed, true) ? $origin : $allowed[0]));
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
if ($method === 'OPTIONS') {
	http_response_code(204);
	exit;
}
if ($method !== 'POST') {
	http_response_code(405);
	echo json_encode(['ok' => false, 'error' => 'method']);
	exit;
}
if (!in_array($origin, $allowed, true)) {
	http_response_code(403);
	echo json_encode(['ok' => false, 'error' => 'origin']);
	exit;
}

$body = json_decode(file_get_contents('php://input'), true);
$token = $body['token'] ?? '';
$text = trim((string) ($body['text'] ?? ''));
if ($token === '' || $text === '' || mb_strlen($text) > 3000) {
	http_response_code(400);
	echo json_encode(['ok' => false, 'error' => 'input']);
	exit;
}

/** Простой POST через curl. */
function post($url, $fields, $json = false) {
	$ch = curl_init($url);
	curl_setopt_array($ch, [
		CURLOPT_RETURNTRANSFER => true,
		CURLOPT_TIMEOUT => 8,
		CURLOPT_CONNECTTIMEOUT => 5,
		CURLOPT_POST => true,
		CURLOPT_POSTFIELDS => $json ? json_encode($fields, JSON_UNESCAPED_UNICODE) : http_build_query($fields),
		CURLOPT_HTTPHEADER => $json ? ['Content-Type: application/json'] : []
	]);
	$res = curl_exec($ch);
	$code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
	curl_close($ch);
	return [$code, $res];
}

// проверка капчи
$ip = $_SERVER['HTTP_X_FORWARDED_FOR'] ?? $_SERVER['REMOTE_ADDR'] ?? '';
$ip = trim(explode(',', $ip)[0]);
[$code, $res] = post('https://smartcaptcha.yandexcloud.net/validate', [
	'secret' => $cfg['captcha_secret'],
	'token' => $token,
	'ip' => $ip
]);
$check = json_decode((string) $res, true);
if (($check['status'] ?? '') !== 'ok') {
	http_response_code(403);
	echo json_encode(['ok' => false, 'error' => 'captcha']);
	exit;
}

// отправка в Telegram
[$code, $res] = post(
	'https://api.telegram.org/bot' . $cfg['tg_token'] . '/sendMessage',
	['chat_id' => $cfg['tg_chat'], 'text' => $text, 'disable_web_page_preview' => true],
	true
);
if ($code !== 200) {
	http_response_code(502);
	echo json_encode(['ok' => false, 'error' => 'telegram']);
	exit;
}
echo json_encode(['ok' => true]);
