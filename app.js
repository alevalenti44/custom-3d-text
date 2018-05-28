$(function() {
  //Makes window responsive
    window.addEventListener( 'resize', onWindowResize, false );

    function onWindowResize() {

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize( window.innerWidth, window.innerHeight );

    }

  //Global variables/Basics
  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000,
  );
  // Camera Position
  camera.position.y = 100;
  camera.position.z = 100;
  camera.position.x = 100;

  var renderer = new THREE.WebGLRenderer();
  renderer.shadowMapEnabled = true;
  renderer.shadowMapSoft = true;
  renderer.setClearColor(0x000000);
  renderer.setSize(window.innerWidth, window.innerHeight);

  //Adds FPS stat counter bookmarklet
  (function() {
    var script = document.createElement('script');
    script.onload = function() {
      var stats = new Stats();
      document.body.appendChild(stats.dom);
      requestAnimationFrame(function loop() {
        stats.update();
        requestAnimationFrame(loop);
      });
    };
    script.src = '//rawgit.com/mrdoob/stats.js/master/build/stats.min.js';
    document.head.appendChild(script);
  })();

  //adds lights
  var light = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
  scene.add(light);

  var displayGui = function() {
    var gui = new dat.GUI();
    //Declares all the parameters in our GUI
    var parameters = {
      color: '#1861b3',
      message: '',
      delete: function() { deleteText() },
    };
    var loader = new THREE.FontLoader();
    var myFont;
    loader.load('fonts/OpenSansBold.json', function(font) {
      myFont = font;
      //your gui is not ready until the font comes instantiate it here
      var myText = textFolder.add(parameters, 'message').name('Text');
      myText.onChange(function() {
        //adds text
        var loader = new THREE.FontLoader();
        console.log(parameters.message);
        var textGeo = new THREE.TextGeometry(parameters.message, {
          font: font,
          size: 200,
          height: 50,
          curveSegments: 12,
          position: 3,
          bevelThickness: 2,
          bevelSize: 5,
          bevelEnabled: true,
        });

        var textMaterial = new THREE.MeshPhongMaterial({ color: 0x1861b3 });

        var myText = new THREE.Mesh(textGeo, textMaterial);
        myText.position.set(100, 100, 100);
        console.log("this is the meshed text",myText);
        scene.add(myText);

        //Listens to new value on dat gui color section
        textColor.onChange(function(
          value, // onFinishChange
        ) {
          console.log(parameters.color);
          myText.material.color.setHex(value.replace('#', '0x'));
        });
      });
        console.log("scene when text is included",scene);
        //last bracket before font loader end
    });

    //makes text control folder
      var textFolder = gui.addFolder("Edit Text");
      //New Color Control
      var textColor = textFolder.addColor(parameters, 'color').name('Color').listen();

    //Gui is open when website load
    gui.open();
    textFolder.add( parameters, 'delete' ).name("Delete Last Character");

    /*
    //Adds motion controls
    var motionFolder = gui.addFolder("Motion Controls");
    motionFolder.add(parameters,)
    */
  };
  displayGui();

    function deleteText(){
        var textArray = scene.children;
        console.log("this is textArray",textArray);
        var lastTextAdded = textArray[textArray.length-1];
        if(lastTextAdded instanceof THREE.Mesh){
            scene.remove(lastTextAdded);
        }
    }

  //adds orbit controls
  var controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.addEventListener('change', render);

  //Renders the scene
  render();
  function render() {
    requestAnimationFrame(render);
    renderer.render(scene, camera);
  }

  renderer.render(scene, camera);
  $('#webGL-container').append(renderer.domElement);
  //Last Brackets before app end
});
