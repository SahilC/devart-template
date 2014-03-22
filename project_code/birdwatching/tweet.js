var twitter = require('ntwitter');
var express = require('express');
var app=express();
var twit = new twitter({
  				consumer_key: 'Nsl5LdosLzDTs5Z1UnLrpg',
  				consumer_secret: 'ZXzKvUYvcVwo4qyU3oCZf5jwFyTPV2HGy1iQNwQc6E',
  				access_token_key: '127175397-4RoXSfrOEKT8sqaH73daROgNPVydME26HfjcbRLh',
  				access_token_secret: '1eJ6FbDkoDPB5ENFJlmIeMBHudSq7MKVj1GdksveAlpJg'
  					});
app.set('views', __dirname + '/tlp');
app.set('view engine', "jade");
app.engine('jade', require('jade').__express);
app.get("/", function(req, res){
    res.render("page");
});
function sleep(seconds) 
{
  var e = new Date().getTime() + (seconds * 1000);
  while (new Date().getTime() <= e) {}
}
app.use(express.static(__dirname + '/public'));
app.use(express.favicon(__dirname + '/public/favicon.ico')); 
var io = require('socket.io').listen(app.listen(process.env.PORT || 5000));
io.sockets.on('connection', function (socket) {
   socket.on('send', function (dt) {
        twit.stream('statuses/filter', {'track':dt['message']}, function(stream) {
  		stream.on('data', function (data) {
  			try {
  			var message='<div class="tweet" style="position:relative;left:0%; height:10%; background:#ddd; border:0.5px solid rgba(100,100,100,0.1);"><img src="'+data['user']['profile_image_url']+'"/><a style="position:relative;top:-30px;text-decoration:none;color:#000;font-weight:bold" href="http://twitter.com/'+data['user']['screen_name']+'">'+data['user']['name']+'</a><span style="position:absolute;left:5%;top:30%">'+data['text']+'</span><br/><br/></div>';
  			if ( data['entities']['user_mentions'].length ){
  				for(var i in data['entities']['user_mentions']){
  					message=message.replace('@'+data['entities']['user_mentions'][i]['screen_name'],'<a style="text-decoration:none;color:#00CCFF" href="http://twitter.com/'+data['entities']['user_mentions'][i]['screen_name']+'">@'+data['entities']['user_mentions'][i]['screen_name']+'</a>');	
  				}
  			}
  			if ( data['entities']['urls'].length ) {
  				for(var i in data['entities']['urls']){
  					message=message.replace(data['entities']['urls'][i]['url'],'<a style="text-decoration:none;color:#00CCFF" href="'+data['entities']['urls'][i]['url']+'">'+data['entities']['urls'][i]['display_url']+'</a>');	
  				}
  			}
  			if ( data['entities']['hashtags'].length ) {
  				for(var i in data['entities']['hashtags']){
  					message=message.replace('#'+data['entities']['hashtags'][i]['text'],'<a style="text-decoration:none;color:#00CCFF" href="http://twitter.com/#'+data['entities']['hashtags'][i]['text']+'">#'+data['entities']['hashtags'][i]['text']+'</a>');	
  				}
  			}
  			socket.emit('message', { message:message});
        sleep(1);
  		}catch (err) { console.log(err); }
  		});
      socket.on('disconnect',function(dt){
            setTimeout(stream.destroy,0);  
      });
	   });
  });
});
