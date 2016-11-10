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

   var Tower = new tower(shaderProgram, m4, gl);
   var theta = Math.PI/2;
   function draw(){
      gl.clearColor(0.0, 0.0, 0.0, 1.0);
      gl.enable(gl.DEPTH_TEST);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      
      theta = theta + Math.PI/100;
      var eye = [500.0*Math.cos(theta),600.0,500.0*Math.sin(theta)];
      var target = [0,200,0];
      var up = [0,1,0];
      

      var tCamera = m4.inverse(m4.lookAt(eye,target,up));
      var tProjection = m4.perspective(Math.PI/2,1,10,10000);

      gl.useProgram(shaderProgram);


/*
      //theta = theta + Math.PI/60;
      var eye = [4, 1.5, 0];
      var target = [0, 0, 0];
      var up = [0, 1, 0];
      


      var tCamera = m4.inverse(m4.lookAt(eye, target, up));
      var tProjection = m4.perspective(Math.PI/3, 1, 10, 3000);
      // tCamera is the uniform
  */    Tower.drawAll(tCamera, tProjection);
      
      /*
      gl.useProgram(shaderProgram);
      gl.bindBuffer(gl.ARRAY_BUFFER, trianglePosBuffer);
      gl.vertexAttribPointer(posAttributeLoc, 3, gl.FLOAT, false, 0, 0);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      */
      

      window.requestAnimationFrame(draw);
   }
   draw();
}

window.onload = start
