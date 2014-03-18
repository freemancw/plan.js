/**
 * @author Clinton Freeman <freeman@cs.unc.edu>
 * @date 2014-03-18
 */

//=============================================================================
// Point2
//=============================================================================

PLAN.Point2 = function(x, y) {
    this.x = x;
    this.y = y;
};

PLAN.Point2Add = function(a, b) {
    return new PLAN.Point2(a.x+b.x, a.y+b.y);
};

PLAN.Point2Sub = function(a, b) {
    return new PLAN.Vector2(a.x-b.x, a.y-b.y);
};

PLAN.Point2DistSqr = function(a, b) {
    return (a.x-b.x)*(a.x-b.x)+(a.y-b.y)*(a.y-b.y);
};