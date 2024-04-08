// ********************** Initialize server **********************************

const server = require('../src/index'); //TODO: Make sure the path to your index.js is correctly added

// ********************** Import Libraries ***********************************

const chai = require('chai'); // Chai HTTP provides an interface for live integration testing of the API's.
const chaiHttp = require('chai-http');
chai.should();
chai.use(chaiHttp);
const {assert, expect} = chai;

// ********************** DEFAULT WELCOME TESTCASE ****************************

describe('Server!', () => {
  // Sample test case given to test / endpoint.
  it('Returns the default welcome message', done => {
    chai
      .request(server)
      .get('/welcome')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.status).to.equals('success');
        assert.strictEqual(res.body.message, 'Welcome!');
        done();
      });
  });
});

// *********************** TODO: WRITE 2 UNIT TESTCASES **************************

describe('/POST register', () => {
  it('it should register to database', (done) => {
    let newUser = {
      username: 'testuser0123',
      password: 'password123'
    };
    chai.request(server)
        .post('/register')
        .send(newUser)
        .end((err, res) => {
          res.should.have.status(200); 
          done();
        });
  });
});


describe('Access Protected Page', () => {
  it('should redirect to the login page if not logged in', (done) => {
    chai.request(server)
      .get('/profile') // '/profile' is a protected route requiring authentication.
      .redirects(0) // Prevent automatic redirection following to inspect the initial response.
      .end((err, res) => {
        if (err) done(err);
        // Expect a redirect status code.
        res.should.have.status(302);
        // Check that the Location header points to the login page.
        res.headers.location.should.include('/login');
        done();
      });
  });
});

describe('Forgot Password Link', () => {
  it('should redirect to the forgot password page when clicked', (done) => {
    // Directly request the /passwordReset page
    chai.request(server)
      .get('/passwordReset')
      .end((err, res) => {
        if (err) done(err);
        // Expect a 200 status code indicating successful retrieval
        res.should.have.status(200);
        res.text.should.include('reset password'); // Example check for page-specific content
        done();
      });
  });
});
// ********************************************************************************
