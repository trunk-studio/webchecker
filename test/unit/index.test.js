import { assert } from 'chai';
import WebChecker from '../../src'
describe('check website', function() {
  // let url = process.argv[11];
  let url = process.env.checkurl;

  let webChecker = null;
  before((done) => {
    try {
      webChecker = new WebChecker({url});
      done();
    } catch (e) {
      done(e);
    }

  })

  describe(`target: ${url},`, function() {
    let header = {};
    before(async function (done) {
      await webChecker.checkSecure();
      header = webChecker.getCheckResult();
      done();
    })

    it('should Server header without display nginx version.', function(done) {
      let {server} = header
      if (server===undefined) return done();
      server.split("/").length.should.be.eq(1);
      done();

    });

    it('should Server header without display x-powered-by', function(done) {
      let powered = header["x-powered-by"]
      if (powered===undefined) return done();
      powered.should.be.eq(null);
      done();
    });

  });
});
