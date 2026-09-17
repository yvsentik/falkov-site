<?php
/* Временный тест: открывается ли api.telegram.org с этого хостинга.
   Открыть в браузере, посмотреть результат, потом файл удалить. */
header('Content-Type: text/plain; charset=utf-8');

$ch = curl_init('https://api.telegram.org/');
curl_setopt_array($ch, [
	CURLOPT_RETURNTRANSFER => true,
	CURLOPT_TIMEOUT => 8,
	CURLOPT_CONNECTTIMEOUT => 5
]);
$body = curl_exec($ch);
$code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$err = curl_error($ch);
curl_close($ch);

echo "PHP: " . PHP_VERSION . "\n";
echo "curl: " . (function_exists('curl_init') ? 'есть' : 'НЕТ') . "\n";
echo "HTTP-код от api.telegram.org: " . $code . "\n";
echo "Ошибка curl: " . ($err ?: 'нет') . "\n";
echo "Ответ: " . substr((string) $body, 0, 200) . "\n";
echo "\nЕсли код 200 и ошибки нет – Telegram с хостинга доступен.\n";
