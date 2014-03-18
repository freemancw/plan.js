/**
 * @author Clinton Freeman <freeman@cs.unc.edu>
 */

var PLAN = {
    revision: '1' 
};

//=============================================================================
// Random stuff 
//=============================================================================

PLAN.DelaunayTriangulation = function(points) {

};

PLAN.InitGL = function(canvas) {
    console.log('Initializing GL canvas.');

    var ctx = canvas.getContext('webgl');

    if (!ctx) {
        console.log('webgl context not supported.');
        ctx = null;
    }

    return ctx;
};

PLAN.RenderFrame = function(timestamp) {
    requestAnimationFrame(PLAN.RenderFrame);
};








