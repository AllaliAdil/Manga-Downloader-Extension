function mangafoxF() {
    // to store links of each chapter
    let links = [];
    // get all chapters displayed in the table
    let chapterList;
    // get all the rows
    let rows;
    // to store download button for easy access
    let pdfButtons = [];
    let zipButtons = [];
    // check if viewing chapters list page
    if(document.querySelector("div.manga_chapter_list") !== null){
        chapterList = document.querySelector("div.manga_chapter_list");
        // get all the rows
        rows = chapterList.querySelectorAll("ul > li");
        // hide views column
        let el = document.querySelectorAll("div.chapter_time");
        for(let e of el){
            e.style.display = "none";
        }

        // calling function
        addNote();
        addDownloadHeader();
        addDownloadButtons();
    }
    // add a note for users
    function addNote(){
        let chapterDiv = document.querySelector("div.manga_chapter");
        let note = document.createElement("span");
        note.style.fontSize = "x-large";
        note.style.color = "black";
        chapterDiv.insertBefore(note,chapterDiv.firstChild);
    }
    // add a header for download row
    function addDownloadHeader(){
        let header = document.querySelector("div.title_list_chapter");
        let downloadHeader = document.createElement("div");
        downloadHeader.textContent = "Download";
        downloadHeader.className = "chapter_time";
        header.appendChild(downloadHeader);
    }
    // add download button for each chapter
    function addDownloadButtons(){
        for (let i=0;i<rows.length;i++) {
            let pdfButton = document.createElement("button");
            let zipButton = document.createElement("button");
            pdfButton.classList.add("md-download-button");
            zipButton.classList.add("md-download-button");

            pdfButton.textContent = "pdf";
            zipButton.textContent = "zip";
            // disable the button until fetching images links
            pdfButton.disabled = "true";
            zipButton.disabled = "true";
            // store chapter link
            links[i] = rows[i].querySelector("a").href;
            pdfButton.referrerLink = rows[i].querySelector("a").href;

            pdfButton.title = rows[i].querySelector("a").title;
            zipButton.title = pdfButton.title;
            
            let buttonsHolder = document.createElement("div");
            buttonsHolder.className = "chapter_time";
            buttonsHolder.appendChild(pdfButton);
            buttonsHolder.appendChild(zipButton);
            rows[i].appendChild(buttonsHolder);
            // storing download button for easy access
            pdfButtons.push(pdfButton);
            zipButtons.push(zipButton);
            // to fetch pages number from chapter link
            let xhttp = new XMLHttpRequest();
            // added id to each xhttp request to know what button called it					
            xhttp.id = i;
            xhttp.onreadystatechange = function () {
                let id = this.id;
                let pdfButton = pdfButtons[id];
                let zipButton = zipButtons[id];
                // in case the page does not exist display and abort request
                if(this.status === 404){
                    pdfButton.textContent = "Not Found";
                    zipButton.style.display = "none";
                    this.abort();
                }
                // if the request succeed
                if (this.readyState === 4 && this.status === 200) {
                    // convert text to html DOM
                    let parser = new DOMParser();
                    let doc = parser.parseFromString(this.responseText, "text/html");
                    let imgs = doc.querySelectorAll("div.list_img > img");

                    pdfButton.imgs = [];
                    zipButton.imgs = [];
                    for(let img of imgs){
                        pdfButton.imgs.push(img.src);
                        zipButton.imgs.push(img.src);
                    }

                    pdfButton.removeAttribute("disabled");
                    zipButton.removeAttribute("disabled");
                    pdfButton.addEventListener("click", function(){embedImages(pdfButton,zipButton,1);});
                    zipButton.addEventListener("click", function(){embedImages(pdfButton,zipButton,2);});
                }
            };
            xhttp.onerror = function (){
                clearConsole();
            };
            xhttp.open("GET", links[i]);
            xhttp.send();
        }
    }
}
