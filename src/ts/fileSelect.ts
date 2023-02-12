export {};

const fileSelect = document.querySelector("#choose-file") as HTMLInputElement;
const fileSelectText = document.querySelector(".file-select-wrapper span") as HTMLSpanElement;

const selectFile = () => {
    if (fileSelect.value) {
        fileSelectText.innerText = fileSelect.value.slice(fileSelect.value.lastIndexOf("\\") + 1);
    } else fileSelectText.innerText = "No File Selected";
};

fileSelect.addEventListener("change", selectFile);
