/**
  * Crawler
  *
  */
var fs = require('fs'),
    request = require('koa-request'),
    dKey = 'access_token=ee7caf6603d4112872a57bba9b288150086ea3d4f8b7600701b9b44b46b9d887',
    base = 'https://api.dribbble.com/v1/shots',
    mailer = require('../lib/mailer');

function Crawler (type) {
  this.type = type;
}
Crawler.prototype.pullWeek = function *() {
  console.log('pulling this week');
  var a = yield request([base, dKey].join('?timeframe=week&'));
  return JSON.parse(a.body);
};

Crawler.prototype.pullMonth = function *() {
  console.log('pulling this month');
  var a = yield request([base, dKey].join('?timeframe=month&'));
  return JSON.parse(a.body);
};

Crawler.prototype.pullYear = function *() {
  console.log('pulling this year');
  var a = yield request([base, dKey].join('?timeframe=year&'));
  return JSON.parse(a.body);
};

Crawler.prototype.pullWeekAnimated = function *() {
  console.log('pulling this week');
  var a = yield request([base, dKey].join('?timeframe=week&list=animated&'));
  return JSON.parse(a.body);
};

Crawler.prototype.pullMonthAnimated = function *() {
  console.log('pulling this week');
  var a = yield request([base, dKey].join('?timeframe=month&list=animated&'));
  return JSON.parse(a.body);
};

Crawler.prototype.pullWeekDebuts = function *() {
  console.log('pulling this week');
  var a = yield request([base, dKey].join('?timeframe=week&list=debuts&'));
  return JSON.parse(a.body);
};

Crawler.prototype.pullMonthDebuts = function *() {
  console.log('pulling this week');
  var a = yield request([base, dKey].join('?timeframe=month&list=debuts&'));
  return JSON.parse(a.body);
};

Crawler.prototype.gen = function *(name) {
  console.log(name);
  var shots = yield Crawler.prototype[name]();
  // console.log(shots[0]);
  yield this.render('email', {
    title: name,
    shots: shots,
    dates: name.split('pull')[1]
  });
};

module.exports = Crawler;