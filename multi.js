require("chromedriver");

const wd = require("selenium-webdriver");

const browser = new wd.Builder().forBrowser('chrome').build();

let matchId = process.argv[2];
let innings = process.argv[3];
let batsmenUrls = [];
let bowlerUrls = [];
let carrerData = [];
let fs = require('fs');

async function temp() {
    await browser.get("https://www.cricbuzz.com/live-cricket-scores/" + matchId);
    await browser.wait(wd.until.elementLocated(wd.By.css(".cb-nav-bar a")));
    let buttons = await browser.findElements(wd.By.css(".cb-nav-bar a"));
    await buttons[1].click();
    await browser.wait(wd.until.elementLocated(wd.By.css("#innings_" + innings + " .cb-col.cb-col-100.cb-ltst-wgt-hdr")));
    let tables = await browser.findElements(wd.By.css("#innings_" + innings + " .cb-col.cb-col-100.cb-ltst-wgt-hdr"));
    let innings1batsmanrows = await tables[0].findElements(wd.By.css(".cb-col.cb-col-100.cb-scrd-itms")); 

    // BATTING DATA
    for(let i = 0; i < innings1batsmanrows.length; i++) {
        let columns = await innings1batsmanrows[i].findElements(wd.By.css("div"));
        if(columns.length == 7) {
            let url = await columns[0].findElement(wd.By.css("a")).getAttribute("href");
            let playerName = await columns[0].getAttribute("innerText");
            carrerData.push({'playerName' : playerName});
            batsmenUrls.push(url);
        }
    }

    // BOWLING DATA
    let inningsBowlerRows = await tables[1].findElements(wd.By.css(".cb-col.cb-col-100.cb-scrd-itms"));
    for(let i = 0; i < inningsBowlerRows.length; i++) {
        let columns = await inningsBowlerRows[i].findElements(wd.By.css("div"));
        if(columns.length == 8) {
            let url = await columns[0].findElement(wd.By.css("a")).getAttribute("href");
            let playerName = await columns[0].getAttribute("innerText");
            carrerData.push({'playerName' : playerName});
            bowlerUrls.push(url);
        }
    }

    // FINAL DATA
    let finalurls = batsmenUrls.concat(bowlerUrls);
    for(let i = 0; i < finalurls.length; i++) {
        await browser.get(finalurls[i]);
        await browser.wait(wd.until.elementLocated(wd.By.css("table")));
        let tables = await browser.findElements(wd.By.css("table"));
        let battingKeys = [];
        let bowllingKeys = [];
        for(let j = 0; j < tables.lenhgth; j++) {
            let keyColumns = await tables[j].findElements(wd.By.css("thead th"));
            for(let k = 1; k < keyColumns.length; k++) {
                let title = await keyColumns[k].getAttribute("title");
                title = title.split(" ").join("");
                if(j == 0) {
                    batingKeys.push(title);
                } else {
                    bowllingKeys.push(title);
                }
            }

            let data = {};
            let dataRows = await tables[j].findElements(wd.By.css("tbody tr"));
            for(let k = 0; k < dataRows.length; k++) {
                let tempData = {};
                let dataColumns = await dataRows[k].findElements(wd.By.css("td"));
                let matchtype = await dataColumns[0].getAttribute("innerText");
                for(let l = 1; l < dataColumns.length; l++) {
                    tempData[j == 0 ? battingKeys[l - 1] : bowllingKeys[ l - 1]] = await datacolumns[l].getAttribute("innerText");
                }
                data[matchtype] = tempData;
            }
            carrerData[i][j == 0 ? "battingcarrer" : "bowlingcarrer"] = data;
        }
    }
    console.log(carrerData);
    fs.writeFileSync("carrer.json", JSON.stringify(carrerData));
    await browser.close();
}

temp();