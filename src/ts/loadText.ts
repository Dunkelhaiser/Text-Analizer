import { textStats } from "./analizer";

/* eslint-disable @typescript-eslint/no-non-null-assertion */
export {};

let fileSelect = document.querySelector("#choose-file") as HTMLInputElement;
const mainContainer = document.querySelector("#main-container") as HTMLDivElement;
let textsList = document.querySelector(".file-links") as HTMLUListElement;
const mostUsedList = document.querySelector("#most-used") as HTMLSpanElement;
const leastUsedList = document.querySelector("#least-used") as HTMLSpanElement;
const statsList = document.querySelector("#stats") as HTMLSpanElement;

type Text = {
    title: string;
    text: string;
};

const textsArr: Text[] = JSON.parse(localStorage.getItem("texts")!) || [];

const paragraphize = (text: string) => {
    return text
        .split(/(?:\r?\n)+/)
        .map((paragraph: string) => `<p>${paragraph}</p>`)
        .join("");
};

const clearStats = () => {
    while (mostUsedList.firstChild) {
        mostUsedList.removeChild(mostUsedList.lastChild!);
    }
    const h1M = document.createElement("h1");
    h1M.innerText = `Most Used Words`;
    mostUsedList.appendChild(h1M);
    while (leastUsedList.firstChild) {
        leastUsedList.removeChild(leastUsedList.lastChild!);
    }
    const h1L = document.createElement("h1");
    h1L.innerText = `Least Used Words`;
    leastUsedList.appendChild(h1L);
    while (statsList.firstChild) {
        statsList.removeChild(statsList.lastChild!);
    }
    const h1S = document.createElement("h1");
    h1S.innerText = `Stats`;
    statsList.appendChild(h1S);
};

const readText = (title: string, text: string) => {
    const refresh = `${window.location.protocol}//${window.location.host}${window.location.pathname}?title=${title}`;
    window.history.pushState({ path: refresh }, "", refresh);

    mainContainer.classList.remove("center");
    const paragraphs = paragraphize(text);
    mainContainer.innerHTML = `
                <h1>${title}</h1>
                <div class="scroll">
                    ${paragraphs}
                </div>
                <button id="return">Return</button>
        `;
    const returnBtn = document.querySelector("#return") as HTMLButtonElement;
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    returnBtn.addEventListener("click", returnToMain);
    clearStats();
    textStats(text);
};

const fetchTexts = () => {
    textsArr.forEach((text) => {
        const li = document.createElement("li");
        li.innerText = text.title;
        li.addEventListener("click", () => readText(text.title, text.text));
        textsList.appendChild(li);
    });
};

const loadText = () => {
    const reader = new FileReader();
    reader.readAsText(fileSelect.files![0]);
    reader.onload = () => {
        const paragraphs = paragraphize(<string>reader.result);
        mainContainer.classList.remove("center");
        mainContainer.innerHTML = `
                    <input type="text" placeholder="Enter Title" class="input-title" aria-label="Enter Title"/>
                        <div class="scroll">
                            ${paragraphs}
                        </div>
                    <button id="save-btn">Save</button>
        `;
        const inputTitle = document.querySelector(".input-title") as HTMLInputElement;
        const saveBtn = document.querySelector("#save-btn") as HTMLButtonElement;

        const saveText = () => {
            if (inputTitle.value.trim() === "") {
                inputTitle.classList.add("error");
                inputTitle.parentNode?.querySelector(".error-msg")?.classList.remove("hidden");
                return;
            }
            inputTitle.classList.remove("error");
            inputTitle.parentNode?.querySelector(".error-msg")?.classList.add("hidden");
            const textObj = {
                title: inputTitle.value,
                text: reader.result as string,
            };
            textsArr.push(textObj);
            localStorage.setItem("texts", JSON.stringify(textsArr));
            // eslint-disable-next-line @typescript-eslint/no-use-before-define
            returnToMain();
        };

        saveBtn.addEventListener("click", saveText);
    };
    reader.onerror = () => {
        console.log("ERROR");
        mainContainer.innerHTML = "Error Reading File";
    };
};

const returnToMain = () => {
    const refresh = `${window.location.protocol}//${window.location.host}${window.location.pathname}`;
    window.history.pushState({ path: refresh }, "", refresh);
    mainContainer.classList.add("center");
    mainContainer.innerHTML = `
            <h1>Select File To Read</h1>
            <div class="file-select-wrapper">
                <input type="file" accept=".txt" id="choose-file" />
                <label for="choose-file" class="file-select">Select File</label>
                <span>No File Selected</span>
            </div>
            <h2>Or Select Existing</h2>
            <ul class="file-links"></ul>
        `;
    fileSelect = document.querySelector("#choose-file") as HTMLInputElement;
    textsList = document.querySelector(".file-links") as HTMLUListElement;
    fileSelect.addEventListener("change", loadText);
    clearStats();
    fetchTexts();
};

fileSelect.addEventListener("change", loadText);

fetchTexts();

const readOnLoad = () => {
    if (window.location.href.slice(window.location.href.indexOf("?") + 1).includes("title=")) {
        try {
            const urlParams = new URLSearchParams(window.location.search);
            const title = urlParams.get("title");
            const text = textsArr.find((txt) => txt.title === title)?.text;
            readText(<string>title, <string>text);
        } catch {
            returnToMain();
        }
    }
};

readOnLoad();

window.addEventListener("popstate", () => {
    returnToMain();
});
