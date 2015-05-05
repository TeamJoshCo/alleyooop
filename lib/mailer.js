var MailChimpAPI = require('mailchimp').MailChimpAPI,
  mKey = 'b0c912cd7f5ef1298a49eee3c0deb456-us3',
  lists = {
    pullWeek: '0af4617a05',
    pullMonth: '0af4617a05',
    pullWeekAnimated: '0af4617a05',
    pullMonthAnimated: '0af4617a05'
  },
  segments = {
    inclusive: 29125,
    animated: 29121,
    regular: 29117
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
    title: 'Mailer'
  });
  var d = new Date();
  if (d.getHours() < 1){
    // once a day, please
    if ( d.getDay() == 1 ){
      // weekly things
      //(new Mailer).send('pullWeekAnimated', segments.animated);
      (new Mailer).send('pullWeek', segments.regular);
      //(new Mailer).send('pullWeekAnimated', segments.inclusive);
      (new Mailer).send('pullWeek', segments.inclusive);
    }
    if (d.getDate() == 1){
      // monthly things
      //(new Mailer).send('pullMonthAnimated', segments.animated);
      (new Mailer).send('pullMonth', segments.regular);
      //(new Mailer).send('pullMonthAnimated', segments.inclusive);
      (new Mailer).send('pullMonth', segments.inclusive);
      // if (d.getMonth() == 0){
      //   // yearly things
      //   (new Mailer).send('pullYearkAnimated');
      //   (new Mailer).send('pullYear');
      // }
    }
  }
};

Mailer.prototype.send = function(type, segment) {
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
      subject: ('Alleyooop this ' + type.split('pull')[1] + ' for ' + (new Date).toDateString()),
      from_email: 'coach@teamjosh.co',
      from_name: 'Team Josh',
      to_name: 'Dribbbler',
      inline_css: true
    },
    content: {
      url: ('http://alleyooop.info/play/' + type)
    },
    segment_opts: {
      saved_segment_id: segment
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
