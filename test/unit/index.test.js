import { assert } from 'chai';
import WebChecker from '../../src'
describe('description', function() {
  // let url = process.argv[11];
  let url = "http://trunk-studio.com/";
  let webChecker = null;
  before((done) => {
    webChecker = new WebChecker({url});
    done();
  })

  describe(`check ${url} website info`, function() {
    before(async function (done) {
      await webChecker.checkSecure();
      done();
    })

    it('should Preventing Information Disclosure ', function(done) {
      let result = webChecker.getCheckResult();
      let {server} = result
      server.split("/").length.should.be.eq(1)
      done();

    });

  });
});
