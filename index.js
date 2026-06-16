const inputbtn = document.querySelector(".input__button");
const fileInput = document.querySelector(".input__file");
const resultLoading = document.querySelector(".loading-indicator");
const resultContainer = document.querySelector(".item__textbox");
const resultScheme = document.querySelector(".grid__second-item");
const radioBtnLine = document.querySelector(".radioBtn-line");
const radioBtnLineHorizontal = document.querySelector(
  ".radioBtn-line-horizontal",
);
const radioBtnFallingDown = document.querySelector(".radioBtn-falling-down");
const radioBtnInLine = document.querySelector(".radioBtn-inline");
const radioBtnCircle = document.querySelector(".radioBtn-circle");
const radioButtons = document.querySelectorAll(`[name = "radio__switch"]`);

radioBtnInLine.checked = true;

const count = new Map();

// Listen for when a user selects a files
fileInput.addEventListener("change", function (event) {
  const files = [...event.target.files];
  inputbtn.disabled = true;

  count.clear();
  resultContainer.innerHTML = `<p>Here will be your results!</p>`;

  const n = {
    count: 1,
    countUp() {
      this.count++;
    },
  };

  // Safety check: Ensure a files was actually selected
  if (!files) return;

  // Initialize the FileReader API
  files.forEach((file) => {
    const reader = new FileReader();

    // Define what happens when the files is successfully read
    reader.onload = function (e) {
      try {
        if (file.type === "text/html") {
          const parser = new DOMParser();
          const doc = parser.parseFromString(e.target.result, "text/html");

          const imgs = doc.querySelectorAll("img");

          imgs.forEach((img) => {
            const src = img.getAttribute("src") || "";
            const lowerSrc = src.toLowerCase();
            if (lowerSrc.endsWith(".jpg") || lowerSrc.endsWith(".webp")) {
              img.remove();
            }
          });

          const sanitizedHTML = doc.documentElement.outerHTML;


          resultContainer.innerHTML += sanitizedHTML;
        } else if (file.type === "application/json") {
        } else {
          throw new Error("Please upload valid files types");
        }

        interactWithData(n);
        if (n.count - 1 === files.length) {
          resultLoading.innerHTML = `downloaded all the files, ready!`;
          inputbtn.disabled = false;
        }
        resultContainer.querySelector("p").classList.add("hidden");
      } catch (error) {
        resultContainer.innerHTML = `<span style="color:red;">${error}</span>`;
        console.error(error);
      }
    };
    reader.readAsText(file);
  });
});

function interactWithData(n) {
  if (n.count === 1) {
    resultLoading.innerHTML = `downloaded ${n.count} file`;
  } else {
    resultLoading.innerHTML = `downloaded ${n.count} files`;
  }
  n.countUp();
}

const storedDisplayWordMap = function displayWordMap() {
  resultScheme.innerHTML = "";
  const firstFiftyEntries = Array.from(sortedList.entries()).slice(1, 51);
  let lineHeight = {
    number: 1,
    countUp() {
      this.number++;
    },
  };
  firstFiftyEntries.forEach((value, index, array) => {
    let para = document.createElement("p");
    para.classList.add("second-item__text second-item__text--scaleDown");
    para.innerText = firstFiftyEntries[index][1][0];
    para.style.fontSize = `${firstFiftyEntries[index][1][1]}px`;
    para.style.lineHeight = `${Math.floor(lineHeight.number / 10)}`;
    lineHeight.countUp();
    if (radioBtnInLine.checked) {
      para.style.lineHeight = `10vh`;
      para.style.fontSize = `${(firstFiftyEntries[index][1][1] + 20) / 2}px`;
      resultScheme.style.textAlign = "";
      resultScheme.style.display = "flex";
    }
    if (radioBtnCircle.checked) {
      para.style.lineHeight = `${10 / Math.floor(lineHeight.number + 100)}`;
      para.style.rotate = `${Math.floor(Math.random() * 360)}deg`;
      resultScheme.style.textAlign = "";
      resultScheme.style.display = "block";
    }
    if (radioBtnLine.checked) {
      para.style.lineHeight = `${10 / Math.floor(lineHeight.number + 30)}`;
      para.style.rotate = `${Math.floor(Math.random() * 360)}deg`;
      resultScheme.style.textAlign = "center";
      resultScheme.style.display = "block";
    }
    if (radioBtnLineHorizontal.checked) {
      para.style.lineHeight = `${10 / Math.floor(lineHeight.number + 30)}`;
      para.style.rotate = `${Math.floor(Math.random() * 360)}deg`;
      resultScheme.style.textAlign = "";
      resultScheme.style.display = "flex";
    }
    if (radioBtnFallingDown.checked) {
      para.style.rotate = `${Math.floor(Math.random() * 360)}deg`;

      resultScheme.style.textAlign = "";
      resultScheme.style.display = "block";
    }
    resultScheme.appendChild(para);
  });
};
inputbtn.addEventListener("click", () => {
  const divTextArray = Array.from(document.querySelectorAll(".text"));
  const splitAndTrimDivArray = divTextArray.flatMap((item) =>
    item.innerText.trim().split(/[,;: *\-?!'"_]/),
  );
  resultContainer.innerHTML = "";
  splitAndTrimDivArray.forEach((element) => {
    count.set(
      element.toLowerCase(),
      (count.get(element.toLowerCase()) || 0) + 1,
    );
  });
  sortedList = [...count.entries()].toSorted((a, b) => b[1] - a[1]);
  sortedList.forEach((element) => {
    const para = document.createElement("p");
    para.innerText = element;
    if (element[0] === "") {
      return;
    }
    para.innerText = para.innerText.replace(",", " ===> ");
    resultContainer.appendChild(para);
  });
  storedDisplayWordMap();
});

radioButtons.forEach((button) => {
  addEventListener("change", storedDisplayWordMap);
});

