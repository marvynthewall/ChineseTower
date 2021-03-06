"use strict"
function tower(shaderProgram,shaderProgram2, m4, gl){
   this.SP = shaderProgram;
   this.SP2 = shaderProgram2;
   this.m4 = m4;
   this.gl = gl;
}
tower.prototype.drawAll = function (tCamera, tProjection){
   this.gl.useProgram(this.SP);
   var tModel = this.m4.identity();
   //tModel = this.m4.translation([0, 100, 0]);
   var height = 200;
   var buildcoeffecient = 1.0;
   this.buildlayer(tModel, tCamera, tProjection, buildcoeffecient);
   var tMoveup;
   for (var i = 0 ; i < 5 ; ++i){
      tMoveup = this.m4.translation([0, height * buildcoeffecient, 0]);
      buildcoeffecient = buildcoeffecient * 0.8;
      tModel = this.m4.multiply(tMoveup, tModel);
      this.buildlayer(tModel, tCamera, tProjection, buildcoeffecient);
   }
   tMoveup = this.m4.translation([0, height * buildcoeffecient, 0]);
   tModel = this.m4.multiply(tMoveup, tModel);
   
   this.gl.useProgram(this.SP2);
   this.drawcylinder2(tModel, tCamera, tProjection, 100, 40);
}
tower.prototype.buildlayer = function(tModel, tCamera, tProjection, CE = 1.0){
   var l = 400 * CE;
   var h = 200 * CE;
   var w = l;
   var axisX = [1, 0, 0];
   var axisY = [0, 1, 0];
   var axisZ = [0, 0, 1];
   
   // roofside
   var tiltangle = Math.PI/5;
   var rfx1 = (l / 2) * 0.76;
   var rfx2 = (l / 2) * 1.36;
   var rfy = l * 0.012;
   var rfz1 = l * (-0.15);
   var rfz2 = l * 0.22;
   var roofcylindercolor = 'roof';
   
   // corner support
   var tiltcorner = Math.PI * 0.65;
   var ccy1 = l * 0.25;
   var cornerL = l * 0.55;
   var cornerR = l * 0.05;

   // side support
   var sideback = -l * 0.17;
   var sideL = l * 0.4;
   var sideR = l * 0.03;
   var sideout = -l * 0.02;
   var sidemove = l * 0.22;

   var trotateX90 = this.m4.axisRotation(axisX, Math.PI/2);
   var trotateY45 = this.m4.axisRotation(axisY, Math.PI/4);
   var trotateY90 = this.m4.axisRotation(axisY, Math.PI/2);



   tModel = this.m4.multiply(this.m4.translation([0, h, 0]), tModel);
   this.drawblock(tModel, tCamera, tProjection, l, h, w, 'block');
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

   // the cylinder at roofside
   
   var tiltside = this.m4.multiply(trotateX90, tilt);
   var tSideback = this.m4.translation([0, sideback, sideout]);
   var tToroofside = this.m4.multiply(tSideback, this.m4.multiply(tiltside, tedge));
   var tsidemove1 = this.m4.translation([sidemove, 0, 0]);
   var tsidemove2 = this.m4.translation([-sidemove, 0, 0]);

   tModel = this.m4.multiply(tToroofside, tNow);
   var tModelnow = tModel;
   this.drawcylinder(tModel, tCamera, tProjection, sideL, sideR, roofcylindercolor);
   tModel = this.m4.multiply(tsidemove1, tModelnow);
   this.drawcylinder(tModel, tCamera, tProjection, sideL, sideR, roofcylindercolor);
   tModel = this.m4.multiply(tsidemove2, tModelnow);
   this.drawcylinder(tModel, tCamera, tProjection, sideL, sideR, roofcylindercolor);
   tNow = this.m4.multiply(trotateY90, tNow);
   
   tModel = this.m4.multiply(tToroofside, tNow);
   var tModelnow = tModel;
   this.drawcylinder(tModel, tCamera, tProjection, sideL, sideR, roofcylindercolor);
   tModel = this.m4.multiply(tsidemove1, tModelnow);
   this.drawcylinder(tModel, tCamera, tProjection, sideL, sideR, roofcylindercolor);
   tModel = this.m4.multiply(tsidemove2, tModelnow);
   this.drawcylinder(tModel, tCamera, tProjection, sideL, sideR, roofcylindercolor);
   tNow = this.m4.multiply(trotateY90, tNow);

   tModel = this.m4.multiply(tToroofside, tNow);
   var tModelnow = tModel;
   this.drawcylinder(tModel, tCamera, tProjection, sideL, sideR, roofcylindercolor);
   tModel = this.m4.multiply(tsidemove1, tModelnow);
   this.drawcylinder(tModel, tCamera, tProjection, sideL, sideR, roofcylindercolor);
   tModel = this.m4.multiply(tsidemove2, tModelnow);
   this.drawcylinder(tModel, tCamera, tProjection, sideL, sideR, roofcylindercolor);
   tNow = this.m4.multiply(trotateY90, tNow);
   
   tModel = this.m4.multiply(tToroofside, tNow);
   var tModelnow = tModel;
   this.drawcylinder(tModel, tCamera, tProjection, sideL, sideR, roofcylindercolor);
   tModel = this.m4.multiply(tsidemove1, tModelnow);
   this.drawcylinder(tModel, tCamera, tProjection, sideL, sideR, roofcylindercolor);
   tModel = this.m4.multiply(tsidemove2, tModelnow);
   this.drawcylinder(tModel, tCamera, tProjection, sideL, sideR, roofcylindercolor);
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
      var con2 = [0.6, 0.4, 0];

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
      tModel = this.m4.multiply(this.m4.translation([0, -h, 0]), tModel);
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
   var color1 = [0.45, 0.25, 0.1];
   var con1 = [0.45, 0.25, 0.1];
   var con2 = [0.45, 0.25, 0.1];

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
tower.prototype.setupdraw2 = function(){
   this.SP2.PositionAttribute = this.gl.getAttribLocation(this.SP2, "vPosition");
   this.gl.enableVertexAttribArray(this.SP2.PositionAttribute);

   this.SP2.NormalAttribute = this.gl.getAttribLocation(this.SP2, "vNormal");
   this.gl.enableVertexAttribArray(this.SP2.NormalAttribute);

   this.SP2.ColorAttribute = this.gl.getAttribLocation(this.SP2, "vColor");
   this.gl.enableVertexAttribArray(this.SP2.ColorAttribute);    

   // this gives us access to the matrix uniform
   this.SP2.MVmatrix = this.gl.getUniformLocation(this.SP2,"modelViewMatrix");

   this.SP2.Nmatrix = this.gl.getUniformLocation(this.SP2,"normalMatrix");

   this.SP2.Pmatrix = this.gl.getUniformLocation(this.SP2,"projectionMatrix");

}
tower.prototype.drawcylinder2 = function (tModel, tCamera, tProjection, h, r, index = 'original'){
   this.setupdraw2();

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
   /*var color11 = [1, 1, 1];
   var color111 = [1, 1, 1];
   for(var i = 1 ; i < 72 ; ++i){
      color11 = color11.concat(color111);
   }
   var vertexColors = new Float32Array(color11);
   */
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

   this.gl.uniformMatrix4fv(this.SP2.MVmatrix, false, tmodelView);

   this.gl.uniformMatrix4fv(this.SP2.Nmatrix, false, tNormal);

   this.gl.uniformMatrix4fv(this.SP2.Pmatrix, false, tProjection);

   this.gl.bindBuffer(this.gl.ARRAY_BUFFER, trianglePosBuffer);
   this.gl.vertexAttribPointer(this.SP2.PositionAttribute, trianglePosBuffer.itemSize, this.gl.FLOAT, false, 0, 0);
   this.gl.bindBuffer(this.gl.ARRAY_BUFFER, normalBuffer);
   this.gl.vertexAttribPointer(this.SP2.NormalAttribute, normalBuffer.itemSize, this.gl.FLOAT, false, 0, 0);
   this.gl.bindBuffer(this.gl.ARRAY_BUFFER, colorBuffer);
   this.gl.vertexAttribPointer(this.SP2.ColorAttribute, colorBuffer.itemSize, this.gl.FLOAT,false, 0, 0);

   this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, indexBuffer);


   // Do the drawing
   this.gl.drawElements(this.gl.TRIANGLES, triangleIndices.length, this.gl.UNSIGNED_BYTE, 0);
}
