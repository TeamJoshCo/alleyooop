var MailChimpAPI = require('mailchimp').MailChimpAPI,
  mKey = 'b0c912cd7f5ef1298a49eee3c0deb456-us3',
  lists = {
    pullWeek: '0af4617a05',
    pullMonth: '0af4617a05',
    pullWeekAnimated: '0af4617a05',
    pullMonthAnimated: '0af4617a05'
  };

function Mailer (argument) {
  try { 
    this.api = new MailChimpAPI(mKey, { version : '2.0' });
  } catch (error) {
      console.log(error.message);
  }
}

Mailer.prototype.gen = function *() {
  yield this.render('index', {
    title: 'hello'
  });
  // (new Mailer).send('pullWeek');
  (new Mailer).send('pullWeekAnimated');
};

Mailer.prototype.send = function(type) {
  // this.api.call('lists', 'list', { start: 0, limit: 25 }, function (error, data) {
  //   if (error)
  //       console.log(error.message);
  //   else
  //       console.log(data); // Do something with your data!
  // });
  var ctxAPI = this.api;
  this.api.call('campaigns', 'create', { 
    type: 'regular', 
    options:{
      list_id: lists[type],
      subject: ('Alley-oop ' + type + ' for ' + (new Date).toDateString()),
      from_email: 'coach@teamjosh.co',
      from_name: 'Coach',
      to_name: 'Dribbbler'
    },
    content: {
      url: ('http://desolate-savannah-6251.herokuapp.com/play/' + type)
    }
  }, function (error, data) {
      if (error){
        console.log(error.message);
      }
      else{
        ctxAPI.call('campaigns', 'send', {
          id: data.id
        }, function(error, data){
          if (error){
            console.log(error.message);
          } else {
            console.log(data);
          }
        });
      }
  });
};

module.exports = Mailer;