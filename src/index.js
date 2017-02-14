import child_process from 'child_process';
import request from 'supertest-as-promised';

export default class WebChecker {

  constructor({url}) {
    this.url = url
    this.result = {}
    if(!this.url) throw new Error("without set check url.");
  }

  async checkSecure() {
    console.log("=== checkSecure ===", this.url);
    let res = await request(this.url).get("/");
    this.result = res.header;
  }

  getCheckResult() {
    return this.result;
  }

}
