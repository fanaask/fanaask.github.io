const msg: string = "Hello!";
alert(msg);

const style: Record<string, string> = {
    "Styl 1": "/style-1.css",
    "Styl 2": "/style-2.css",
    "Styl 3": "/style-3.css",
};

let curS = "Styl 1";

function changeS(styleName: string): void {

    const pop = document.getElementById("dynamic-style");

    if (pop) {
        pop.remove();
    }

    const link = document.createElement("link");

    link.id = "dynamic-style";
    link.rel = "stylesheet";
    link.href = style[styleName];

    document.head.appendChild(link);

    curS = styleName;
}

function generateButtons(): void {

    const container = document.getElementById("style-buttons");

    if (!container) return;

    Object.keys(style).forEach((styleName) => {

        const button = document.createElement("button");

        button.textContent = styleName;
        
        button.addEventListener("click", () => {
            changeS(styleName);
        });

        container.appendChild(button);
    });
}

generateButtons();

changeS(curS);