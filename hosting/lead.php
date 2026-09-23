<?php
/* Приём заявок с falkov-marketing.ru: дублирует заявку письмом на почту владельца.
   В бота заявка уходит отдельно, прямо из формы, этот скрипт её не заменяет. */

$TO = 'korob338@mail.ru';
$FROM = 'zayavki@falkov-marketing.ru';
$ALLOWED = ['https://falkov-marketing.ru', 'https://www.falkov-marketing.ru'];

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: ' . (in_array($origin, $ALLOWED, true) ? $origin : $ALLOWED[0]));
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
if ($method === 'OPTIONS') { http_response_code(204); exit; }
if ($method === 'GET') { echo json_encode(['ok' => true, 'service' => 'falkov-leads']); exit; }
if ($method !== 'POST') { http_response_code(405); echo json_encode(['ok' => false, 'error' => 'method']); exit; }
if (!in_array($origin, $ALLOWED, true)) { http_response_code(403); echo json_encode(['ok' => false, 'error' => 'origin']); exit; }

$body = json_decode(file_get_contents('php://input'), true);
$text = trim((string) ($body['text'] ?? ''));
if ($text === '' || mb_strlen($text) > 3000) { http_response_code(400); echo json_encode(['ok' => false, 'error' => 'input']); exit; }

/* не больше 10 писем в час с одного адреса: защита от накрутки */
$ip = trim(explode(',', $_SERVER['HTTP_X_FORWARDED_FOR'] ?? $_SERVER['REMOTE_ADDR'] ?? '')[0]);
$dir = __DIR__ . '/.rate';
if (!is_dir($dir)) { @mkdir($dir, 0700); }
$file = $dir . '/' . md5($ip);
$hits = array_filter(explode("\n", (string) @file_get_contents($file)), fn($t) => (int) $t > time() - 3600);
if (count($hits) >= 10) { http_response_code(429); echo json_encode(['ok' => false, 'error' => 'rate']); exit; }
$hits[] = time();
@file_put_contents($file, implode("\n", $hits));

$subject = '=?UTF-8?B?' . base64_encode('Заявка с сайта falkov-marketing.ru') . '?=';
$headers = "From: Falkov <{$FROM}>\r\nMIME-Version: 1.0\r\nContent-Type: text/plain; charset=UTF-8\r\nContent-Transfer-Encoding: 8bit";
$message = $text . "\n\n---\nIP: {$ip}\nВремя: " . date('d.m.Y H:i') . "\n";
$ok = @mail($TO, $subject, $message, $headers, '-f' . $FROM);

/* Telegram с сервера: у части посетителей из России браузер до api.telegram.org не достаёт,
   поэтому отправка из формы может не сработать. Сервер отправляет всегда. */
$TG_TOKEN = '8656918564:AAHZQW_q74De5ax4Vwp1b3fN3Jhk4nMRLjI';
$TG_CHAT = '7315203539';
$tg = false;
$ch = curl_init("https://api.telegram.org/bot{$TG_TOKEN}/sendMessage");
curl_setopt_array($ch, [
	CURLOPT_RETURNTRANSFER => true,
	CURLOPT_TIMEOUT => 8,
	CURLOPT_CONNECTTIMEOUT => 5,
	CURLOPT_POST => true,
	CURLOPT_HTTPHEADER => ['Content-Type: application/json'],
	CURLOPT_POSTFIELDS => json_encode(['chat_id' => $TG_CHAT, 'text' => $text, 'disable_web_page_preview' => true], JSON_UNESCAPED_UNICODE)
]);
$res = curl_exec($ch);
$tg = curl_getinfo($ch, CURLINFO_HTTP_CODE) === 200;
curl_close($ch);

echo json_encode(['ok' => (bool) $ok || $tg, 'mail' => (bool) $ok, 'tg' => $tg]);
