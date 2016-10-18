
import helpers = require('yeoman-test');
import path = require('path');
import assert = require('yeoman-assert');
 

describe('silib:app', function () {
  describe('when using require.js', function () {
    before(function () {
      return helpers.run(path.join( __dirname, '../generators/app'))
        .withOptions({ foo: 'bar' })    // Mock options passed in
        .withArguments(['name-x'])      // Mock the arguments
        .withPrompts({ coffee: false }) // Mock the prompt answers
        .toPromise();                   // Get a Promise back for when the generator finishes
    });

    it('generate a router.js file', function () {
      // assert the file exist
      // assert the file uses AMD definition
    });

    it('generate a view file');
    it('generate a base controller');
  });
});