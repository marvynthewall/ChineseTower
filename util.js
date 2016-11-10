"use strict"
function findnormal(p1, p2, p3){
   var v1 = p2 - p1;
   var v2 = p3 - p1;
   var per = [v0[1] * v1[2] - v0[2] * v1[1], v0[2] * v1[0] - v0[0] * v1[2], v0[0] * v1[1] - v0[1] * v1[0] ];
   var norm = per[0] * per[0] + per[1] * per[1] + per[2] * per[2];
   var normal = [per[0] / norm, per[1]/norm, per[2]/norm];
   return normal;
}
