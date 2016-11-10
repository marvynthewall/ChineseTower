"use strict"
function start(){
   var canvas = document.getElementById("mycanvas");
   var gl = canvas.getContext("webgl");
   var m4 = twgl.m4;

   var vertexSource = document.getElementById("vs").text;
   var fragmentSource = document.getElementById("fs").text;

   var vertexShader = gl.createShader(gl.VERTEX_SHADER);
   gl.shaderSource(vertexShader, vertexSource);
   gl.compileShader(vertexShader);

   if(!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)){
      alert(gl.getShaderInfoLog(vertexShader));
      return null;
   }

   var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
   gl.shaderSource(fragmentShader, fragmentSource);
   gl.compileShader(fragmentShader);

   if(!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)){
      alert(gl.getShaderInfoLog(fragmentShader));
      return null;
   }

   var shaderProgram = gl.createProgram();
   gl.attachShader(shaderProgram, vertexShader);
   gl.attachShader(shaderProgram, fragmentShader);
   gl.linkProgram(shaderProgram);

   if(!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)){
      alert("Could not initialise shaders");
   }
   
   var bar1 = document.getElementById("bar1");

   var Tower = new tower(shaderProgram, m4, gl);
   var theta = Math.PI/2;
   var minh = 0;
   var maxh = 1000;
   var tick = (maxh - minh) / 100;
   var height;
   var dis = 800;
   var target = [0,300,0];
   var up = [0,1,0];
   function draw(){
      gl.clearColor(0.0, 0.0, 0.0, 1.0);
      gl.enable(gl.DEPTH_TEST);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      
      theta = theta + Math.PI/100;
      
      height = minh + bar1.value * tick;
      
      var eye = [dis*Math.cos(theta),height,dis*Math.sin(theta)];

      var tCamera = m4.inverse(m4.lookAt(eye,target,up));
      var tProjection = m4.perspective(Math.PI/2,1,10,10000);

      gl.useProgram(shaderProgram);

      Tower.drawAll(tCamera, tProjection);

      window.requestAnimationFrame(draw);
   }
   
   bar1.addEventListener("input", draw);
   draw();
}

window.onload = start
