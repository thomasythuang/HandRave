SC.initialize({
  client_id: '42913cd5bdf32a8069290ef75157ca08'
});

var widget = document.getElementById('widget');

var track_url = 'https://soundcloud.com/steveaoki/steve-aoki-chris-lake-tujamo-delirious-boneless-feat-kid-ink';
//var track_url = 'https://soundcloud.com/dodgeandfuski/dodge-fuski-call-my-name';

SC.oEmbed(track_url, { auto_play: true }, function(oEmbed) {
  //console.log('oEmbed response: ' + oEmbed);
  //console.log(oEmbed);
  widget.innerHTML = oEmbed.html;
}); 
