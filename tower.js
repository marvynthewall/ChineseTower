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
   var l = 400;
   var h = 250;
   var w = l;
   var axisX = [1, 0, 0];
   var axisY = [0, 1, 0];
   var axisZ = [0, 0, 1];
   
   // roofside
   var tiltangle = Math.PI/5;
   var rfx1 = 0.76 * l / 2;
   var rfx2 = 1.36 * l / 2;
   var rfy = 5;
   var rfz1 = -0.15 * l;
   var rfz2 = 0.22 * l;
   var roofcylindercolor = 'roof';
   
   // corner support
   var tiltcorner = Math.PI * 0.65;
   var ccy1 = l * 0.3;
   var cornerL = 240;
   var cornerR = 20;

   var trotateY45 = this.m4.axisRotation(axisY, Math.PI/4);
   var trotateY90 = this.m4.axisRotation(axisY, Math.PI/2);



   this.drawblock(tModel, tCamera, tProjection, l, h, w, 'block');
   tModel = this.m4.translation([0, h, 0]);
   //this.drawcylinder(tModel, tCamera, tProjection, 200, 80, roofcylindercolor);
   var tNow = tModel;
   var tedge = this.m4.translation([0, 0, w/2]);
   var tilt = this.m4.axisRotation(axisX, tiltangle);

   tModel = this.m4.multiply(tilt, this.m4.multiply(tedge, tNow));
   this.drawroofside(tModel, tCamera, tProjection, rfx1, rfx2, rfy, rfz1, rfz2);
   tNow = this.m4.multiply(trotateY90, tNow);
   tModel = this.m4.multiply(tilt, this.m4.multiply(tedge, tNow));
   this.drawroofside(tModel, tCamera, tProjection, rfx1, rfx2, rfy, rfz1, rfz2);
   tNow = this.m4.multiply(trotateY90, tNow);
   tModel = this.m4.multiply(tilt, this.m4.multiply(tedge, tNow));
   this.drawroofside(tModel, tCamera, tProjection, rfx1, rfx2, rfy, rfz1, rfz2);
   tNow = this.m4.multiply(trotateY90, tNow);
   tModel = this.m4.multiply(tilt, this.m4.multiply(tedge, tNow));
   this.drawroofside(tModel, tCamera, tProjection, rfx1, rfx2, rfy, rfz1, rfz2);
   tNow = this.m4.multiply(trotateY90, tNow);
   
   // tNow is at the roof center
   
   var tCorner = this.m4.translation([l/2, 0, w/2]);
   var tCornertilt = this.m4.axisRotation(axisX, tiltcorner);
   var tCornerback = this.m4.translation([0, -ccy1, 0]);
   var tToCorner = this.m4.multiply(tCornerback, this.m4.multiply(tCornertilt, this.m4.multiply(trotateY45, tCorner)));
   
   tModel = this.m4.multiply(tToCorner, tNow);
   this.drawcylinder(tModel, tCamera, tProjection, cornerL, cornerR, roofcylindercolor);
   tNow = this.m4.multiply(trotateY90, tNow);
   tModel = this.m4.multiply(tToCorner, tNow);
   this.drawcylinder(tModel, tCamera, tProjection, cornerL, cornerR, roofcylindercolor);
   tNow = this.m4.multiply(trotateY90, tNow);
   tModel = this.m4.multiply(tToCorner, tNow);
   this.drawcylinder(tModel, tCamera, tProjection, cornerL, cornerR, roofcylindercolor);
   tNow = this.m4.multiply(trotateY90, tNow);
   tModel = this.m4.multiply(tToCorner, tNow);
   this.drawcylinder(tModel, tCamera, tProjection, cornerL, cornerR, roofcylindercolor);
   tNow = this.m4.multiply(trotateY90, tNow);
}


tower.prototype.drawblock = function (tModel, tCamera, tProjection, ll, hh, ww, cc = 'original'){
   this.setupdraw();
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
   else if(cc == 'original'){
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
tower.prototype.drawcylinder = function (tModel, tCamera, tProjection, h, r, index = 'original'){
   this.setupdraw();

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
   if(index=='original'){
      var color1 = 0;
      for(var i = 0 ; i < 12; ++i){
         var incolor = [0.15, 0.8, 0.15, 0.15, 0.8, 0.15, 0.15, 0.8, 0.15, 0.15, 0.8, 0.15];

         if(color1 == 0)color1 = incolor;
         else color1 = color1.concat(incolor);
      }
      for(var i = 0 ; i < 12; ++i){
         var incolor = [0.6, 0.3, 0.5];
         color1 = color1.concat(incolor);
      }
      for(var i = 0 ; i < 12; ++i){
         var incolor = [0.6, 0.3, 0.5];
         color1 = color1.concat(incolor);
      }
      var vertexColors = new Float32Array(color1);
   }
   else if(index == 'roof'){
      var color1 = [0.4, 0.2, 0.1];
      var con = [0.4, 0.2, 0.1];
      for(var i = 1 ; i < 72; ++i)
         color1 = color1.concat(con);
      var vertexColors = new Float32Array(color1);
   }
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
tower.prototype.drawroofside = function (tModel, tCamera, tProjection, x1, x2, h, z1, z2){
   // z1 is negative, z2 is positive
   // x1 is the shorter higher side
   // x2 is the longer lower side
   // h is the thickness (0, h)
   this.setupdraw();

   // vertex positions
   var vertexPos = new Float32Array(
         [  x2, h, z2,  x1, h, z1, -x1, h, z1, -x2, h, z2,
         x1, h, z1, x1, 0, z1, -x1, 0, z1, -x1, h, z1,
         x1, 0, z1, x2, 0, z2, -x2, 0, z2, -x1, 0, z1,
         x2, 0, z2, x2, h, z2, -x2, h, z2, -x2, 0, z2]);

   var vertexNormals = new Float32Array(
         [  0, 1, 0,  0, 1, 0, 0, 1, 0, 0, 1, 0,
         0, 0, -1,  0, 0, -1,  0, 0, -1,  0, 0, -1,
         0, -1, 0,  0, -1, 0,  0, -1, 0,  0, -1, 0,
         0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1
         ]);

   // vertex colors
   var color1 = [0.4, 0.3, 0.1];
   var con1 = [0.4, 0.3, 0.1];
   var con2 = [0.4, 0.2, 0.1];

   for(var i = 1; i < 4 ; ++i)
      color1 = color1.concat(con1);
   for(var i = 4; i < 8 ; ++i)
      color1 = color1.concat(con2);
   for(var i = 8; i < 12 ; ++i)
      color1 = color1.concat(con1);
   for(var i = 12; i < 16 ; ++i)
      color1 = color1.concat(con2);
   var vertexColors = new Float32Array(color1);

   // element index array
   var triangleIndices = new Uint8Array(
         [  0, 1, 2,   0, 2, 3,    
         4, 5, 6,   4, 6, 7,    
         8, 9,10,   8,10,11,    
         12,13,14,  12,14,15,]); 
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
tower.prototype.setupdraw = function(){
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

}
