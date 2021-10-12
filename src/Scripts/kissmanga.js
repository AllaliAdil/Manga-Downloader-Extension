/*
*           This website is Terminated
*           only .com is legit
*/
function kissmangaF() {
    // check if viewing chapters list page
    if(document.querySelector("div.chapterList table.listing") !== null){
        addNote();
    }

    if(document.querySelector("select#selectReadType") !== null){
        //check reading type
        let readingType = document.querySelector("select#selectReadType").selectedOptions[0].text;
        if(readingType === "All pages"){
            addDownloadButtons();
        }
        else{
            let downloadNote = document.createElement("span");
            downloadNote.style.cssText = "font-weight: bold;font-size: large;color: red;";
            downloadNote.textContent = "(Manga Downloader) to download this chapter change the reading type to \"All pages\"";
            let container = document.querySelector("div#divImage").parentNode;
            container.insertBefore(downloadNote,container.firstChild);
            return;
        }
    }
    // add a note for users
    function addNote(){
        let chapterList = document.querySelector("div.chapterList table.listing").parentNode;
        let note = document.createElement("span");
        note.style.fontSize = "x-large";
        chapterList.insertBefore(note,chapterList.querySelector("table.listing"));
    }
    // add download buttons 
    function addDownloadButtons(){
        let pdfButton = document.createElement("button");
        let zipButton = document.createElement("button");
        pdfButton.style.width = "50px";
        zipButton.style.width = "50px";
        pdfButton.id = "pdfButtonId";
        zipButton.id = "zipButtonId";
        pdfButton.textContent = "pdf";
        zipButton.textContent = "zip";
        // disable the button until all images loads
        pdfButton.disabled = "true";
        zipButton.disabled = "true";
        
        let title;
        if(document.querySelector("select.selectChapter") !== null){
            title = document.querySelector("select.selectChapter").selectedOptions[0].text;
        }
        else{
            title = document.querySelector("select#selectChapter").selectedOptions[0].text;
        }

        pdfButton.title = title;
        zipButton.title = title;
        
        let buttonsHolder = document.createElement("span");
        buttonsHolder.appendChild(pdfButton);
        buttonsHolder.appendChild(zipButton);
        let hint = document.createElement("span");
        hint.textContent = " Wait for all images to load";
        buttonsHolder.appendChild(hint);

        let container = document.querySelector("div#divImage").parentNode;
        container.insertBefore(buttonsHolder,container.firstChild);

        if (document.readyState == "complete") {
            hint.remove();
            getImages();
        }
        else{
            window.addEventListener('load', function () {
                hint.remove();
                getImages();
            });
        }
    }

    function getImages(){
        let pdfButton = document.querySelector("button#pdfButtonId");
        let zipButton = document.querySelector("button#zipButtonId");
        pdfButton.imgs = [];
        zipButton.imgs = [];
        let imgs = document.querySelectorAll("div#divImage img");
        for(let img of imgs){
            pdfButton.imgs.push(img.src);
            zipButton.imgs.push(img.src);
        }
        pdfButton.removeAttribute("disabled");
        zipButton.removeAttribute("disabled");
        pdfButton.addEventListener("click", function(){embedImages(pdfButton,zipButton,1);});
        zipButton.addEventListener("click", function(){embedImages(pdfButton,zipButton,2);});
    }
}
