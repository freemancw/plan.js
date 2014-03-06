/**
 * @author Clinton Freeman <freeman@cs.unc.edu>
 */

var PLAN = {
    revision: '1' 
};

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

//=============================================================================
// Segment2
//=============================================================================

PLAN.Segment2 = function(p, q) {
    this.p = p;
    this.q = q;
}

//=============================================================================
// Circle2
//=============================================================================

PLAN.Circle2 = function(c, r) {
    this.c = c;
    this.r = r;
};

//=============================================================================
// Intersection tests
//=============================================================================

PLAN.Point2InCircle2 = function(point, circle) {
    //console.log('testing circle: ');
    //console.log(circle);

    var distSqr = PLAN.Point2DistSqr(point, circle.c);
    var radSqr = circle.r*circle.r;

    //console.log('distSqr: ' + distSqr + ', radSqr: ' + radSqr);

    if (distSqr <= radSqr) {
        return true;
    } else {
        return false;
    }
};

/**
 * Sources: David Eberly, Christer Ericson
 *
 * Intersecting a segment with a circle follows the same logic that we 
 * typically follow: plug the parameterized equation for one object into the 
 * implicit equation for the other and solve for the parameter.
 *
 * A circle in R^2 is the locus of points satisfying:
 *
 * (1) (x - cx)^2 + (y - cy)^2 = r^2
 *
 * where cx and cy are the components of the circle's center. We can rewrite
 * this in vector notation, with P = <x, y> and C = <cx, cy>:
 *
 * (2) (P - C) dot (P - C) = r^2
 *
 * Rays store an origin point and a direction vector. All points along the ray
 * can be represented by the parameterized expression:
 *
 * (3) O + tD, t >= 0
 *
 * We then plug (3) into (2) and solve for t to find the intersection(s)
 * along the ray. The sphere is a degree 2 algebraic surface, and will
 * therefore have at most 2 intersections with the ray.
 *
 * (4) (O + tD - C) dot (O + tD - C) = r^2
 */
PLAN.Segment2InCircle2 = function(segment, circle) {
    var vPQ = PLAN.Point2Sub(segment.q, segment.p);
    var m = PLAN.Point2Sub(circle.c, segment.p);
    var a = PLAN.Vector2Dot(vPQ, vPQ);
    var b = -2 * PLAN.Vector2Dot(m, vPQ);
    var c = PLAN.Vector2Dot(m, m) - circle.r * circle.r;
    var discr = b * b - 4 * a * c;

    // no real roots: ray completely missed the circle
    if (discr < 0) {
        return false;
    } 

    // single root: ray grazes circle tangentially
    if (discr == 0) {
        return true;
    }

    // two real roots: smaller root occurs first
    var t_enter = (-b - Math.sqrt(discr)) / (2 * a);
    var t_exit = (-b + Math.sqrt(discr)) / (2 * a);

    // contact with circle occurs outside of segment boundaries
    if (t_enter > 1 || t_exit < 0) {
        return false;
    }

    return true;
};

//=============================================================================
// PRM support functions
//=============================================================================

/**
 * Input: a test point and a list of circular obstacles in R^2. 
 * Output: true if the point is in free space, false otherwise.
 */
PLAN.Clear = function(point, obstacles) {
    //console.log(point);

    for (var i = 0; i < obstacles.length; ++i) {
        if (PLAN.Point2InCircle2(point, obstacles[i])) {
            return false;
        }
    }

    return true;
};

/**
 * Input: a directed line segment and a list of circular obstacles in R^2. 
 * Output: true if the segment is in free space, false otherwise.
 */
PLAN.Link = function(segment, obstacles) {
    
    for (var i = 0; i < obstacles.length; ++i) {
        if (PLAN.Segment2InCircle2(segment, obstacles[i])) {
            return false;
        }
    }

    return true;
};