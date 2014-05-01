//-------------------------------------------------------------------------
//                  The Motion Strategy Library (MSL)
//-------------------------------------------------------------------------
//
// Copyright (c) 2003 University of Illinois and Steven M. LaValle
// All rights reserved.
//
// Developed by:                Motion Strategy Laboratory
//                              University of Illinois
//                              http://msl.cs.uiuc.edu/msl/
//
// Versions of the Motion Strategy Library from 1999-2001 were developed
// in the Department of Computer Science, Iowa State University.
//
// Permission is hereby granted, free of charge, to any person obtaining
// a copy of this software and associated documentation files (the
// "Software"), to deal with the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to
// permit persons to whom the Software is furnished to do so, subject to
// the following conditions:
// 
//     * Redistributions of source code must retain the above copyright 
//       notice, this list of conditions and the following disclaimers.
//     * Redistributions in binary form must reproduce the above copyright 
//       notice, this list of conditions and the following disclaimers in 
//       the documentation and/or other materials provided with the 
//       distribution.
//     * Neither the names of the Motion Strategy Laboratory, University
//       of Illinois, nor the names of its contributors may be used to 
//       endorse or promote products derived from this Software without 
//       specific prior written permission.
//
// The software is provided "as is", without warranty of any kind,
// express or implied, including but not limited to the warranties of
// merchantability, fitness for a particular purpose and
// noninfringement.  In no event shall the contributors or copyright
// holders be liable for any claim, damages or other liability, whether
// in an action of contract, tort or otherwise, arising from, out of or
// in connection with the software or the use of other dealings with the
// software.
//
//-------------------------------------------------------------------------



#include <math.h>
#include <cstdlib>

// Include all models
#include "MSL/model.h"
#include "MSL/modelmisc.h"
#include "MSL/model2d.h"
#include "MSL/model3d.h"
#include "MSL/model3ddyn.h"
#include "MSL/modelcar.h"

// Include all geometries
#include "MSL/geom.h"
#include "MSL/geomPQP.h"

#include "MSL/util.h"

#include "MSL/defs.h"

#define MAKE_MODEL(_m)  if (is_file(path+""#_m"")) m = new _m(path);
#define MAKE_GEOM(_g)  if (is_file(path+""#_g"")) g = new _g(path);

void SetupProblem(Model *&m, Geom *&g, string path) {
  // Make them null initially
  m = NULL;
  g = NULL;

  // Models from modelmisc.h
  MAKE_MODEL(Model1D);
  MAKE_MODEL(ModelND);
  MAKE_MODEL(ModelLinear);
  MAKE_MODEL(ModelNintegrator);

  // Models from model2d.h
  MAKE_MODEL(Model2DPoint);
  MAKE_MODEL(Model2DPointCar);
  MAKE_MODEL(Model2DRigid);
  MAKE_MODEL(Model2DRigidCar);
  MAKE_MODEL(Model2DRigidCarForward);
  MAKE_MODEL(Model2DRigidCarSmooth);
  MAKE_MODEL(Model2DRigidCarSmoothTrailer);
  MAKE_MODEL(Model2DRigidCarSmooth2Trailers);
  MAKE_MODEL(Model2DRigidCarSmooth3Trailers);
  MAKE_MODEL(Model2DRigidDyncar);
  MAKE_MODEL(Model2DRigidDyncarNtire);
  MAKE_MODEL(Model2DRigidMulti);
  MAKE_MODEL(Model2DRigidChain);

  // Models from model3d.h
  MAKE_MODEL(Model3DRigid);
  MAKE_MODEL(Model3DRigidMulti);
  MAKE_MODEL(Model3DRigidChain);
  MAKE_MODEL(Model3DRigidTree);

  // Models from modelcar.h
  MAKE_MODEL(ModelCar);
  MAKE_MODEL(ModelCarSmooth);
  MAKE_MODEL(ModelCarDyn);
  MAKE_MODEL(ModelCarDynNtire);
  MAKE_MODEL(ModelCarDynRollover);
  MAKE_MODEL(ModelCarDynSmoothRollover);

  // Models from model3ddyn.h
  MAKE_MODEL(Model3DDyn);

  // Geoms from geom.h
  MAKE_GEOM(GeomNone);

  // Geoms from geomPQP.h
  MAKE_GEOM(GeomPQP2DRigid);
  MAKE_GEOM(GeomPQP2DRigidMulti);
  MAKE_GEOM(GeomPQP3DRigid);
  MAKE_GEOM(GeomPQP3DRigidMulti);

  if (m == NULL) // Make a default Model
    m = new Model2DPoint(path);
  if (g == NULL) // Make a default Geom
    g = new GeomPQP2DRigid(path);

}

