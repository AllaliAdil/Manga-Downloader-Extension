var host = window.location.host;

if(document.querySelector("span#azerty") === null){
    // to make code run only once 
    if(host !== "www.qiman6.com" && host !== "qingman5.com" && host !== "www.mangapanda.com"){
        var mark = document.createElement("span");
        mark.id = "azerty";
        mark.style.display = "none";

        document.body.appendChild(mark);
        // tell the browser to use HTTPS rather than HTTP.
        let upgradeInsecure = document.createElement("meta");
        upgradeInsecure.httpEquiv = "Content-Security-Policy";
        upgradeInsecure.content = "upgrade-insecure-requests";
        document.head.insertBefore(upgradeInsecure,document.head.firstElementChild);
    }
    
    switch (host) {
        case "www.mangareader.net":
            mangareaderF();
            break;
        case "www.mangapanda.com":
            mangapandaF();
            break;
        case "mangakiss.org":
        case "mangakomi.com":
        case "mangazone.cc":
        case "mangafort.com":
        case "1stkissmanga.com":
        case "1stkissmanga.io":
        case "zinmanga.com":
        case "365manga.com":
        case "toonily.net":
        case "mangatx.com":
        case "aloalivn.com":
        case "manhuaplus.com":
        case "mangaclash.com":
        case "manhuasworld.com":
            mangakissF();   // is the same as mangakiss.org
            break;
        case "manhuaus.com":
            manhuausF();    // is the same as mangakiss.org
            break;
        case "ww3.mangafox.online":
        case "ww4.mangafox.online":
            mangafoxF();
            break;
        case "kissmanga.com":
            kissmangaF();
            break;        
        case "mangakakalot.com":
            mangakakalotF();
            break;
        case "manganelo.com":
        case "manganato.com":
        case "chapmanganato.com":
        case "readmanganato.com":
            manganeloF();
            break;
        case "ww5.readhaikyuu.com":
        case "ww7.readsnk.com":
        case "ww3.readbleachmanga.com":
        case "ww2.readnoblesse.com":
            readnarutoF();
            break;
        case "ww5.readblackclover.com":
        case "ww6.readblackclover.com":
        case "ww6.dbsmanga.com":
        case "ww7.readonepiece.com":
        case "ww8.readonepiece.com":
        case "ww3.readhaikyuu.com":
        case "ww4.readhaikyuu.com":
        case "ww6.readhaikyuu.com":
        case "ww5.readmha.com":
        case "ww6.readmha.com":
        case "readjujutsukaisen.com":
        case "ww1.readjujutsukaisen.com":
        case "readchainsawman.com":
        case "ww1.readchainsawman.com":
        case "ww2.demonslayermanga.com":
        case "ww4.demonslayermanga.com":
        case "ww5.demonslayermanga.com":
        case "ww2.readdrstone.com":
        case "ww3.readdrstone.com":
        case "ww6.readnaruto.com":
        case "ww7.readnaruto.com":
        case "ww7.tokyoghoulre.com":
        case "ww8.tokyoghoulre.com":
        case "ww4.readfairytail.com":
        case "ww1.readkingdom.com":
        case "ww2.readkingdom.com":
        case "readkaguyasama.com":
        case "ww1.readkaguyasama.com":
        case "readsololeveling.org":
        case "ww2.readneverland.com":
        case "ww3.readneverland.com":
        case "ww1.readtowerofgod.com":
        case "ww1.readvinlandsaga.com":
        case "ww3.read7deadlysins.com":
        case "ww2.readhxh.com":
            readblackcloverF();
            break;
        case "ww3.readopm.com":
        case "readberserk.com":
            readopmF();
            break;
        case "kiryuu.co":
            kiryuuF();              // sektekomik.com is the same as kiryuu.co
            break;
        case "sektekomik.com":
            sektekomikF();
            break;
        case "mangadex.org":
            mangadexF();
            break;
        case "rawdevart.com":
            rawdevartF();
            break;
        case "mangasee123.com":
        case "manga4life.com":
            mangasee123F();         // manga4life.com is the same as mangasee123.com
            break;
        case "www.webtoons.com":
            webtoonsF();
            break;
        case "www.mangasail.co":
        case "www.mangatail.me":
        case "www.mangasaki.com":
            mangasailF();
            break;
        case "readmanhwa.com":
            readmanhwaF();
            break;
        case "www.mangatown.com":
            mangatownF();
            break;
        case "loveheaven.net":  // changed to lovehug.net
        case "kissaway.net":
        case "klmanga.com":
            loveheavenF();
            break;
        case "www.qiman6.com":
            qiman6F();
            break;
        case "qingman5.com":
            qingman5F();
            break;
        case "full-metal-alchemist.com":
            full_metal_alchemistF();
            break;
        case "www.funmanga.com":
        case "www.mngdoom.com":
        case "www.mangainn.net":
            funmangaF();
            break;
        case "mangafast.net":
        case "comic.mangafast.net":
            mangafastF();
            break;
        case "lovehug.net":
            lovehugF();
            break;
        default:
            // alert("This should not happen");
            // this switch is for controlling which function should be called
            // just to not call all the functions
            break;
    }
}
