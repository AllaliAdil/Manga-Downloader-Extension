function full_metal_alchemistF() {
    // to store links of each chapter
    let links = [];
    // get all chapters displayed in the table
    let rows;
    // to store download button for easy access
    let pdfButtons = [];
    let zipButtons = [];
    // to store all chapters images for batch Download (store the buttons)
    let chaptersData = [];
    // check if viewing chapters list page
    if(document.querySelector("div#Chapters_List") !== null){
        rows = document.querySelectorAll("div#Chapters_List ul ul li");
        // calling function
        addNote();
        addBatchDownload();
        addDownloadButtons();
    }
    // add a note for users
    function addNote(){
        let chapterDiv = document.querySelector("div#Chapters_List");
        let note = document.createElement("span");
        note.id = "md-note";
        note.style.fontSize = "x-large";
        note.style.color = "black";
        chapterDiv.parentElement.insertBefore(note,chapterDiv);
    }
    // add download button for each chapter
    function addDownloadButtons(){
        for (let i=0;i<rows.length;i++) {
            let pdfButton = document.createElement("button");
            let zipButton = document.createElement("button");
            pdfButton.textContent = "pdf";
            zipButton.textContent = "zip";
            pdfButton.classList.add("md-download-button");
            zipButton.classList.add("md-download-button");
            // disable the button until fetching images links
            pdfButton.disabled = "true";
            zipButton.disabled = "true";
            // get title
            let title = rows[i].querySelector("a").textContent;
            pdfButton.title = title;
            zipButton.title = title;
            // store chapter link
            links[i] = rows[i].querySelector("a").href;
            pdfButton.referrerLink = rows[i].querySelector("a").href;

            rows[i].appendChild(pdfButton);
            rows[i].appendChild(zipButton);
            // storing download button for easy access
            pdfButtons.push(pdfButton);
            zipButtons.push(zipButton);
        }
        // to fetch images from each chapter page
        getImages();
    }
    async function getImages(){
        let waitNote = document.querySelector("span#md-batch-note");
        let chapterCount = rows.length;
        for (let i=0;i<rows.length;i++) {
            let fetchError = false;
            let html = await fetch(links[i]).then(res => res.text()).catch(error => {
                fetchError = true;
                pdfButton.textContent("Error");
                zipButton.style.display = "none";
                clearConsole();
            });;
            // convert text to html DOM
            let parser = new DOMParser();
            let doc = parser.parseFromString(html, "text/html");
            let imgs = doc.querySelectorAll("div.entry-content div.separator img");
            
            let pdfButton = pdfButtons[i];
            let zipButton = zipButtons[i];

            pdfButton.imgs = [];
            zipButton.imgs = [];
            for(let img of imgs){
                let src = img.src;
                pdfButton.imgs.push(src);
                zipButton.imgs.push(src);
            }

            // store the button with all the images for batch download
            chaptersData[i] = {
                title: pdfButton.title,
                images: pdfButton.imgs,
                referrerLink: links[i]
            };
            // check if all buttons are add
            let len = chaptersData.reduce((acc,cv)=>(cv)?acc+1:acc,0);
            waitNote.textContent = "wait, "+len+"/"+chapterCount+" Chapters.";
            if(len === chapterCount){
                addChaptersToList();
            }

            pdfButton.removeAttribute("disabled");
            zipButton.removeAttribute("disabled");

            pdfButton.addEventListener("click", function(){embedImages(pdfButton,zipButton,1);});
            zipButton.addEventListener("click", function(){embedImages(pdfButton,zipButton,2);});
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

        floatDivContent.appendChild(floatCloseButton);
        floatDiv.appendChild(floatDivContent);
        document.body.appendChild(floatDiv);

        // to close floating div
        floatCloseButton.onclick = function() {
            floatDiv.style.display = "none";
        };

        // create the button that show the floatDiv
        let batchDownloadButton = document.createElement("button");
        batchDownloadButton.textContent = "Batch Download";
        batchDownloadButton.classList.add("md-download-button");
        batchDownloadButton.id = "md-batch-download-button";
        batchDownloadButton.title = "Download multiple chapters at once";
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
