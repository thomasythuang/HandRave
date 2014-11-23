SC.initialize({
  client_id: '42913cd5bdf32a8069290ef75157ca08'
});
/*
var track_url = 'http://soundcloud.com/forss/flickermood';
SC.oEmbed(track_url, { auto_play: true }, function(oEmbed) {
  console.log('oEmbed response: ' + oEmbed);
}); */
SC.stream("/tracks/293", function(sound){
  sound.play();
});