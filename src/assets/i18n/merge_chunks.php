<?php

if(!is_dir('chunks')){
    die('Directory "chunks" not found. Please run split_file.php first to create the chunks.' . "\n");
}


$files = glob('chunks/chunk_*.json');
// sort files by number
natsort($files);

// the input files are already JSON encoded. In the repository we use two spaces for indentation, but json_encode() of PHP can't do that.
// so we do a little hack and, use the JSON data as string, remove leading spaces

// start json
$output = "{\n";

foreach ($files as $file) {
    $lines = file($file);
    foreach($lines as $line){
        $line = trim($line);
        if($line === "{" || $line === "}"){
            continue;
        }


        if(substr($line, -1) !== ','){
            $line .= ',';
        }

        $output .= '  '.$line."\n";
    }
}

$output .= "}\n";


$f = fopen('output.json', 'w+');
fwrite($f, $output);
fclose($f);
