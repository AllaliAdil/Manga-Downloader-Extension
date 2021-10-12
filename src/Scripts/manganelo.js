function manganeloF() {
    // to store links of each chapter
    let links = [];
    // get all chapters displayed in the table
    let rows;
    // to store download button for easy access
    let pdfButtons1 = [];
    let zipButtons1 = [];
    let pdfButtons2 = [];
    let zipButtons2 = [];
    // to store all chapters images for batch Download (store the buttons)
    let chaptersData = [];
    // check if viewing chapters list page
    if(document.querySelector("div.panel-story-chapter-list") !== null){
        rows = document.querySelectorAll("ul.row-content-chapter > li");
        addNote();
        addBatchDownload();
        addDownloadButtons();
    }
    // add a note for users
    function addNote(){
        let chapterDiv = document.querySelector("div.panel-story-chapter-list");
        let note = document.createElement("span");
        note.id = "md-note";
        note.style.fontSize = "x-large";
        note.style.color = "black";
        chapterDiv.insertBefore(note,chapterDiv.firstChild);
    }
    // add download buttons 
    function addDownloadButtons(){
        for (let i=0;i<rows.length;i++) {
            let pdfButton1 = document.createElement("button");
            let zipButton1 = document.createElement("button");
            let pdfButton2 = document.createElement("button");
            let zipButton2 = document.createElement("button");

            pdfButton1.textContent = "pdf";
            zipButton1.textContent = "zip";
            pdfButton2.textContent = "pdf";
            zipButton2.textContent = "zip";

            // store chapter link
            links[i] = rows[i].querySelector("a").href;
            pdfButton1.referrerLink = rows[i].querySelector("a").href;
            pdfButton2.referrerLink = rows[i].querySelector("a").href;
            let title = rows[i].querySelector("a").textContent;

            pdfButton1.title = title;
            zipButton1.title = title;
            pdfButton2.title = title;
            zipButton2.title = title;

            pdfButton1.disabled = "true";
            zipButton1.disabled = "true";
            pdfButton2.disabled = "true";
            zipButton2.disabled = "true";

            let buttonHolder = document.createElement("li");
            buttonHolder.style.cssText = "text-align: right;";
            let text1 = document.createElement("span");
            text1.textContent = "Server 1 ";
            let text2 = document.createElement("span");
            text2.textContent = " ---- Server 2 ";

            buttonHolder.appendChild(text1);
            buttonHolder.appendChild(pdfButton1);
            buttonHolder.appendChild(zipButton1);
            buttonHolder.appendChild(text2);
            buttonHolder.appendChild(pdfButton2);
            buttonHolder.appendChild(zipButton2);

            rows[i].appendChild(buttonHolder);
            // storing download button for easy access
            pdfButtons1.push(pdfButton1);
            zipButtons1.push(zipButton1);
            pdfButtons2.push(pdfButton2);
            zipButtons2.push(zipButton2);

            // to fetch pages number from chapter link
            let xhttp = new XMLHttpRequest();
            // added id to each xhttp request to know what button called it					
            xhttp.id = i;
            xhttp.onreadystatechange = function () {
                let id = this.id;
                let pdfButton1 = pdfButtons1[id];
                let zipButton1 = zipButtons1[id];
                let pdfButton2 = pdfButtons2[id];
                let zipButton2 = zipButtons2[id];
                // in case the page does not exist display and abort request
                if(this.status === 404){
                    pdfButton1.textContent = "Not Found";
                    zipButton1.style.display = "none";
                    pdfButton2.textContent = "Not Found";
                    zipButton2.style.display = "none";
                    this.abort();
                }
                // if the request succeed
                if (this.readyState === 4 && this.status === 200) {
                    // convert text to html DOM
                    let parser = new DOMParser();
                    let doc = parser.parseFromString(this.responseText, "text/html");
                    let serverButtons = doc.querySelectorAll("a.server-image-btn");
                    let serversCount = serverButtons.length;

                    pdfButton1.removeAttribute("disabled");
                    zipButton1.removeAttribute("disabled");
                    if(serversCount === 2){
                        pdfButton2.removeAttribute("disabled");
                        zipButton2.removeAttribute("disabled");
                    }

                    let ref = links[id];
                    let server1 = "https://readmanganato.com/content_server_s1";
                    let server2 = "https://readmanganato.com/content_server_s2";

                    pdfButton1.addEventListener("click", function(){getServerImages(pdfButton1,zipButton1,1,server1,ref);});
                    zipButton1.addEventListener("click", function(){getServerImages(pdfButton1,zipButton1,2,server1,ref);});
                    pdfButton2.addEventListener("click", function(){getServerImages(pdfButton2,zipButton2,1,server2,ref);});
                    zipButton2.addEventListener("click", function(){getServerImages(pdfButton2,zipButton2,2,server2,ref);});
                }
            };
            xhttp.onerror = function (){
                clearConsole();
            };
            xhttp.open("GET", links[i]);
            xhttp.send();
        }
    }

    async function getServerImages(pdfButton,zipButton,type,server,ref){
        pdfButton.disabled = "true";
        zipButton.disabled = "true";

        let html = await fetch(server,{referrer:ref}).then(res => res.text()).catch(error => {
            clearConsole();
            pdfButton.removeAttribute("disabled");
            zipButton.removeAttribute("disabled");
            return;
        });
        let parser = new DOMParser();
        let doc = parser.parseFromString(html, "text/html");
        let imgs = doc.querySelectorAll("div.container-chapter-reader img");

        pdfButton.imgs = [];
        zipButton.imgs = [];
        for(let img of imgs){
            pdfButton.imgs.push(img.src);
            zipButton.imgs.push(img.src);
        }

        embedImages(pdfButton,zipButton,type);
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
        getChaptersData();
    }
    // get images from each chapter
    async function getChaptersData(){
        let waitNote = document.querySelector("span#md-batch-note");
        waitNote.textContent = "wait, getting images links from each chapter";
        waitNote.textContent = "wait, 0/"+rows.length+" Chapters.";
        let server = "https://readmanganato.com/content_server_s1";
        for(let i=0;i<rows.length;i++){
            // store chapter link
            let chapterUrl = rows[i].querySelector("a").href;
            let title = rows[i].querySelector("a").textContent;

            let html = await fetch(server,{referrer:chapterUrl}).then(res => res.text()).catch(error => {
                clearConsole();
                waitNote.textContent = "Failed, try to reload the page.";
                return;
            });
            let parser = new DOMParser();
            let doc = parser.parseFromString(html, "text/html");
            let imgs = doc.querySelectorAll("div.container-chapter-reader img");

            let images = [];
            for(let img of imgs){
                images.push(img.src);
            }

            chaptersData.push(
                {
                    title: title,
                    images: images,
                    referrerLink: chapterUrl
                }
            );

            waitNote.textContent = "wait, "+(i+1)+"/"+rows.length+" Chapter.";
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
