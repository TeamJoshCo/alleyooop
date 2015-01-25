var koa       = require('koa');
var favicon   = require('koa-favi');
var compress  = require('koa-compress');
var jade      = require('koa-jade');
var route     = require('koa-route');
var app       = koa();
var Crawler   = require('./lib/crawler');
var Mailer    = require('./lib/mailer');

app.use(favicon());
// or app.use(favicon('/favicon/path'));
app.use(require('koa-static')(__dirname + '/public'));
app.use(compress());
app.use(jade.middleware({
  viewPath: __dirname + '/views',
  debug: false,
  pretty: false,
  compileDebug: false
}));

// app.use(function* () {
//   yield this.render('index', locals_for_this_page, true)
// })

// logger
app.use(function *(next){
  var start = new Date;
  yield next;
  var ms = new Date - start;
  console.log('%s %s - %s', this.method, this.url, ms);
});

// response

// app.use(function *(){
//   this.body = 'Hello World';
// });
app.use(route.get('/play', (new Mailer).gen));
app.use(route.get('/play/:name', (new Crawler).gen));
app.use(route.get('/', function* () {
  yield this.render('index', {
    title: 'Alleyoop'
  });
}));

app.listen(process.env.PORT || 3001);