var echonest = require('echonest');
var myNest = new echonest.Echonest({api_key:'17LGZZWRMA8U1UBOS' });
myNest.song.profile({	id:'SOCLJYD14405CB8AF5',
						bucket:'audio_summary'},
						function(err,res) { 
							console.log(res.songs[0].audio_summary)
						});