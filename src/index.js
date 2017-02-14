import child_process from 'child_process';
import request from 'supertest-as-promised';

export default class WebChecker {

  constructor({url}) {
    this.url = url
    this.result = {}
  }

  async checkSecure() {
    // let execSync = child_process.execSync;
    // var resp = execSync(`curl -I ${this.url}`)
    // var result = resp.toString('UTF8');
    // this.result = result
    console.log("=== checkSecure ===", this.url);
    let res = await request(this.url).get("/");
    this.result = res.header;

  }

  getCheckResult() {
    return this.result;
  }

}
