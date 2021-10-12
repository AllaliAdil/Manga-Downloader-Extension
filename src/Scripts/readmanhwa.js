function readmanhwaF() {
    // get manga name
    let mangaName = window.location.pathname;
    mangaName = mangaName.slice(mangaName.lastIndexOf("/")+1,mangaName.length);
    let loops = 0;
    // to store links of each chapter
    let links = [];
    // get all the rows
    let rows;
    // to store download button for easy access
    let pdfButtons = [];
    let zipButtons = [];
    // to store all chapters images for batch Download (store the buttons)
    let chaptersData = [];
    if (document.readyState == "complete") {
        doLoop();
    }
    else{
        window.addEventListener('load', function () {
            doLoop();
        });
    }

    function doLoop(){
        if(document.querySelector("div.comic-chapters") !== null){
            start();
        }
        else{
            if(loops < 60){
                loops++;
                setTimeout(doLoop,1000);
            }
        }
    }
    function start(){
        // check if viewing chapters list page
        if(document.querySelector("div.comic-chapters") !== null){
            rows = document.querySelectorAll("div.comic-chapters > a.comic-chapter");
            // calling function
            addNote();
            addBatchDownload();
            addDownloadButtons();
        }
    }
    // add a note for users
    function addNote(){
        let chapterDiv = document.querySelector("div.comic-chapters").parentElement.parentElement;
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
            // disable the button until fetching chapter pages number
            pdfButton.disabled = "true";
            zipButton.disabled = "true";
            // store chapter link
            links[i] = rows[i].href;
            pdfButton.referrerLink = rows[i].href;
            // add chapter number and name to button title and trimming extra spaces
            let title = rows[i].childNodes[0].nodeValue.trim();
            pdfButton.title = title;
            zipButton.title = title;
            // get chapter number
            let chapter = links[i].replace("/reader","");
            chapter = chapter.slice(chapter.lastIndexOf("/")+1,chapter.length);
            pdfButton.chapter = chapter;
            // wrap links to add buttons
            let wrapper = document.createElement("span");
            rows[i].parentNode.insertBefore(wrapper, rows[i]);
            let buttonHolder = document.createElement("span");
            buttonHolder.style.float = "left";
            buttonHolder.appendChild(pdfButton);
            buttonHolder.appendChild(zipButton);
            wrapper.appendChild(buttonHolder);
            wrapper.appendChild(rows[i]);
            // storing download button for easy access
            pdfButtons.push(pdfButton);
            zipButtons.push(zipButton);
            pdfButton.removeAttribute("disabled");
            zipButton.removeAttribute("disabled");
            pdfButton.addEventListener("click", function(){getChapterImages(pdfButton,zipButton,1);});
            zipButton.addEventListener("click", function(){getChapterImages(pdfButton,zipButton,2);});
        }
    }

    async function getChapterImages(pdfButton,zipButton,type){
        pdfButton.disabled = "true";
        zipButton.disabled = "true";
        let api = `https://readmanhwa.com/api/comics/${mangaName}/${pdfButton.chapter}/images`;

        let data = await fetch(api).then(res => res.json()).catch(error => {
            clearConsole();
            pdfButton.removeAttribute("disabled");
            zipButton.removeAttribute("disabled");
            return;
        });
        let imgs = data.images;
        if(imgs.length > 0){
            pdfButton.imgs = [];
            zipButton.imgs = [];
            for(let img of imgs){
                pdfButton.imgs.push(img.source_url);
                zipButton.imgs.push(img.source_url);
            }

            embedImages(pdfButton,zipButton,type);
        }
        else{
            pdfButton.textContent = "No Images";
            zipButton.style.display = "none";
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
        waitNote.style.color = "black";
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
        for(let i=0;i<rows.length;i++){
            // store chapter link
            let chapter = rows[i].href;
            chapter = chapter.replace("/reader","");
            chapter = chapter.slice(chapter.lastIndexOf("/")+1,chapter.length);
            let title = rows[i].childNodes[0].nodeValue.trim();

            let api = `https://readmanhwa.com/api/comics/${mangaName}/${chapter}/images`;
            let data = await fetch(api).then(res => res.json()).catch(error => {
                clearConsole();
                return;
            });
            let imgs = data.images;
            let images = [];
            for(let img of imgs){
                images.push(img.source_url);
            }
            chaptersData.push(
                {
                    title: title,
                    images: images,
                    referrerLink: rows[i].href
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
