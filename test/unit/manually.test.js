describe('genernator report for human read', function() {
  const fs = require('fs');
  const Crawler = require("simplecrawler");
  const cheerio = require("cheerio");
  const path = require('path');

  let url = process.env.checkurl;
  let domain = url.split("://")[1].split("/")[0];
  let reportFolder = "report-" + domain.replace(".","-");

  describe(`target: ${url},`, function() {
    let header = {};
    before(async function (done) {
      try {
        let fileExist = await fs.existsSync(reportFolder);
        if (fileExist) {
          throw new Error("report exist, using `npm run clean-report` remove all report or manually remove report to continue");
        }
        fs.mkdirSync(reportFolder);
        done();
      } catch(e) {
        done(e);
      }
    })

    it(`genernate Open Graph report to ${reportFolder}`, function(done) {
      let logFiles = {
        fileLogCSV: "files.csv",
        errorLogCSV: "error.csv",
        openGraphicLogCSV: "OG.csv"
      }
      // TODO: write header
      
      // TODO: package as library
      let csvFormat = function(str) {
        if (str === undefined) {
          str = "";
        }
        str = str.toString();
        return "\"" +  str.replace("\"","\\\"") + "\"";
      }
      let csvRecord = function(dataArray) {
        let escapedArray = dataArray.map(function(data) {return csvFormat(data);})

        return escapedArray.join(",")+"\n";
      }
      let csvWrite = function(fileName, dataArray) {
        let dataString = csvRecord(dataArray);
        fs.writeFileSync(fileName, dataString, {flag: 'a'} )
      }

      let crawler = new Crawler(url);
      crawler.interval = 500;
      crawler.maxConcurrency = 3;
      crawler.maxDepth = 5;
      crawler.on("fetchcomplete", function(queueItem, responseBuffer, response) {
        // basic data for every link
        let url = queueItem.url;
        let length = responseBuffer.length;
        let contentType = response.headers['content-type'].split(";")[0];

        let sizeData = [url,contentType,length];
        csvWrite(path.join(reportFolder,logFiles.fileLogCSV), sizeData);

        // fetch og data
        if (contentType == "text/html") {
          let $ = cheerio.load(responseBuffer);

          let ogData = [];
          ogData.push(url);
          ogData.push(("title").text);
          ogData.push($('meta[property="author"]').attr('content'));
          ogData.push($('meta[property="description"]').attr('content'));
          ogData.push($('meta[property="og:title"]').attr('content'));
          ogData.push($('meta[property="og:description"]').attr('content'));
          ogData.push($('meta[property="og:site_name"]').attr('content'));
          ogData.push($('meta[property="og:locale"]').attr('content'));
          ogData.push($('meta[property="og:image"]').attr('content'));
          ogData.push($('meta[property="og:image:type"]').attr('content'));
          ogData.push($('meta[property="og:image:width"]').attr('content'));
          ogData.push($('meta[property="og:image:height"]').attr('content'));
          ogData.push($('meta[property="og:type"]').attr('content'));

          csvWrite(path.join(reportFolder,logFiles.openGraphicLogCSV), ogData);
        } 
      });

      crawler.on("fetch404", function() {
      
      });
      
      crawler.on("fetch410", function() {
      
      });

      crawler.on("fetcherror", function() {
        // file too big
      });

      crawler.on("fetchtimeout", function() {
      
      });

      crawler.on("gziperror", function() {
      
      });

      crawler.on("complete", function() {
        done();
      });

      crawler.start();
    });
  });
});
