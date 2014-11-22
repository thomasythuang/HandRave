window.plotter = new LeapDataPlotter({
	el: document.getElementById('plots')
});

var output = document.getElementById('output'),
	progress = document.getElementById('progress'),
	display = document.getElementById('main');
var audio = new Audio('sounds/bump2.wav');
var hit = false; 

Leap.loop({background: true}, function(frame){
    var hand = frame.hands[0];
    if (!hand) return;
    var height = hand.palmPosition[1];
    var velocity = hand.palmVelocity[1];
    
  	output.innerHTML = hand.grabStrength.toPrecision(2);
		progress.style.width = hand.grabStrength*100 + '%'; //hand.grabStrength * 100 + '%';

		if (height < 150 && !hit){
			hit = true;
			bump(hit);
		}else if(height > 150 && hit){
			hit = false;
			bump(hit);
		}

    // call this once per frame per plot
    plotter.plot('height', height, {
      precision: 3,
      units: 'mm'
    });

    plotter.plot('y velocity', velocity, {
      precision: 4,
      units: 'mm/s'
    });

    // call this once per frame
    plotter.update()
  });

function bump(hit){
	if (hit){
		display.style.backgroundColor = "#333333";
		audio.play();
	}else{
		display.style.backgroundColor = "#ffffff";
	}
}

// Adds the rigged hand plugin to the controller
visualizeHand = function(controller){

  controller.use('playback').on('riggedHand.meshAdded', function(handMesh, leapHand){
	  handMesh.material.opacity = 0.8;
  });
  
  var overlay = controller.plugins.playback.player.overlay;
  overlay.style.right = 0;
  overlay.style.left = 'auto';
  overlay.style.top = 'auto';
  overlay.style.padding = 0;
  overlay.style.bottom = '13px';
  overlay.style.width = '180px';


  controller.use('riggedHand', { 
		scale: 1.3,
		boneColors: function (boneMesh, leapHand){
		  if (boneMesh.name.indexOf('Finger_') == 0){
				return {
				  hue: 0.75,
				  saturation: leapHand.grabStrength,
				  lightness: 0.5
				}
		  } 
		} 
  });
  
  var camera = controller.plugins.riggedHand.camera;  
  camera.position.set(0,20,-25);
  camera.lookAt(new THREE.Vector3(0,3,0));
};
visualizeHand(Leap.loopController);
