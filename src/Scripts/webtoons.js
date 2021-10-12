function webtoonsF() {
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
    if(document.querySelector("div.detail_lst") !== null){
        rows = document.querySelectorAll("div.detail_lst > ul#_listUl > li");
        addNote();
        addBatchDownload();
        addDownloadButtons();
    }
    // add a note for users
    function addNote(){
        let detailList = document.querySelector("div.detail_lst > ul#_listUl").parentNode;
        let chapterList = document.querySelector("div.detail_lst > ul#_listUl");
        let note = document.createElement("span");
        note.id = "md-note";
        note.style.fontSize = "x-large";
        note.style.color = "black";
        detailList.insertBefore(note,chapterList);
    }
    // add download buttons 
    function addDownloadButtons(){
        for (let i=0;i<rows.length;i++) {
            let pdfButton = document.createElement("button");
            let zipButton = document.createElement("button");
            pdfButton.textContent = "pdf";
            zipButton.textContent = "zip";

            pdfButton.classList.add("md-download-button");
            zipButton.classList.add("md-download-button");

            pdfButton.disabled = "true";
            zipButton.disabled = "true";

            // store chapter link
            links[i] = rows[i].querySelector("a").href;
            pdfButton.referrerLink = rows[i].querySelector("a").href;

            let title = rows[i].querySelector("span.subj > span").textContent;
            pdfButton.title = title;
            zipButton.title = title;

            let buttonHolder = document.createElement("span");
            buttonHolder.style.cssText = "padding-top: 0;padding-bottom: 15px;";
            buttonHolder.appendChild(pdfButton);
            buttonHolder.appendChild(zipButton);

            rows[i].appendChild(buttonHolder);
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
                    let imgs = doc.querySelectorAll("div#_imageList > img._images");

                    pdfButton.imgs = [];
                    zipButton.imgs = [];
                    for(let img of imgs){
                        let src = img.dataset.url;
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
        let lastPage = "";
        var suffix = "&page=999999";
        if(mangaUrl.indexOf("&page=") !== -1){
            mangaUrl = mangaUrl.slice(0,mangaUrl.lastIndexOf("&page="));
            lastPage = mangaUrl + suffix;
        }
        else{
            lastPage = mangaUrl + suffix;
        }
        waitNote.textContent = "wait, getting the number of pages";
        var pageText = await fetch(lastPage).then(res => res.text()).catch(error => {
            clearConsole();
            waitNote.textContent = "Failed, try to reload the page.";
            return;
        });
        let parser = new DOMParser();
        let doc = parser.parseFromString(pageText, "text/html");
        let lastPaginate = doc.querySelector("div.paginate").lastElementChild;
        let numberText = lastPaginate.querySelector("span.on").textContent;
        let pageCount = parseInt(numberText);
        waitNote.textContent = "wait, 0/"+pageCount+" pages.";
        for(let i=1;i<=pageCount;i++){
            let text = await fetch(mangaUrl+"&page="+i).then(res => res.text()).catch(error => {
                clearConsole();
                waitNote.textContent = "Failed, try to reload the page.";
                return;
            });
            let parser = new DOMParser();
            let doc = parser.parseFromString(text, "text/html");
            let pageRows = doc.querySelectorAll("div.detail_lst > ul#_listUl > li");

            for(let j=0;j<pageRows.length;j++){
                allChapters.push(
                    {
                        title: pageRows[j].querySelector("span.subj > span").textContent,
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
            let imgs = doc.querySelectorAll("div#_imageList > img._images");

            let images = [];
            for(let img of imgs){
                let src = img.dataset.url;
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
