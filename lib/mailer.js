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
  var d = new Date();
  if (d.getHours() < 1){
    // once a day, please
    if ( d.getDay() == 1){
      // weekly things
      (new Mailer).send('pullWeekAnimated');
      (new Mailer).send('pullWeek');
    }
    if (d.getDate() == 1){
      // monthly things
      (new Mailer).send('pullMonthAnimated');
      (new Mailer).send('pullMonth');
      if (d.getMonth() == 0){
        // yearly things
        (new Mailer).send('pullYearkAnimated');
        (new Mailer).send('pullYear');
      }
    }
  }
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
          cid: data.id
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