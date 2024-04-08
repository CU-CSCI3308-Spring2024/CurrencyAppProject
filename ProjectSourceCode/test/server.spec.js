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

// Positive Testcase for Register:
// API: /register
// Input: {username: 'testuser0123', password: 'password123'}
// Expect: res.status == 200 and res.body.message == 'Success'
// Result: This test case should pass and return a status 200 along with a "Success" message.
// Explanation: The testcase will call the /register API with the following input
// and expects the API to return a status of 200 along with the "Success" message.

describe('/POST register', () => {
  it('Positive: /register. It should register to database', (done) => {
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

// Negative Testcase for Register:
// API: /register
// Input: {username: ' ' password: 'password123'}
// Expect: res.status == 400 and res.body.message == 'Invalid Input'
// Result: This test case should pass and return a status 200 along with a "Invalid input" message.
// Explanation: The testcase will call the /register API with the following invalid input
// and expects the API to return a status of 400 along with the "Invalid input" message.

describe('/POST register', () => {
  it('Negative : /register. Checking invalid name', (done) => {
    let newUser = {
      username: ' ',
      password: 'password123'
    };
    chai.request(server)
        .post('/register')
        .send(newUser)
        .end((err, res) => {
          res.should.have.status(400);
          done();
        });
  });
});

// Additional unit Testcases 

// Positive test case for Login
describe('/POST login', () => {
  it('should login with correct credentials', (done) => {
    chai.request(server)
      .post('/login')
      .send({ username: 'testuser0123', password: 'password123' }) 
      .end((err, res) => {
        res.should.have.status(200); // expect a redirect upon successful login
        done();
      });
  });
});

// Negative test acse for Login (check for correct username but incrorrect password)
describe('/POST login', () => {
  it('should fail with incorrect credentials', (done) => {
    chai.request(server)
      .post('/login')
      .send({ username: 'testuser0123', password: '2' })
      .end((err, res) => {
        res.should.have.status(401); // expect status 401 as the login attempt will fail
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
