<?php

// 1. convert po files into json: https://www.bjoern.ws/po-to-laravel/
// 2. use this script to replace {0} with {{0}} in the jsn values
//    this script will also save unencoded multi-byte characters in the json file

$filename = $_SERVER['argv'][1];

if (!file_exists($filename)) {
    die('File not found: ' . $filename . "\n");
}

$input = json_decode(file_get_contents($filename), true);

$output = [];
foreach ($input as $k => $v) {
    $output[$k] = str_replace(['{0}', '{1}', '{2}', '{3}', '{4}', '{5}'], ['{{0}}', '{{1}}', '{{2}}', '{{3}}', '{{4}}', '{{5}}'], $v);
}


$f = fopen($filename, 'w+');
fwrite($f, json_encode($output, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
fclose($f);

