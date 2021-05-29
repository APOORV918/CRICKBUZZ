require("chromedriver");

const wd = require("selenium-webdriver");

const browser = new wd.Builder().forBrowser('chrome').build();

let matchId = process.argv[2];
let innings = process.argv[3];
let batsmenScorecard = [];
let bowlerScorecard = [];
let batsmenKeys = ["playerName", "out", "runs", "ballsPlayed", "fours", "sixes", "strikeRate"];
let bowlerKeys = ["playerName", "overs", "maidenOvers", "runs", "wickets", "noBalls", "wideBalls", "economy"];

async function temp() {
    await browser.get("https://www.cricbuzz.com/live-cricket-scores/" + matchId);
    await browser.wait(wd.until.elementLocated(wd.By.css(".cb-nav-bar a")));
    let buttons = await browser.findElements(wd.By.css(".cb-nav-bar a"));
    await buttons[1].click();
    await browser.wait(wd.until.elementLocated(wd.By.css("#innings_" + innings + " .cb-col.cb-col-100.cb-ltst-wgt-hdr")));
    let tables = await browser.findElements(wd.By.css("#innings_" + innings + " .cb-col.cb-col-100.cb-ltst-wgt-hdr"));
    let innings1batsmanrows = await tables[0].findElements(wd.By.css(".cb-col.cb-col-100.cb-scrd-itms"));
    for(let i = 0; i < innings1batsmanrows.length; i++) {
        let columns = await innings1batsmanrows[i].findElements(wd.By.css("div"));
        if(columns.length == 7) {
            let data = {};
            for(let j = 0; j < columns.length; j++) {
                data[batsmenKeys[j]] = await columns[j].getAttribute("innerText");
            }
            batsmenScorecard.push(data);
        }
    }
    console.log(batsmenScorecard);
    
    let inningsBowlerRows = await tables[1].findElements(wd.By.css(".cb-col.cb-col-100.cb-scrd-itms"));
    for(let i = 0; i < inningsBowlerRows.length; i++) {
        let columns = await inningsBowlerRows[i].findElements(wd.By.css("div"));
        if(columns.length == 8) {
            let data = {};
            for(let j = 0; j < columns.length; j++) {
                data[bowlerKeys[j]] = await columns[j].getAttribute("innerText");
            }
            bowlerScorecard.push(data);
        }
    }
    console.log(bowlerScorecard);
    await browser.close();
}

temp();