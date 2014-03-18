/**
 * @author Clinton Freeman <freeman@cs.unc.edu>
 * @date 2014-03-18
 */

//=============================================================================
// Vector2
//=============================================================================

PLAN.Vector2 = function(x, y) {
    this.x = x;
    this.y = y;
};

PLAN.Vector2Len = function(v) {
    return Math.sqrt(v.x*v.x+v.y*v.y);
};

PLAN.Vector2LenSqr = function(v) {
    return v.x*v.x+v.y*v.y;
};

PLAN.Vector2Add = function(a, b) {
    return new PLAN.Vector2(a.x+b.x, a.y+b.y);
};

PLAN.Vector2Sub = function(a, b) {
    return new PLAN.Vector2(a.x-b.x, a.y-b.y);
};

PLAN.Vector2Scale = function(v, s) {
    return new PLAN.Vector2(v.x*s, v.y*s);
};

PLAN.Vector2Dot = function(a, b) {
    return a.x*b.x+a.y*b.y;
};