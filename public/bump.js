window.plotter = new LeapDataPlotter({
	el: document.getElementById('plots')
});

var output = document.getElementById('output'),
	progress = document.getElementById('progress'),
	display = document.getElementById('main');
var down, left;
var hit1 = false, hit2 = false; 
var posX1, posX2;
var ready1x = false, ready1y = false, ready2x = false, ready2y = false;
var colors = ["FF2E74", "60FF52", "1A1AD9", "ED1127", "24F0E6", "FF7226", "F2E533", ]
var colorsOn;

var app = angular.module('HandRave', ['ui.bootstrap',]);
app.controller('mainController', function($scope){
  $scope.sounds = [
    {name: 'kick1', link: 'resources/sounds/bump1.wav'},
    {name: 'kick2', link: 'resources/sounds/bump2.wav'},
    {name: 'hihat1', link: 'resources/sounds/hihat1.wav'},
  ]
  $scope.down = $scope.sounds[1];
  $scope.left = $scope.sounds[2];
  $scope.colorsOn = true;
  
  $scope.$watch('down', function(){
    if (!$scope.down) 
      down = null;
    else
      down = new Audio($scope.down.link);
  });
  $scope.$watch('left', function(){
    if (!$scope.left)
      left = null;
    else
      left = new Audio($scope.left.link);
  })
  $scope.$watch('colorsOn', function(){
    colorsOn = $scope.colorsOn;
  })
  
});

Leap.loop({background: true}, function(frame){
    var hand1 = frame.hands[0];
    var hand2 = frame.hands[1];
    if (!hand1 && !hand2) return;

    /* 
    if (hand1 && hand2 && hand2.palmPosition[0] > hand1.palmPosition[0]){
      var temp = hand1;
      hand1 = hand2;
      hand2 = temp;
    } */

    if (hand1){
      var x1 = hand1.palmPosition[0];
      var y1 = hand1.palmPosition[1];
      var v1x = hand1.palmVelocity[0];
      var v1y = hand1.palmVelocity[1];

      if (v1y < -700 && ready1y){
        if (hand1.grabStrength > 0.9)
          bump(true, true);
        else
          bump(true);
        ready1y = false;
      }else if (v1y > 0){
        bump(false);
        ready1y = true;
      }

      if (posX1 == undefined){
        if (x1 >= 0)
          posX1 = true;
        else
          posX1 = false;
      }

      if (v1x < -700 && ready1x){
        swipe();
        ready1x = false;
      }else if (v1x > 0){
        ready1x = true;
      }

      // call this once per frame per plot
      plotter.plot('height 1', y1, {
        precision: 3,
        units: 'mm'
      });

      plotter.plot('x velocity 1', v1x, {
        precision: 4,
        units: 'mm/s'
      }); 

      plotter.plot('y velocity 1', v1y, {
        precision: 4,
        units: 'mm/s'
      });
    }
    if (hand2){
      var x2 = hand2.palmPosition[0];
      var y2 = hand2.palmPosition[1];
      var v2x = hand2.palmVelocity[0];
      var v2y = hand2.palmVelocity[1];

      if (v2y < -700 && ready2y){
        if (hand2.grabStrength > 0.9)
          bump(true, true);
        else
          bump(true);
        ready2y = false;
      }else if (v2y > 0){
        bump(false);
        ready2y = true;
      }

      if (posX2 == undefined){
        if (x2 >= 0)
          posX2 = true;
        else
          posX2 = false;
      }

      if (v2x < -700 && ready2x){
        swipe();
        ready2x = false;
      }else if (v2x > 0){
        ready2x = true;
      }

      // call this once per frame per plot
      plotter.plot('height 2', y2, {
        precision: 3,
        units: 'mm'
      });

      plotter.plot('y velocity 2', v2y, {
        precision: 4,
        units: 'mm/s'
      });

      plotter.plot('y velocity 2', v2y, {
        precision: 4,
        units: 'mm/s'
      });
    }

    // call this once per frame
    plotter.update()
  });

function swipe(){
  if (!left) return;
  left.volume = 0.5;
  left.play();
}

function bump(hit, AMPED){
  if (!down) return;
  if (AMPED){
    if (colorsOn)
      display.style.backgroundColor = "#bb0000";
    down.volume = 1.0;
    down.play();
  }else if (hit){
    if (colorsOn)
		  display.style.backgroundColor = randomColor();
    down.volume = 0.5;
		down.play();
	}else{
		display.style.backgroundColor = "#ededed";
	}
}

function randomColor(){
  return colors[Math.floor(Math.random()*colors.length)];
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
