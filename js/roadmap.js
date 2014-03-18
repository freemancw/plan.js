/**
 * @author Clinton Freeman <freeman@cs.unc.edu>
 * @date 2014-03-18
 */

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
// kD tree
//=============================================================================

PLAN.AABB2 = function(min, max) {
    this.min = min;
    this.max = max;
};

PLAN.AABB2FromPoints = function(points) {
    var min = points[0];
    var max = points[0];

    for (var i = 0; i < points.length; ++i) {
        if (points[i].x < min.x) {
            min.x = points[i].x;
        }
        if (points[i].y < min.y) {
            min.y = points[i].y;
        }
        if (points[i].x > max.x) {
            max.x = points[i].x;
        }
        if (points[i].y > max.y) {
            max.y = points[i].y;
        }
    }

    return new PLAN.AABB2(min, max);
};

PLAN.kDNode = function(point, splitAxis, splitDist, leftChild, rightChild) {
    this.point = point;
    this.splitAxis = splitAxis;
    this.splitDist = splitDist;
    this.leftChild = leftChild;
    this.rightChild = rightChild;
};

PLAN.BuildkDTree = function(points, bbox) {

    if (points.length == 1) {
        return new PLAN.kDNode(points[0], '', 0, null, null);
    }

    // choose longest dimension as split axis
    var bbox_widthX = bbox.max.x - bbox.min.x;
    var bbox_widthY = bbox.max.y - bbox.min.y;
    
    var bbox_max = bbox_widthX;
    var split_axis = 'x';
    if (bbox_widthY > bbox_widthX) {
        bbox_max = bbox_widthY;
        split_axis = 'y';
    }

    // sort points along that axis and choose median value
    points.sort(function(a, b) {
        return a[split_axis] - b[split_axis];
    });

    var median_idx = Math.floor(points.length/2);
    var split_dist = points[median_idx][split_axis];

    var left_bbox = bbox;
    left_bbox.max[split_axis] = split_dist;
    var right_bbox = bbox;
    right_bbox.min[split_axis] = split_dist;

    var left_points = [];
    var right_points = [];
    for (var i = 0; i < points.length; ++i) {
        if (i < median_idx) {
            left_points.push(points[i]);
        } else if (i > median_idx) {
            right_points.push(points[i]);
        }
    }

    var left_node = PLAN.BuildkDTree(left_points, left_bbox);
    var right_node = PLAN.BuildkDTree(right_points, right_bbox);
    return new PLAN.kDNode(
        points[median_idx], 
        split_axis, 
        split_dist, 
        left_node, 
        right_node
    );

};

//=============================================================================
// Intersection tests
//=============================================================================

PLAN.Point2InCircle2 = function(point, circle) {

    var distSqr = PLAN.Point2DistSqr(point, circle.c);
    var radSqr = circle.r*circle.r;

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

//=============================================================================
// PRM 
//=============================================================================

PLAN.BuildPRM = function(start, goal, obstacles, n, m, workspace) {
    var milestones = [];

    // construct milestones
    for (var i = 0; i < n; ++i) {
        var samplePoint = new PLAN.Point2(
            Math.random()*256, Math.random()*256
        );

        if (PLAN.Clear(samplePoint, obstacles)) {
            milestones.push(samplePoint);
        }
    }

    // connect milestones
    var pointTree = PLAN.BuildkDTree(milestones);
    for (var i = 0; i < milestones.length; ++i) {
        var neighborPoints = PLAN.GetKNearestNeighbors(pointTree, milestones[i], 15);
        for (var j = 0; j < neighborPoints.length; ++j) {
            var neighborSeg = new PLAN.Segment2(milestones[i], neighborPoints[j]);
            if (PLAN.Link(neighborSeg, obstacles)) {
                
            }
        }
    }

};