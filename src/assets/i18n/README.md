This directory contains the translation file for the openITCOCKPIT frontend.

Please see the main README.md for instructions on how to update or add new translations.
This README file will describe how to use the helper scripts.

# Update translations using AI

At the moment, we can send an unlimited about of AI requests to GitHub Copilot.
We can use this, to update existing translation files. How ever each file has more than 6k
entries, which is too mutch for one request.

First, use the `split_file.php` script, to split a large JSON file into smaller chunks of 100 items each.
The order of the JSON will be preserved.

```
php split_file.php ES_ES.json
```

All chunks will be written to the `chunks` directory, with filenames `chunk_1.json`, `chunk_2.json`, etc.
**Before running the script, make sure the directory "chunks" is empty.**

Now open the first chunk file with an IDE like Visual Studio Code.
Add the file as attachment to the GitHub Copilot Chat and ask AI to translate the content of the file.

Prompt:
```
I have open a language file in JSON format. The key are the english source. Do NEVER change the key. The value is the target language. I want to translate all values from english to spanish. Make sure to only change the values of the JSON. In the values are placeholders like `{0}` or `{1}`, which need to have two curly brackets like so `{{0}}` or `{{1}}`.
The context is a IT monitoring system. A "Host" is a device that gets monitored and "Services" are services running on the host.
```

Make sure to use the same promt for each chunk to speed up the process. Replace `spanish` in the promt with the target language you want to translate to.

Repeat this for each chunk file.
We have to go with the manual process, because GitHub Copilot does not have an API, we can use to automate the process.

After all chunks are translated, we can merge them back together into one JSON file.
The `merge_chunks.php` script will do this for use. It will read all chunk files and merge them back into a `output.json` file.
To keep the diff as short as possible, we use an indentation of 2 spaces as transloco does.
PHP can not handle custom indentation, so the script is a bit hacky.

You can run the script as often as you want, as it will always overwrite the `output.json` file.

Open the `output.json` and remove the last `,` of the last entry in the file, to get a valid JSON.

Now use a tool like WinMerge to compare the original file with the new `output.json` and check
if the translations are looging correct.
If yes, move the `output.json` to the original file and commit the changes.

usage
```
php merge_chunks.php
```


---

The `fix_json.php` script is from a time as we moved the translation files from the
backend to the frontend. It does not have mutch use anymore, but who knows if we need it in the future for some reason.