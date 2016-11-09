"use strict"
function tower(shaderProgram, m4, gl){
   this.SP = shaderProgram;
   this.m4 = m4;
   this.gl = gl;
   
}
tower.prototype.drawAll = function (tCamera, tProjection){
   var tModel = this.m4.identity();
   this.inter(tModel, tCamera, tProjection, 200, 200, 200);
   //this.drawtrysimple(this.m4.identity(), tCamera, tProjection, 10, 10, 10);
   //this.drawCube(this.m4.identity(), tCamera, tProjection, 10, 10, 10);
}
tower.prototype.inter = function (tModel, tCamera, tProjection, ll, hh, ww){
   var NNN = 0;
   
   this.SP.PositionAttribute = this.gl.getAttribLocation(this.SP, "vPosition");
   this.gl.enableVertexAttribArray(this.SP.PositionAttribute);
   
   if(NNN == 1){
      this.SP.NormalAttribute = this.gl.getAttribLocation(this.SP, "vNormal");
      this.gl.enableVertexAttribArray(this.SP.NormalAttribute);
   }

   this.SP.ColorAttribute = this.gl.getAttribLocation(this.SP, "vColor");
   this.gl.enableVertexAttribArray(this.SP.ColorAttribute);    

   // this gives us access to the matrix uniform
   this.SP.MVmatrix = this.gl.getUniformLocation(this.SP,"modelViewMatrix");

   if(NNN == 1)
      this.SP.Nmatrix = this.gl.getUniformLocation(this.SP,"normalMatrix");

   this.SP.Pmatrix = this.gl.getUniformLocation(this.SP,"projectionMatrix");

   // Data ...
   var l = ll/2;
   var h = hh/2;
   var w = ww/2;

   // vertex positions
   var vertexPos = new Float32Array(
         [  l, h, w,  -l, h, w,  -l,-h, w,   l,-h, w,
         l, h, w,   l,-h, w,   l,-h,-w,   l, h,-w,
         l, h, w,   l, h,-w,  -l, h,-w,  -l, h, w,
         -l, h, w,  -l, h,-w,  -l,-h,-w,  -l,-h, w,
         -l,-h,-w,   l,-h,-w,   l,-h, w,  -l,-h, w,
         l,-h,-w,  -l,-h,-w,  -l, h,-w,   l, h,-w ]);

   var vertexNormals = new Float32Array(
         [  0, 0, 1,  0, 0, 1,  0, 0, 1,  0, 0, 1,
            1, 0, 0,  1, 0, 0,  1, 0, 0,  1, 0, 0,
            0, 1, 0,  0, 1, 0,  0, 1, 0,  0, 1, 0,
            -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0,
            0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0,
            0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1 ]);


   // vertex colors
   var color1 = [0.6, 0.4, 0];
   var con = [0.6, 0.4, 0];
   for(var i = 0; i < 24 ; ++i){
      console.log(i);
      console.log(color1);
      color1.concat(con);
   }

   var vertexColors = new Float32Array(
      [  0.6, 0.4, 0,   0, 1, 0,   0, 0, 1,   0, 0, 1,
         1, 0, 0,   1, 0, 0,   1, 0, 0,   1, 0, 0,
         0, 1, 0,   0, 1, 0,   0, 1, 0,   0, 1, 0,
         1, 1, 0,   1, 1, 0,   1, 1, 0,   1, 1, 0,
         1, 0, 1,   1, 0, 1,   1, 0, 1,   1, 0, 1,
         0, 1, 1,   0, 1, 1,   0, 1, 1,   0, 1, 1 ]);

   // element index array
   var triangleIndices = new Uint8Array(
         [  0, 1, 2,   0, 2, 3,    // front
         4, 5, 6,   4, 6, 7,    // right
         8, 9,10,   8,10,11,    // top
         12,13,14,  12,14,15,    // left
         16,17,18,  16,18,19,    // bottom
         20,21,22,  20,22,23 ]); // back
   // we need to put the vertices into a buffer so we can
   // block transfer them to the graphics hardware
   var trianglePosBuffer = this.gl.createBuffer();
   this.gl.bindBuffer(this.gl.ARRAY_BUFFER, trianglePosBuffer);
   this.gl.bufferData(this.gl.ARRAY_BUFFER, vertexPos, this.gl.STATIC_DRAW);
   trianglePosBuffer.itemSize = 3;
   trianglePosBuffer.numItems = 24;

   if(NNN == 1){
   // a buffer for normals
   var normalBuffer = this.gl.createBuffer();
   this.gl.bindBuffer(this.gl.ARRAY_BUFFER, normalBuffer);
   this.gl.bufferData(this.gl.ARRAY_BUFFER, vertexNormals, this.gl.STATIC_DRAW);
   normalBuffer.itemSize = 3;
   normalBuffer.numItems = 24;
   }

   // a buffer for colors
   var colorBuffer = this.gl.createBuffer();
   this.gl.bindBuffer(this.gl.ARRAY_BUFFER, colorBuffer);
   this.gl.bufferData(this.gl.ARRAY_BUFFER, vertexColors, this.gl.STATIC_DRAW);
   colorBuffer.itemSize = 3;
   colorBuffer.numItems = 24;
   // a buffer for indices
   var indexBuffer = this.gl.createBuffer();
   this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
   this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, triangleIndices, this.gl.STATIC_DRAW);  


   var tMVP1=this.m4.multiply(this.m4.multiply(tModel,tCamera),tProjection);
   var tmodelView = this.m4.multiply(tModel, tCamera);
   var tNormal = this.m4.inverse(this.m4.transpose(tmodelView));

   this.gl.uniformMatrix4fv(this.SP.MVmatrix, false, tmodelView);

  // this.gl.uniformMatrix4fv(this.SP.NMatrix, false, tNormal);

   this.gl.uniformMatrix4fv(this.SP.Pmatrix, false, tProjection);

   this.gl.bindBuffer(this.gl.ARRAY_BUFFER, trianglePosBuffer);
   this.gl.vertexAttribPointer(this.SP.PositionAttribute, trianglePosBuffer.itemSize, this.gl.FLOAT, false, 0, 0);
   if(NNN == 1){
   this.gl.bindBuffer(this.gl.ARRAY_BUFFER, normalBuffer);
   this.gl.vertexAttribPointer(this.SP.PositionAttribute, normalBuffer.itemSize, this.gl.FLOAT, false, 0, 0);
   }
   this.gl.bindBuffer(this.gl.ARRAY_BUFFER, colorBuffer);
   this.gl.vertexAttribPointer(this.SP.ColorAttribute, colorBuffer.itemSize, this.gl.FLOAT,false, 0, 0);

   this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, indexBuffer);


   // Do the drawing
   this.gl.drawElements(this.gl.TRIANGLES, triangleIndices.length, this.gl.UNSIGNED_BYTE, 0);
}

tower.prototype.drawCube = function (tModel, tCamera, tProjection, hh, ll, ww){
   var h = hh / 2;
   var l = ll / 2;
   var w = ww / 2;

   var point = new Float32Array([
         l, h, w,    l, h, -w,   -l, h, -w,  -l, h, w,
         l, h, w,    l, -h, w,   l, -h, -w,  l, h, -w,
         l, h, -w,   l, -h, -w,  -l, -h, -w, -l, h, -w,
         -l, h, -w,  -l, -h, -w, -l, -h, w,  -l, h, w,
         -l, h, w,   -l, -h, w,  l, -h, w,   l, h, w,
         l, -h, w,   -l, -h, w,  -l, -h, -w, l, -h, -w
         ]);
   console.log(point);
   var normal = new Float32Array([
         0, 1, 0,    0, 1, 0,    0, 1, 0,    0, 1, 0,
         1, 0, 0,    1, 0, 0,    1, 0, 0,    1, 0, 0,
         0, 0, -1,   0, 0, -1,   0, 0, -1,   0, 0, -1,
         -1, 0, 0,   -1, 0, 0,   -1, 0, 0,   -1, 0, 0,
         0, 0, 1,    0, 0, 1,    0, 0, 1,    0, 0, 1,
         0, -1, 0,   0, -1, 0,   0, -1, 0,   0, -1, 0
         ]);
   var color = new Float32Array([
      1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0,
      1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0,
      1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0,
      1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
         ]);
   var index = new Uint8Array([
      0, 1, 2, 0, 2, 3,
      4, 5, 6, 4, 6, 7,
      8, 9, 10, 8, 10, 11,
      12, 13, 14, 12, 14, 15,
      16, 17, 18, 16, 18, 19,
      20, 21, 22, 20, 22, 23
         ]);
   var positionBuffer = this.gl.createBuffer();
   this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);
   this.gl.bufferData(this.gl.ARRAY_BUFFER, point, this.gl.STATIC_DRAW);
   positionBuffer.itemSize = 3;
   positionBuffer.numItems = 24;

   var normalBuffer = this.gl.createBuffer();
   this.gl.bindBuffer(this.gl.ARRAY_BUFFER, normalBuffer);
   this.gl.bufferData(this.gl.ARRAY_BUFFER, normal, this.gl.STATIC_DRAW);
   normalBuffer.itemSize = 3;
   normalBuffer.numItems = 24;


   var colorBuffer = this.gl.createBuffer();
   this.gl.bindBuffer(this.gl.ARRAY_BUFFER, colorBuffer);
   this.gl.bufferData(this.gl.ARRAY_BUFFER, color, this.gl.STATIC_DRAW);
   colorBuffer.itemSize = 3;
   colorBuffer.numItems = 24;

   var indexBuffer = this.gl.createBuffer();
   this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
   this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, index, this.gl.STATIC_DRAW);    
   
   var tMV = this.m4.multiply(tModel, tCamera);//ModelViewMatrix
   var tNormal = this.m4.inverse(this.m4.transpose(tMV));

   this.SP.modelViewMatrix = this.gl.getUniformLocation(this.SP, "modelViewMatrix"); 
   this.gl.uniformMatrix4fv(this.SP.modelViewMatrix,false,tMV);
   
   this.SP.normalMatrix = this.gl.getUniformLocation(this.SP, "normalMatrix");
   this.gl.uniformMatrix4fv(this.SP.modelViewMatrix,false,tNormal);
   this.SP.projectionMatrix = this.gl.getUniformLocation(this.SP, "projectionMatrix");
   this.gl.uniformMatrix4fv(this.SP.projectionMatrix, false, tProjection);


   this.SP.PositionAttribute = this.gl.getAttribLocation(this.SP, "vPos");
   this.gl.enableVertexAttribArray(this.SP.PositionAttribute);

   this.SP.NormalAttribute = this.gl.getAttribLocation(this.SP, "vNormal");
   this.gl.enableVertexAttribArray(this.SP.NormalAttribute);
   
   this.SP.ColorAttribute = this.gl.getAttribLocation(this.SP, "vColor");
   this.gl.enableVertexAttribArray(this.SP.ColorAttribute);


   this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);
   this.gl.vertexAttribPointer(this.SP.PositionAttribute, positionBuffer.itemSize, this.gl.FLOAT, false, 0, 0);
   this.gl.bindBuffer(this.gl.ARRAY_BUFFER, normalBuffer);
   this.gl.vertexAttribPointer(this.SP.NormalAttribute, normalBuffer.itemSize, this.gl.FLOAT, false, 0, 0);
   this.gl.bindBuffer(this.gl.ARRAY_BUFFER, colorBuffer);
   this.gl.vertexAttribPointer(this.SP.ColorAttribute, colorBuffer.itemSize, this.gl.FLOAT,false, 0, 0);

   this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

   // Do the drawing
   this.gl.drawElements(this.gl.TRIANGLES, index.length, this.gl.UNSIGNED_BYTE, 0);
   
}
tower.prototype.drawtrysimple = function(tModel, tCamera, tProjection, hh, ll, ww){
   var point = new Float32Array([
         0, 0.5, 0,    0.5, 0.5, 0,   0, 0.5, 0.5
         ]);
   var index = new Uint8Array([
      0, 1, 2
         ]);
   
   var positionBuffer = this.gl.createBuffer();
   this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);
   this.gl.bufferData(this.gl.ARRAY_BUFFER, point, this.gl.STATIC_DRAW);
   positionBuffer.itemSize = 3;
   positionBuffer.numItems = 3;

   var indexBuffer = this.gl.createBuffer();
   this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
   this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, index, this.gl.STATIC_DRAW);    
   indexBuffer.itemSize = 1;
   indexBuffer.numItems = 3;

   this.SP.modelViewMatrix = this.gl.getUniformLocation(this.SP, "modelViewMatrix"); 
   this.gl.uniformMatrix4fv(this.SP.modelViewMatrix,false,this.m4.identity());

   this.SP.PositionAttribute = this.gl.getAttribLocation(this.SP, "vPos");
   this.gl.enableVertexAttribArray(this.SP.PositionAttribute);

   this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);
   this.gl.vertexAttribPointer(this.SP.PositionAttribute, positionBuffer.itemSize, this.gl.FLOAT, false, 0, 0);
   this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
   
   // Do the drawing
   this.gl.drawElements(this.gl.TRIANGLES, index.length, this.gl.UNSIGNED_BYTE, 0);
}

tower.prototype.drawtry = function (tModel, tCamera, tProjection, hh, ll, ww){
   var h = hh / 2;
   var l = ll / 2;
   var w = ww / 2;

   var point = new Float32Array([
         0, 0.5, 0,    0.5, 0.5, 0,   0, 0.5, 0.5
         ]);
   var normal = new Float32Array([
         0, 1, 0,    0, 1, 0,    0, 1, 0
         ]);
   var color = new Float32Array([
      1, 0, 0, 0, 1, 0, 0, 0, 1
         ]);
   var index = new Uint8Array([
      0, 1, 2
         ]);
   var positionBuffer = this.gl.createBuffer();
   this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);
   this.gl.bufferData(this.gl.ARRAY_BUFFER, point, this.gl.STATIC_DRAW);
   positionBuffer.itemSize = 3;
   positionBuffer.numItems = 3;

   var normalBuffer = this.gl.createBuffer();
   this.gl.bindBuffer(this.gl.ARRAY_BUFFER, normalBuffer);
   this.gl.bufferData(this.gl.ARRAY_BUFFER, normal, this.gl.STATIC_DRAW);
   normalBuffer.itemSize = 3;
   normalBuffer.numItems = 3;


   var colorBuffer = this.gl.createBuffer();
   this.gl.bindBuffer(this.gl.ARRAY_BUFFER, colorBuffer);
   this.gl.bufferData(this.gl.ARRAY_BUFFER, color, this.gl.STATIC_DRAW);
   colorBuffer.itemSize = 3;
   colorBuffer.numItems = 3;

   var indexBuffer = this.gl.createBuffer();
   this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
   this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, index, this.gl.STATIC_DRAW);    
   indexBuffer.itemSize = 1;
   indexBuffer.numItems = 3;

   var tMV = this.m4.multiply(tModel, tCamera);//ModelViewMatrix
   var tNormal = this.m4.inverse(this.m4.transpose(tMV));
   var tttt = this.m4.multiply(tMV, tProjection);
   var vv1 = this.m4.transformPoint(tttt, [0, 1, 0]);
   var vv2 = this.m4.transformPoint(tttt, [1, 1, 0]);
   var vv3 = this.m4.transformPoint(tttt, [0, 1, 1]);
   //console.log(vv1);
   //console.log(vv2);
   //console.log(vv3);
   
   /*
   //test
   tMV = this.m4.identity();
   tProjection = this.m4.identity();
   tNormal = this.m4.identity();

   //test*/
   
   this.SP.modelViewMatrix = this.gl.getUniformLocation(this.SP, "modelViewMatrix"); 
   this.gl.uniformMatrix4fv(this.SP.modelViewMatrix,false,tMV);
   this.SP.normalMatrix = this.gl.getUniformLocation(this.SP, "normalMatrix");
   this.gl.uniformMatrix4fv(this.SP.modelViewMatrix,false,tNormal);
   this.SP.projectionMatrix = this.gl.getUniformLocation(this.SP, "projectionMatrix");
   this.gl.uniformMatrix4fv(this.SP.projectionMatrix, false, tProjection);


   this.SP.PositionAttribute = this.gl.getAttribLocation(this.SP, "vPos");
   this.gl.enableVertexAttribArray(this.SP.PositionAttribute);

   this.SP.NormalAttribute = this.gl.getAttribLocation(this.SP, "vNormal");
   this.gl.enableVertexAttribArray(this.SP.NormalAttribute);
   
   this.SP.ColorAttribute = this.gl.getAttribLocation(this.SP, "vColor");
   this.gl.enableVertexAttribArray(this.SP.ColorAttribute);


   this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);
   this.gl.vertexAttribPointer(this.SP.PositionAttribute, positionBuffer.itemSize, this.gl.FLOAT, false, 0, 0);
   this.gl.bindBuffer(this.gl.ARRAY_BUFFER, normalBuffer);
   this.gl.vertexAttribPointer(this.SP.NormalAttribute, normalBuffer.itemSize, this.gl.FLOAT, false, 0, 0);
   this.gl.bindBuffer(this.gl.ARRAY_BUFFER, colorBuffer);
   this.gl.vertexAttribPointer(this.SP.ColorAttribute, colorBuffer.itemSize, this.gl.FLOAT,false, 0, 0);

   this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
   
   // Do the drawing
   this.gl.drawElements(this.gl.TRIANGLES, index.length, this.gl.UNSIGNED_BYTE, 0);
   
}

tower.prototype.drawDodecagonalPrism = function (){
   
}
