"use strict"
function start(){
   var canvas = document.getElementById("mycanvas");
   var gl = canvas.getContext("webgl");

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

   var posAttributeLoc = gl.getAttribLocation(shaderProgram, "pos");
   gl.enableVertexAttribArray(posAttributeLoc);

   var vertexPos = [
      0.0,  1.0,  0.0,
      -1.0, -1.0, 0.0,
      1.0,  -1.0 ,0.0,
      -1.0, 0.0, 0.0,
      -0.5, 0.0, 0.0,
      -0.4, 1.0, 0.0
   ];

   var trianglePosBuffer = gl.createBuffer()
   gl.bindBuffer(gl.ARRAY_BUFFER, trianglePosBuffer);
   gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexPos), gl.STATIC_DRAW);

   var vertexPos2 = [
      0.0, 1.0, 0.0,
      1.0, 0.0, 0.0,
      1.0, 1.0, 0.0
      ];
      

   // draw function
   gl.clearColor(0.0, 0.0, 0.0, 1.0);
   gl.enable(gl.DEPTH_TEST);
   gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

   gl.useProgram(shaderProgram);
   gl.bindBuffer(gl.ARRAY_BUFFER, trianglePosBuffer);
   gl.vertexAttribPointer(posAttributeLoc, 3, gl.FLOAT, false, 0, 0);
   gl.drawArrays(gl.TRIANGLES, 0, 6);

}

window.onload = start
