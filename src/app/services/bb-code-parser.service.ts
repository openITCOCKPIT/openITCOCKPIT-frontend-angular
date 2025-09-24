import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class BbCodeParserService {

    constructor() {
    }

    public parse(bbCode: string): string {
        //ITC-732 This is not default bb code!
        bbCode = bbCode
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");

        var resString = bbCode;

        resString = resString.replace(/(?:\r\n|\r|\n)/g, '<br />');
        resString = resString.replace(/\[b\]/gi, '<strong>');
        resString = resString.replace(/\[\/b\]/gi, '</strong>');
        resString = resString.replace(/\[i\]/gi, '<i>');
        resString = resString.replace(/\[\/i\]/gi, '</i>');
        resString = resString.replace(/\[u\]/gi, '<u>');
        resString = resString.replace(/\[\/u\]/gi, '</u>');

        resString = resString.replace(/\[left\]/gi, '<div class="text-start">'); // text-left
        resString = resString.replace(/\[\/left\]/gi, '</div>');
        resString = resString.replace(/\[right\]/gi, '<div class="text-end">'); //text-right
        resString = resString.replace(/\[\/right\]/gi, '</div>');
        resString = resString.replace(/\[center\]/gi, '<div class="text-center">');
        resString = resString.replace(/\[\/center\]/gi, '</div>');
        resString = resString.replace(/\[justify\]/gi, '<div class="text-justify">');
        resString = resString.replace(/\[\/justify\]/gi, '</div>');

        resString = resString.replace(/\[color ?= ?'(#[\w]{6})' ?\]/gi, '<span style="color:$1;">');
        resString = resString.replace(/\[\/color\]/gi, '</span>');

        resString = resString.replace(/\[text ?= ?'([\w\-]+)' ?\]/gi, '<span style="font-size:$1;">');
        resString = resString.replace(/\[\/text\]/gi, '</span>');

        resString = resString.replace(/\[url ?= ?'([\w\-:\/\[\]\.\%\#\?\(&|&amp;)\=\!\+ ]+)' ?tab ?\]/gi, '<a href="$1" target="_blank">');
        resString = resString.replace(/\[url ?= ?'([\w\-:\/\[\]\.\%\#\?\(&|&amp;)\=\!\+ ]+)' ?\]/gi, '<a href="$1">');
        resString = resString.replace(/\[\/url\]/gi, '</a>');

        // replace javascript <script> tags
        //resString = resString.replace(/<script[^>]*>([\s\S]*?)<\/script([\s\S]*?)>/gi, '$1');

        return resString;
    }

}
