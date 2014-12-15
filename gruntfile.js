module.exports = function(grunt) {
  var Crawler = require('./lib/crawler')
    , Mailer = require('./lib/mailer')
    , fs = require('fs')
    , request = require('request');

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json')
  });

  grunt.registerTask('crawl', 'pull top items and tally', function() {
    // Invoke async mode
    var done = this.async();
    var mail = new Mailer();
    mail.send('pullWeek');
  });
};