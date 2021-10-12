function mangadexF() {
    // Use Background page to solve the issue

    /*
    // contentScript.js
    function fetchResource(input, init) {
        return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({input, init}, messageResponse => {
            const [response, error] = messageResponse;
            if (response === null) {
            reject(error);
            } else {
            // Use undefined on a 204 - No Content
            const body = response.body ? new Blob([response.body]) : undefined;
            resolve(new Response(body, {
                status: response.status,
                statusText: response.statusText,
            }));
            }
        });
        });
    }
    
    // background.js
    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        fetch(request.input, request.init).then(function(response) {
        return response.text().then(function(text) {
            sendResponse([{
            body: text,
            status: response.status,
            statusText: response.statusText,
            }, null]);
        });
        }, function(error) {
        sendResponse([null, error]);
        });
        return true;
    });
    */
    /*
    // to store all chapters images links for batch Download
    let chaptersData = [];
    // check if viewing chapters list page
    if(document.querySelector("div.v-item-group") !== null){
        // calling function
        addNote();
        addBatchDownload();
    }
    else{
        loop();
    }
    function loop(){
        if(document.querySelector("div.v-item-group") !== null){
            addNote();
            addBatchDownload();
        }
        else{
            setTimeout(loop,2000);
        }
    }
    // add a note for users
    function addNote(){
        let chapterDiv = document.querySelector("div.v-item-group").parentElement;
        let note = document.createElement("span");
        note.id = "md-note";
        note.style.fontSize = "x-large";
        note.style.color = "black";
        chapterDiv.insertBefore(note,chapterDiv.firstChild);
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
        waitNote.textContent = "wait, fetching data";

        let mangaUrl = window.location.href;
        let manga_id = mangaUrl.split('/').slice(-1)[0];

        let apiUrl = "https://api.mangadex.org/manga/"

        
        // get total number of chapters in manga
        let total = await fetch(apiUrl+manga_id+"/feed?limit=0").then(res => res.text());

        //total = total.total
        console.log(total);
        return;

        // if chapters are more than 500
        offset = 0;
	    while (offset < total){
            index = 0;
            let manga_data = await fetch(apiUrl+manga_id+"/feed?order[chapter]=asc&order[volume]=asc&limit=500").then(res => res.json());
            for(var i=0 ; i< manga_data.results.length ; i++){
                waitNote.textContent = "wait, fetching data "+(index+1)+"/"+total+" chapters";

                let chapter_title = "Chapter "+manga_data.results[i].data.attributes.chapter;
                chapter_title += " "+manga_data.results[i].data.attributes.title;
                chapter_title += " ("+manga_data.results[i].data.attributes.translatedLanguage + ")";

                let chapter_hash = manga_data.results[0].data.attributes.hash;
                let chapter_data = manga_data.results[0].data.attributes.data;
                let chapter_id = manga_data.results[0].data.id;
                let chapter_url = "https://mangadex.org/chapter/"+chapter_id;

                let baseUrl = await fetch("https://api.mangadex.org/at-home/server/"+chapter_id).then(res => res.json());
                baseUrl = baseUrl.baseUrl;

                
                let chapter_images = [];
                
                for (var image_data of chapter_data){
                    let image_url = baseUrl+"/" + "data/" + chapter_hash+"/" + image_data;
                    chapter_images.append(image_url);
                }
                
                console.log(chapter_images);
                return;
                chaptersData[index] = {
                    title: chapter_title,
                    images: chapter_images,
                    referrerLink: chapter_url
                };

                index++;
            }
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
    */
}