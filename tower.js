"use strict"
function tower(shaderProgram, m4, gl){
   this.SP = shaderProgram;
   this.m4 = m4;
   this.gl = gl;
   
}
tower.prototype.drawAll = function (tCamera, tProjection){
   var tModel = this.m4.identity();
   this.buildlayer(tModel, tCamera, tProjection);
   //this.drawtrysimple(this.m4.identity(), tCamera, tProjection, 10, 10, 10);
   //this.drawCube(this.m4.identity(), tCamera, tProjection, 10, 10, 10);
}
tower.prototype.buildlayer = function(tModel, tCamera, tProjection){
   this.drawblock(tModel, tCamera, tProjection, 200, 200, 200, 'block');
   tModel = this.m4.translation([0, 200, 0]);
   this.drawcylinder(tModel, tCamera, tProjection, 200, 80);
}

tower.prototype.drawblock = function (tModel, tCamera, tProjection, ll, hh, ww, cc = 'normal'){
   this.SP.PositionAttribute = this.gl.getAttribLocation(this.SP, "vPosition");
   this.gl.enableVertexAttribArray(this.SP.PositionAttribute);

   this.SP.NormalAttribute = this.gl.getAttribLocation(this.SP, "vNormal");
   this.gl.enableVertexAttribArray(this.SP.NormalAttribute);

   this.SP.ColorAttribute = this.gl.getAttribLocation(this.SP, "vColor");
   this.gl.enableVertexAttribArray(this.SP.ColorAttribute);    

   // this gives us access to the matrix uniform
   this.SP.MVmatrix = this.gl.getUniformLocation(this.SP,"modelViewMatrix");

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
         [  1, 1, 1,  0, 0, 1,  0, 0, 1,  0, 0, 1,
         1, 0, 0,  1, 0, 0,  1, 0, 0,  1, 0, 0,
         0, 1, 0,  0, 1, 0,  0, 1, 0,  0, 1, 0,
         -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0,
         0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0,
         0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1 ]);


   // vertex colors
   if(cc == 'block'){
      var color1 = [0.6, 0.4, 0];
      var con1 = [0.6, 0.4, 0];
      var con2 = [0.3, 0.2, 1.0];

      for(var i = 1; i < 8 ; ++i)
         color1 = color1.concat(con1);
      for(var i = 8; i < 12 ; ++i)
         color1 = color1.concat(con2);
      for(var i = 12; i < 24 ; ++i)
         color1 = color1.concat(con1);
      var vertexColors = new Float32Array(color1);
   }
   else if(cc == 'normal'){
      var vertexColors = new Float32Array(
            [  0, 0, 1,   0, 0, 1,   0, 0, 1,   0, 0, 1,
            1, 0, 0,   1, 0, 0,   1, 0, 0,   1, 0, 0,
            0, 1, 0,   0, 1, 0,   0, 1, 0,   0, 1, 0,
            1, 1, 0,   1, 1, 0,   1, 1, 0,   1, 1, 0,
            1, 0, 1,   1, 0, 1,   1, 0, 1,   1, 0, 1,
            0, 1, 1,   0, 1, 1,   0, 1, 1,   0, 1, 1 ]);
   }
   else{
      var vertexColors = new Float32Array(
            [  0, 0, 1,   0, 0, 1,   0, 0, 1,   0, 0, 1,
            1, 0, 0,   1, 0, 0,   1, 0, 0,   1, 0, 0,
            0, 1, 0,   0, 1, 0,   0, 1, 0,   0, 1, 0,
            1, 1, 0,   1, 1, 0,   1, 1, 0,   1, 1, 0,
            1, 0, 1,   1, 0, 1,   1, 0, 1,   1, 0, 1,
            0, 1, 1,   0, 1, 1,   0, 1, 1,   0, 1, 1 ]);
   }
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

   // a buffer for normals
   var normalBuffer = this.gl.createBuffer();
   this.gl.bindBuffer(this.gl.ARRAY_BUFFER, normalBuffer);
   this.gl.bufferData(this.gl.ARRAY_BUFFER, vertexNormals, this.gl.STATIC_DRAW);
   normalBuffer.itemSize = 3;
   normalBuffer.numItems = 24;

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

   if(cc == 'block')
      tModel = this.m4.translation([0, h, 0]);
   var tMVP1=this.m4.multiply(this.m4.multiply(tModel,tCamera),tProjection);
   var tmodelView = this.m4.multiply(tModel, tCamera);
   var tNormal = this.m4.inverse(this.m4.transpose(tmodelView));

   this.gl.uniformMatrix4fv(this.SP.MVmatrix, false, tmodelView);

   this.gl.uniformMatrix4fv(this.SP.Nmatrix, false, tNormal);

   this.gl.uniformMatrix4fv(this.SP.Pmatrix, false, tProjection);

   this.gl.bindBuffer(this.gl.ARRAY_BUFFER, trianglePosBuffer);
   this.gl.vertexAttribPointer(this.SP.PositionAttribute, trianglePosBuffer.itemSize, this.gl.FLOAT, false, 0, 0);
   this.gl.bindBuffer(this.gl.ARRAY_BUFFER, normalBuffer);
   this.gl.vertexAttribPointer(this.SP.NormalAttribute, normalBuffer.itemSize, this.gl.FLOAT, false, 0, 0);
   this.gl.bindBuffer(this.gl.ARRAY_BUFFER, colorBuffer);
   this.gl.vertexAttribPointer(this.SP.ColorAttribute, colorBuffer.itemSize, this.gl.FLOAT,false, 0, 0);

   this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, indexBuffer);


   // Do the drawing
   this.gl.drawElements(this.gl.TRIANGLES, triangleIndices.length, this.gl.UNSIGNED_BYTE, 0);
}
//XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX

//XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX

//XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX

//XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX

//XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX

//XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX
tower.prototype.drawcylinder = function (tModel, tCamera, tProjection, h, r){
   this.SP.PositionAttribute = this.gl.getAttribLocation(this.SP, "vPosition");
   this.gl.enableVertexAttribArray(this.SP.PositionAttribute);

   this.SP.NormalAttribute = this.gl.getAttribLocation(this.SP, "vNormal");
   this.gl.enableVertexAttribArray(this.SP.NormalAttribute);

   this.SP.ColorAttribute = this.gl.getAttribLocation(this.SP, "vColor");
   this.gl.enableVertexAttribArray(this.SP.ColorAttribute);    

   // this gives us access to the matrix uniform
   this.SP.MVmatrix = this.gl.getUniformLocation(this.SP,"modelViewMatrix");

   this.SP.Nmatrix = this.gl.getUniformLocation(this.SP,"normalMatrix");

   this.SP.Pmatrix = this.gl.getUniformLocation(this.SP,"projectionMatrix");


   // Vertex Position
   // 4* 12 at side, 12 at top, 12 at bottom, 72 in total
   var verpos = 0;
   for(var i = 0; i < 12; ++i){
      var vangle1 = Math.PI / 6 * i;
      var vangle2 = Math.PI / 6 * (i+1);
      var v1z = r * Math.cos(vangle1);
      var v1x = r * Math.sin(vangle1);
      var v2z = r * Math.cos(vangle2);
      var v2x = r * Math.sin(vangle2);
      var inver = [v1x, 0, v1z,   v2x, 0, v2z,   v2x, h, v2z, v1x, h, v1z]
      if(verpos == 0)
         verpos = inver;
      else
         verpos = verpos.concat(inver);
   }
   for(var i = 0 ; i < 12 ; ++i){
      var inver = [r * Math.cos(Math.PI/6*i), 0, r * Math.sin(Math.PI/6*i)];
      verpos = verpos.concat(inver);
   }
   for(var i = 0 ; i < 12 ; ++i){
      var inver = [r * Math.cos(Math.PI/6*i), h, r * Math.sin(Math.PI/6*i)];
      verpos = verpos.concat(inver);
   }
   var vertexPos = new Float32Array(verpos);
   
   // vertex normals
   var vernor = 0;
   for(var i = 0 ; i < 12 ; ++i){
      var va1 = Math.PI / 6 * i;
      var va2 = Math.PI / 6 * (i+1);
      var v1z = Math.cos(va1);
      var v1x = Math.sin(va1);
      var v2z = Math.cos(va2);
      var v2x = Math.sin(va2);
      var inver = [v1x, 0, v1z,   v2x, 0, v2z,   v2x, 0, v2z, v1x, 0, v1z];
      if(vernor == 0)
         vernor = inver;
      else
         vernor = vernor.concat(inver);
   }
   for(var i = 0 ; i < 12 ; ++i)
      vernor = vernor.concat([0, 1, 0]);
   for(var i = 0 ; i < 12 ; ++i)
      vernor = vernor.concat([0, -1, 0]);
   var vertexNormals = new Float32Array(vernor);


   // vertex colors
   var color1 = 0;
   for(var i = 0 ; i < 12; ++i){
      var incolor = [0.15, 0.8, 0.15, 0.15, 0.8, 0.15, 0.15, 0.8, 0.15, 0.15, 0.8, 0.15];

      if(color1 == 0)color1 = incolor;
      else color1 = color1.concat(incolor);
   }
   console.log(color1.length);
   for(var i = 0 ; i < 12; ++i){
      var incolor = [0.6, 0.3, 0.5];
      color1 = color1.concat(incolor);
   }
   for(var i = 0 ; i < 12; ++i){
      var incolor = [0.6, 0.3, 0.5];
      color1 = color1.concat(incolor);
   }
   var vertexColors = new Float32Array(color1);

   console.log(color1.length);
   // element index array
   // 2 * 12 at side, 10 at top and 10 at bottom, 44 in total
   var triind = 0;
   for(var i = 0 ; i < 12; ++i){
      var intriind = [4*i, 4*i+1, 4*i+2, 4*i, 4*i+2, 4*i+3];
      if(triind == 0)
         triind = intriind;
      else 
         triind = triind.concat(intriind);
   }
   var nowin = 48;
   for(var i = 1 ; i <= 10 ; ++i){
      var intriind = [nowin, nowin+i, nowin+i+1];
      triind = triind.concat(intriind);
   }
   var nowin = 60;
   for(var i = 1 ; i <= 10 ; ++i){
      var intriind = [nowin, nowin+i, nowin+i+1];
      triind = triind.concat(intriind);
   }
   var triangleIndices = new Uint8Array(triind);

   // we need to put the vertices into a buffer so we can
   // block transfer them to the graphics hardware
   var trianglePosBuffer = this.gl.createBuffer();
   this.gl.bindBuffer(this.gl.ARRAY_BUFFER, trianglePosBuffer);
   this.gl.bufferData(this.gl.ARRAY_BUFFER, vertexPos, this.gl.STATIC_DRAW);
   trianglePosBuffer.itemSize = 3;
   trianglePosBuffer.numItems = 72;

   // a buffer for normals
   var normalBuffer = this.gl.createBuffer();
   this.gl.bindBuffer(this.gl.ARRAY_BUFFER, normalBuffer);
   this.gl.bufferData(this.gl.ARRAY_BUFFER, vertexNormals, this.gl.STATIC_DRAW);
   normalBuffer.itemSize = 3;
   normalBuffer.numItems = 72;

   // a buffer for colors
   var colorBuffer = this.gl.createBuffer();
   this.gl.bindBuffer(this.gl.ARRAY_BUFFER, colorBuffer);
   this.gl.bufferData(this.gl.ARRAY_BUFFER, vertexColors, this.gl.STATIC_DRAW);
   colorBuffer.itemSize = 3;
   colorBuffer.numItems = 72;
   // a buffer for indices
   var indexBuffer = this.gl.createBuffer();
   this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
   this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, triangleIndices, this.gl.STATIC_DRAW);  

   var tMVP1=this.m4.multiply(this.m4.multiply(tModel,tCamera),tProjection);
   var tmodelView = this.m4.multiply(tModel, tCamera);
   var tNormal = this.m4.inverse(this.m4.transpose(tmodelView));

   this.gl.uniformMatrix4fv(this.SP.MVmatrix, false, tmodelView);

   this.gl.uniformMatrix4fv(this.SP.Nmatrix, false, tNormal);

   this.gl.uniformMatrix4fv(this.SP.Pmatrix, false, tProjection);

   this.gl.bindBuffer(this.gl.ARRAY_BUFFER, trianglePosBuffer);
   this.gl.vertexAttribPointer(this.SP.PositionAttribute, trianglePosBuffer.itemSize, this.gl.FLOAT, false, 0, 0);
   this.gl.bindBuffer(this.gl.ARRAY_BUFFER, normalBuffer);
   this.gl.vertexAttribPointer(this.SP.NormalAttribute, normalBuffer.itemSize, this.gl.FLOAT, false, 0, 0);
   this.gl.bindBuffer(this.gl.ARRAY_BUFFER, colorBuffer);
   this.gl.vertexAttribPointer(this.SP.ColorAttribute, colorBuffer.itemSize, this.gl.FLOAT,false, 0, 0);

   this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, indexBuffer);


   // Do the drawing
   this.gl.drawElements(this.gl.TRIANGLES, triangleIndices.length, this.gl.UNSIGNED_BYTE, 0);
}
/*
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
   
}*/
/*
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
*/
/*
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
   
   
   //test
   tMV = this.m4.identity();
   tProjection = this.m4.identity();
   tNormal = this.m4.identity();

   //test
   
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
*/
