/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
/* eslint-disable import/prefer-default-export */
export {};

const mostUsedList = document.querySelector("#most-used") as HTMLSpanElement;
const leastUsedList = document.querySelector("#least-used") as HTMLSpanElement;
const statsList = document.querySelector("#stats") as HTMLSpanElement;

// @ts-ignore
const sortProps = (obj) => {
    const arr = Object.entries(obj);
    arr.sort((first, second) => {
        // @ts-ignore
        return second[1] - first[1];
    });
    return arr;
};

const getStopWords = () => {
    return [
        "a",
        "able",
        "about",
        "across",
        "after",
        "all",
        "almost",
        "also",
        "am",
        "among",
        "an",
        "and",
        "any",
        "are",
        "as",
        "at",
        "be",
        "because",
        "been",
        "but",
        "by",
        "can",
        "cannot",
        "could",
        "dear",
        "did",
        "do",
        "does",
        "either",
        "else",
        "ever",
        "every",
        "for",
        "from",
        "get",
        "got",
        "had",
        "has",
        "have",
        "he",
        "her",
        "hers",
        "him",
        "his",
        "how",
        "however",
        "i",
        "if",
        "in",
        "into",
        "is",
        "it",
        "its",
        "just",
        "least",
        "let",
        "like",
        "likely",
        "may",
        "me",
        "might",
        "most",
        "must",
        "my",
        "neither",
        "no",
        "nor",
        "not",
        "of",
        "off",
        "often",
        "on",
        "only",
        "or",
        "other",
        "our",
        "own",
        "rather",
        "said",
        "say",
        "says",
        "she",
        "should",
        "since",
        "so",
        "some",
        "than",
        "that",
        "the",
        "their",
        "them",
        "then",
        "there",
        "these",
        "they",
        "this",
        "tis",
        "to",
        "too",
        "twas",
        "us",
        "wants",
        "was",
        "we",
        "were",
        "what",
        "when",
        "where",
        "which",
        "while",
        "who",
        "whom",
        "why",
        "will",
        "with",
        "would",
        "yet",
        "you",
        "your",
        "ain't",
        "aren't",
        "can't",
        "could've",
        "couldn't",
        "didn't",
        "doesn't",
        "don't",
        "hasn't",
        "he'd",
        "he'll",
        "he's",
        "how'd",
        "how'll",
        "how's",
        "i'd",
        "i'll",
        "i'm",
        "i've",
        "isn't",
        "it's",
        "might've",
        "mightn't",
        "must've",
        "mustn't",
        "shan't",
        "she'd",
        "she'll",
        "she's",
        "should've",
        "shouldn't",
        "that'll",
        "that's",
        "there's",
        "they'd",
        "they'll",
        "they're",
        "they've",
        "wasn't",
        "we'd",
        "we'll",
        "we're",
        "weren't",
        "what'd",
        "what's",
        "when'd",
        "when'll",
        "when's",
        "where'd",
        "where'll",
        "where's",
        "who'd",
        "who'll",
        "who's",
        "why'd",
        "why'll",
        "why's",
        "won't",
        "would've",
        "wouldn't",
        "you'd",
        "you'll",
        "you're",
        "you've",
    ];
};

const filterStopWords = (wordArray: []) => {
    const commonWords = getStopWords();
    const commonObj = {};
    const uncommonArr = [];

    for (let i = 0; i < commonWords.length; i++) {
        // @ts-ignore
        commonObj[commonWords[i].trim()] = true;
    }

    for (let i = 0; i < wordArray.length; i++) {
        // @ts-ignore
        const word = wordArray[i].trim().toLowerCase();
        // @ts-ignore
        if (!commonObj[word]) {
            uncommonArr.push(word);
        }
    }

    return uncommonArr;
};

export const textStats = (content: string) => {
    const text = content.toLowerCase();
    const wordArr = text.match(/\b\S+\b/g);
    const spanWordCount = document.createElement("span");
    spanWordCount.innerText = `Word Count: ${String(wordArr?.length)}`;
    statsList.appendChild(spanWordCount);
    const spanCharCount = document.createElement("span");
    spanCharCount.innerText = `Word Count: ${content.length}`;
    statsList.appendChild(spanCharCount);

    let uncommonWords = [];

    // @ts-ignore
    uncommonWords = filterStopWords(wordArr);

    const wordDict = {};
    for (const word in uncommonWords) {
        const wordValue = uncommonWords[Number(word)];
        // @ts-ignore
        if (wordDict[wordValue] > 0) {
            // @ts-ignore
            wordDict[wordValue] += 1;
        } else {
            // @ts-ignore
            wordDict[wordValue] = 1;
        }
    }

    const wordList = sortProps(wordDict);
    const topFive = wordList.slice(0, 5);
    const bottomFive = wordList.slice(-5, wordList.length);

    topFive.forEach((word) => {
        const span = document.createElement("span");
        span.innerText = `${word[0]}: ${word[1]} ${word[1] === 1 ? "time" : "times"}`;
        mostUsedList.appendChild(span);
    });
    bottomFive.forEach((word) => {
        const span = document.createElement("span");
        span.innerText = `${word[0]}: ${word[1]} ${word[1] === 1 ? "time" : "times"}`;
        leastUsedList.appendChild(span);
    });
};
