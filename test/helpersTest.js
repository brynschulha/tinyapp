const { assert } = require('chai');

const getUserByEmail = require('../helpers.js');

const testUsers = {
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
};

describe('getUserByEmail', function() {
  it('should return a user with valid email', function() {
    const user = getUserByEmail(testUsers, "user@example.com")
    const expectedOutput = "userRandomID";
    // Write your assert statement here
    assert.deepEqual(user, {
      id: "userRandomID", 
      email: "user@example.com", 
      password: "purple-monkey-dinosaur"});
  });
  it('should return null with non-existent email', function() {
    const user = getUserByEmail(testUsers, "notGoingToWork@example.com")
    const expectedOutput = null;
    // Write your assert statement here
    assert.deepEqual(user, null);
  });
});