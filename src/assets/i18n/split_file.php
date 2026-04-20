<?php

// splits a large JSON file into smaller chunks of 100 items each.
// The result will be written to the "chunks" directory, with filenames chunk_1.json, chunk_2.json, etc.
// Make sure the directory "chunks" is empty.
// Usage: php split_file.php input.json

$filename = $_SERVER['argv'][1];

if (!file_exists($filename)) {
    die('File not found: ' . $filename . "\n");
}

$input = json_decode(file_get_contents($filename), true);

if(!is_dir('chunks')){
    mkdir('chunks');
}

$chunks = array_chunk($input, 100, true);

foreach ($chunks as $i => $chunk) {
    $chunkFilename = 'chunks/chunk_' . ($i + 1) . '.json';
    $f = fopen($chunkFilename, 'w+');
    fwrite($f, json_encode($chunk, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
    fclose($f);
}