'use strict';

// From http://www.drupalden.co.uk/get-values-from-url-query-string-jquery
// Read a page's GET URL variables and return them as an associative array.
function getUrlVars() {
  var vars = [],
    hash;
  var hashes = window.location.href.slice(
      window.location.href.indexOf('?') + 1)
    .split('&');
  for (var i = 0; i < hashes.length; i++) {
    hash = hashes[i].split('=');
    vars.push(hash[0]);
    vars[hash[0]] = hash[1];
  }
  return vars;
}

(function (document, window, THREE) {
  // Moussaka Javascript Client Example
  // Manipulate a 3D scene

  var ExampleGame = function (opts) {

    this.client = new window.MoussakaClient(opts);
    this.rotateSpeed = this.client.registerVar('rotateSpeed', 0.05);

  };

  ExampleGame.prototype.startGame = function () {
    // Taken directly from:
    // http://threejs.org/docs/index.html#Manual/Introduction/Creating_a_scene

    var canvasEl = document.querySelector('div#renderer');

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75,
      canvasEl.offsetWidth / canvasEl.offsetWidth, 0.1, 1000);

    this.renderer = new THREE.WebGLRenderer();

    this.renderer.setSize(canvasEl.offsetWidth, canvasEl.offsetWidth);
    canvasEl.appendChild(this.renderer.domElement);

    var geometry = new THREE.BoxGeometry(1, 1, 1);
    var material = new THREE.MeshBasicMaterial({
      color: 0x00ff00
    });
    this.cube = new THREE.Mesh(geometry, material);
    this.scene.add(this.cube);

    this.camera.position.z = 5;

    // Initial Render
    this.render();
  };

  ExampleGame.prototype.render = function () {
    window.requestAnimationFrame(this.render.bind(this));
    this.renderer.render(this.scene, this.camera);
    this.cube.rotation.x += this.rotateSpeed.value;
    this.cube.rotation.y += this.rotateSpeed.value;
  };

  ExampleGame.prototype.loadFormFromQueryVars = function () {
    var urlVars = getUrlVars();
    this.client.deviceName = $('#txtDeviceName')
      .val(urlVars.deviceName || 'Test Device');
    this.client.apiKey = $('#txtApiKey')
      .val(urlVars.apiKey || '');
    this.client.projectId = $('#txtProjectId')
      .val(urlVars.projectId || '');
    this.client.projectVersion = $('#txtProjectVersion')
      .val(urlVars.projectVersion || '');

    this.client.serverUrl = $('#txtServerUrl')
      .val(urlVars.serverUrl || 'http://localhost:3000/');
    this.client.pollInterval = $('#txtPollInterval')
      .val(urlVars.pollInterval || 1000);


  };

  ExampleGame.prototype.tryConnect = function () {
    this.client.deviceName = $('#txtDeviceName').val();
    this.client.apiKey = $('#txtApiKey').val();
    this.client.projectId = $('#txtProjectId').val();
    this.client.projectVersion = $('#txtProjectVersion').val();

    this.client.serverUrl = $('#txtServerUrl').val();
    this.client.pollInterval = $('#txtPollInterval').val();

    this.client.connect();
  };


  var exampleGame = new ExampleGame({
    deviceName: 'Moussaka Client Example',
    apiKey: 'xxxx-xxxx-xxxx-xxxx-xxxx',
    projectId: 'xxxx-xxxx-xxxx-xxxx-xxxx',
    projectVersion: 'v1'
  });

  exampleGame.loadFormFromQueryVars();


  exampleGame.client.on('error', function (err) {
    var errorHeadingEl = $('div#errorbox > h5');
    errorHeadingEl.removeClass('hidden');
    var errorEl = $('div#errorbox > p');
    errorEl.text(err.message);
  });

  exampleGame.startGame();

  window.exampleGame = exampleGame;

})(document, window, THREE);


// Thanks http://uniondesign.ca/simple-accordion-without-jquery-ui/

$(document)
  .ready(function ($) {
    $('div.container')
      .find('.accordion-toggle')
      .click(function () {

        $(this)
          .toggleClass('toggled');
        //Expand or collapse this panel
        $(this)
          .nextUntil('.accordion-content')
          .next()
          .slideToggle('fast');

      });
  });
