import Typo from "typo-js"; 
import path from "path";

const dictionaryPath = path.resolve(__dirname, './../../assets');
const spellCheck = new Typo('en',null,null,{dictionaryPath})
export function checkWord(word:string):boolean{
    return spellCheck.check(word)
}

const prefixes = [
    "re",
    "in",
    "un",
    "de",
    "dis",
    "con",
    "pro"
];

const suffixes = [
    "ive",
    "ive",
    "ion",
    "ication",
    "en",
    "ions",
    "ications",
    "ens",
    "ieth",
    "th",
    "ly",
    "ing",
    "ings",
    "d",
    "ied",
    "ed",
    "st",
    "iest",
    "est",
    "r",
    "ier",
    "er",
    "rs",
    "iers",
    "ers",
    "ies",
    "s",
    "es",
    "iness",
    "ness",
    "able",
    "ment"
];

export function getSuffix(previous:string):string{
    const suffix = suffixes[Math.floor(Math.random()*suffixes.length-1)] 
    if (suffix === previous){
        return getSuffix(previous)
    }
    return suffix
}
