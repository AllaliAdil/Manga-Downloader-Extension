function qiman6F(){
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
    // check if viewing chapters list page
    if(document.querySelector("div#chapterList") !== null){
        loop();
    }

    function loop(){
        if(document.querySelector("div#chapterList > div#chapterlistload > div.moreChapter") !== null){
            // show hidden chapters
            let showAllChapters = document.querySelector("div#chapterList > div#chapterlistload > div.moreChapter");
            showAllChapters.click();
            if(loops < 60){
                loops += 5;
                setTimeout(loop,5000);
            }
        }
        else{
            start();
        }
    }
    function start(){
        // calling function
        addNote();
        addBatchDownload();
        addDownloadButtons();
    }
    // add a note for users
    function addNote(){
        var mark = document.createElement("span");
        mark.id = "azerty";
        mark.style.display = "none";
        document.body.appendChild(mark);

        let chapterDiv = document.querySelector("div#chapterList");
        let note = document.createElement("span");
        note.id = "md-note";
        note.style.fontSize = "x-large";
        note.style.color = "black";
        chapterDiv.insertBefore(note,chapterDiv.firstElementChild);
    }
    // add download button for each chapter
    function addDownloadButtons(){
        rows = document.querySelectorAll("div#chapterList > div#chapterlistload > div#chapter-list1 > a");
        for (let i = 0; i < rows.length; i++) {
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
            pdfButton.title = rows[i].textContent;
            pdfButton.title = pdfButton.title.trim();
            zipButton.title = pdfButton.title;
            rows[i].style.cssText = "display: block; margin:0";
            // create wrapper container
            let wrapper = document.createElement('span');
            wrapper.classList.add("md-qiman6-chapter");
            //wrapper.style.display = "inherit";
            // insert wrapper before el in the DOM tree
            rows[i].parentNode.insertBefore(wrapper, rows[i]);
            // move el into wrapper
            wrapper.appendChild(rows[i]);
            wrapper.appendChild(pdfButton);
            wrapper.appendChild(zipButton);
            
            // storing download button for easy access
            pdfButtons.push(pdfButton);
            zipButtons.push(zipButton);
            
            // to fetch pages number from chapter link
            let xhttp = new XMLHttpRequest();
            // added id to each xhttp request to know what button called it					
            xhttp.id = i;
            xhttp.chapterCount = rows.length;
            xhttp.onreadystatechange = function () {
                let waitNote = document.querySelector("span#md-batch-note");
                let id = this.id;
                let chapterCount = this.chapterCount;
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
                    let scripts = doc.querySelectorAll("script");

                    let exist = false;
                    let script;
                    for(let scr of scripts){
                        script = scr.textContent.trim();
                        if(script.includes("function(p,a,c,k,e,d)")){
                            exist = true;
                            break;
                        }
                    }
                    if(!exist){
                        return;
                    }

                    let startIndex = script.indexOf("}(")+2;
                    let str = script.slice(startIndex, script.length - 2);

                    let p = str.slice(0,str.indexOf("\"]'")+3);
                    str = str.replace(p+",","");
                    str = str.split(' ').join('');
                    let arr = str.split(",");
                    let a = parseInt(arr[0]);
                    let c = parseInt(arr[1]);
                    let k = arr[2].replace("'.split('|')","").replace("'","").split("|");
                    let e = parseInt(arr[3]);
                    let d = JSON.parse(arr[4]);
                    let imgs = decryptImages(p, a, c, k, e, d);

                    pdfButton.imgs = imgs.slice();
                    zipButton.imgs = imgs.slice();

                    // store the button with all the images for batch download
                    chaptersData[id] = {
                        title: pdfButton.title,
                        images: pdfButton.imgs,
                        referrerLink: links[id]
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
            };
            xhttp.onerror = function (){
                clearConsole();
            };
            xhttp.open("GET", links[i], true);
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
        batchDownloadButton.id = "md-batch-download-button";
        batchDownloadButton.title = "Download multiple chapters at once";
        batchDownloadButton.disabled = "true";
        
        let waitNote = document.createElement("span");
        waitNote.textContent = "wait, getting data from all chapters";
        waitNote.id = "md-batch-note";
        waitNote.style.fontSize = "small";
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
            let title = chaptersData[i].title;
            option.value = title;
            option.title = title;
            // trim title in the middle if it's too long
            if(title.length > 140){
                let middle = title.length / 2;
                let difference = title.length - 140;
                let start = middle - (difference/2);
                let end = middle + (difference/2);
                title = title.substring(0, start) + "..." + title.substring(end);
            }
            option.textContent = title;
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
    function decryptImages(p, a, c, k, e, d) {
        e = function (c) {
            return (c < a ? '' : e(parseInt(c / a))) + ((c = c % a) > 35 ? String.fromCharCode(c + 29) : c.toString(36))
        };
        if (!''.replace(/^/, String)) {
            while (c--) {
                d[e(c)] = k[c] || e(c)
            }
            k = [function (e) {
                return d[e]
            }];
            e = function () {
                return '\\w+'
            };
            c = 1
        };
        while (c--) {
            if (k[c]) {
                p = p.replace(new RegExp('\\b' + e(c) + '\\b', 'g'), k[c])
            }
        }
        let result = p.slice(p.indexOf("[\""), p.length - 1);
        result = "{\"images\":" + result + "}"; 
        let obj = JSON.parse(result);
        return obj.images;
    }
}