function rawdevartF() {
    // to store links of each chapter
    let links = [];
    // get all chapters displayed in the table
    let rows;
    // to store download button for easy access
    let pdfButtons = [];
    let zipButtons = [];
    // to store all chapters links for batch Download
    let allChapters = [];
    // to store all chapters images links for batch Download
    let chaptersData = [];
    // check if viewing chapters list page
    if(document.querySelector("main#main-manga div.manga-container") !== null){
        rows = document.querySelectorAll("div.manga-body-right div.list-group-item");
        // calling function
        addNote();
        if(document.querySelector("div.manga-body-right div.list-group-item") !== null){
            addBatchDownload();
            addDownloadButtons();
        }
    }
    // add a note for users
    function addNote(){
        let chapterDiv = document.querySelector("div.manga-body-right");
        let note = document.createElement("span");
        note.id = "md-note";
        note.style.fontSize = "x-large";
        chapterDiv.insertBefore(note,chapterDiv.querySelector("div.info-navs"));
    }
    // add download button for each chapter
    function addDownloadButtons(){
        for (let i=0;i<rows.length;i++) {
            let pdfButton = document.createElement("button");
            let zipButton = document.createElement("button");
            pdfButton.textContent = "pdf";
            zipButton.textContent = "zip";
            // disable the button until fetching images links
            pdfButton.disabled = "true";
            zipButton.disabled = "true";
            // store chapter link
            links[i] = rows[i].querySelector("a").href;
            pdfButton.referrerLink = rows[i].querySelector("a").href;
            
            pdfButton.title = rows[i].querySelector("a span.text-truncate").textContent;
            zipButton.title = pdfButton.title;

            let container = document.createElement("span");
            container.appendChild(pdfButton);
            container.appendChild(zipButton);
            container.classList = "float-right";
            container.style.cssText = "padding-left: 10px";
            rows[i].insertBefore(container ,rows[i].firstChild);
            
            // storing download button for easy access
            pdfButtons.push(pdfButton);
            zipButtons.push(zipButton);
            // to fetch pages number from chapter link
            let xhttp = new XMLHttpRequest();
            // added id to each xhttp request to know what button called it					
            xhttp.id = i;
            xhttp.chapterCount = rows.length;
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
                    let imgs = doc.querySelectorAll("div#img-container img.img-fluid");

                    pdfButton.imgs = [];
                    zipButton.imgs = [];
                    for(let img of imgs){
                        let src = img.getAttribute("data-src");
                        pdfButton.imgs.push(src);
                        zipButton.imgs.push(src);
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
    // add batch download button
    function addBatchDownload(){
        // add the floatDiv to document body
        let floatDiv = document.createElement("div");
        floatDiv.id = "md-floatDiv";
        floatDiv.classList.add("md-float-modal");
        let floatDivContent = document.createElement("div");
        floatDivContent.classList.add("md-float-modal-content");
        let floatCloseButton = document.createElement("span");
        floatCloseButton.classList.add("md-float-close");
        floatCloseButton.innerHTML = "&times;";
        // to close floating div
        floatCloseButton.onclick = function() {
            floatDiv.style.display = "none";
        };
        floatDivContent.appendChild(floatCloseButton);
        floatDiv.appendChild(floatDivContent);
        document.body.appendChild(floatDiv);
        // the button that show the floatDiv
        // the button that show the floatDiv
        let batchDownloadButton = document.createElement("button");
        batchDownloadButton.textContent = "Batch Download";
        batchDownloadButton.id = "md-batch-download-button";
        batchDownloadButton.title = "Download multiple chapters at once";
        batchDownloadButton.classList.add("md-download-button");
        batchDownloadButton.disabled = "true";
        
        let waitNote = document.createElement("span");
        waitNote.textContent = "wait, getting data from all chapters";
        waitNote.id = "md-batch-note";
        let holder = document.createElement("span");
        holder.appendChild(batchDownloadButton);
        holder.appendChild(waitNote);
        // append batch button after the note
        let theNote = document.querySelector("span#md-note");
        theNote.parentElement.insertBefore(holder,theNote.nextElementSibling);

        let floatDivChapterList = document.createElement("select");
        floatDivChapterList.id = "md-float-chapter-list";
        floatDivChapterList.size = 20;
        floatDivChapterList.multiple = true;

        floatDivContent.appendChild(floatDivChapterList);

        let pdfButtonBatch = document.createElement("button");
        pdfButtonBatch.classList.add("md-download-button");
        pdfButtonBatch.textContent = "Download Selected Chapter/s as PDF files";
        let zipButtonBatch = document.createElement("button");
        zipButtonBatch.classList.add("md-download-button");
        zipButtonBatch.textContent = "Download Selected Chapter/s as ZIP files";

        let buttonHolder = document.createElement("span");
        buttonHolder.appendChild(pdfButtonBatch);
        buttonHolder.appendChild(zipButtonBatch);

        floatDivContent.appendChild(buttonHolder);

        pdfButtonBatch.addEventListener("click", function(){
            if(floatDivChapterList.selectedOptions.length > 0){
                batchEmbedImages(pdfButtonBatch,zipButtonBatch,1,floatDivChapterList,batchProgressBar);
            }
        });

        zipButtonBatch.addEventListener("click", function(){
            if(floatDivChapterList.selectedOptions.length > 0){
                batchEmbedImages(pdfButtonBatch,zipButtonBatch,2,floatDivChapterList,batchProgressBar);
            }
        });

        let batchProgressContainer = document.createElement("div");
        batchProgressContainer.classList.add("md-progress-container");
        let batchProgressBar = document.createElement("div");
        batchProgressBar.classList.add("md-progress-bar");
        batchProgressBar.textContent = "0%";
        batchProgressBar.style.display = "none";

        batchProgressContainer.appendChild(batchProgressBar);
        floatDivContent.appendChild(batchProgressContainer);
        getAllChapters();
    }
    // get all chapters from other pages
    async function getAllChapters(){
        let waitNote = document.querySelector("span#md-batch-note");

        let mangaUrl = window.location.href;

        if(mangaUrl.indexOf("?page=") !== -1){
            mangaUrl = mangaUrl.slice(0,mangaUrl.lastIndexOf("?page="));
        }

        waitNote.textContent = "wait, getting the number of pages";
        
        let pageCount = 1;
        if(document.querySelector("ul.pagination > li.page-item > a.page-link")){
            let pagination = document.querySelectorAll("ul.pagination > li.page-item > a.page-link");
            let numberText = pagination[pagination.length-1].search;
            numberText = numberText.replace("?page=","");
            pageCount = parseInt(numberText);
        }

        waitNote.textContent = "wait, 0/"+pageCount+" pages.";
        for(let i=1;i<=pageCount;i++){
            let text = await fetch(mangaUrl+"?page="+i).then(res => res.text()).catch(error => {
                clearConsole();
                waitNote.textContent = "Failed, try to reload the page.";
                return;
            });
            let parser = new DOMParser();
            let doc = parser.parseFromString(text, "text/html");
            let pageRows = doc.querySelectorAll("div.manga-body-right div.list-group-item");

            for(let j=0;j<pageRows.length;j++){
                allChapters.push(
                    {
                        title: pageRows[j].querySelector("a span.text-truncate").textContent,
                        link: pageRows[j].querySelector("a").href
                    }
                );
            }
            waitNote.textContent = "wait, "+i+"/"+pageCount+" pages.";
        }
        getChaptersData();
    }
    // get images from each chapter
    async function getChaptersData(){
        let waitNote = document.querySelector("span#md-batch-note");
        waitNote.textContent = "wait, getting images links from each chapter";
        waitNote.textContent = "wait, 0/"+allChapters.length+" Chapters.";
        for(let i=0 ; i<allChapters.length ;i++){
            let text = await fetch(allChapters[i].link).then(res => res.text()).catch(error => {
                clearConsole();
                waitNote.textContent = "Failed, try to reload the page.";
                return;
            });
            let parser = new DOMParser();
            let doc = parser.parseFromString(text, "text/html");
            let imgs = doc.querySelectorAll("div#img-container img.img-fluid");

            let images = [];
            for(let img of imgs){
                let src = img.getAttribute("data-src");
                images.push(src);
            }

            chaptersData.push(
                {
                    title: allChapters[i].title,
                    images: images,
                    referrerLink: allChapters[i].link
                }
            );

            waitNote.textContent = "wait, "+(i+1)+"/"+allChapters.length+" Chapters.";
        }
        addChaptersToList();
    }
    // add chapters to list inside floatDiv
    function addChaptersToList(){
        let waitNote = document.querySelector("span#md-batch-note");
        waitNote.textContent = "wait, adding Chapters to list.";
        let floatDivChapterList = document.querySelector("select#md-float-chapter-list");

        for(let i=0 ;i<chaptersData.length ;i++){
            let option = document.createElement("option");
            option.textContent = chaptersData[i].title;
            option.value = chaptersData[i].title;
            option.imgs = chaptersData[i].images;
            if(option.imgs === 0){
                option.disabled = "true";
            }
            option.ref = chaptersData[i].referrerLink;
            floatDivChapterList.appendChild(option);
        }

        waitNote.textContent = "Its Ready.";
        waitNote.style.display = "none";
        
        let batchDownloadButton = document.querySelector("button#md-batch-download-button");
        batchDownloadButton.onclick = function(){
            let floatDiv = document.querySelector("div#md-floatDiv");
            floatDiv.style.display = "block";
        };
        batchDownloadButton.removeAttribute("disabled");
    }
}
