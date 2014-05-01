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



//#include <fstream.h>
#include <math.h>

#include "MSL/scene.h"
#include "MSL/defs.h"

// Constructor
Scene::Scene(Problem *problem, string path = "") {

  SetProblem(problem);

  if ((path.length() > 0)&&(path[path.length()-1] != '/'))
    path += "/";

  FilePath = path;

  NumBodies = P->NumBodies;
  
  READ_PARAMETER_OR_DEFAULT(LowerWorld,MSLVector(-50.0,-50.0,-50.0));
  READ_PARAMETER_OR_DEFAULT(UpperWorld,MSLVector(50.0,50.0,50.0));
  READ_PARAMETER_OR_DEFAULT(GlobalCameraPosition,
			    MSLVector((UpperWorld[0] + LowerWorld[0])/2.0,
				      (UpperWorld[1] + LowerWorld[1])/2.0,
				      UpperWorld[2] + 
				      (UpperWorld[1]- 
				       LowerWorld[1])/tan(38.0/180.0*PI)));
  READ_PARAMETER_OR_DEFAULT(GlobalCameraDirection,MSLVector(0.0,0.0,-1.0));
  READ_PARAMETER_OR_DEFAULT(GlobalCameraZenith,MSLVector(0.0,1.0,0.0));
  READ_PARAMETER_OR_DEFAULT(AttachedCameraPosition,MSLVector(0.0,0.0,6.0));
  READ_PARAMETER_OR_DEFAULT(AttachedCameraDirection,MSLVector(1.0,0.0,0.0));
  READ_PARAMETER_OR_DEFAULT(AttachedCameraZenith,MSLVector(0.0,0.0,1.0));
  READ_PARAMETER_OR_DEFAULT(AttachedCameraBody,0);

  GlobalCameraDirection = GlobalCameraDirection.norm();
  GlobalCameraZenith = GlobalCameraZenith.norm();
  AttachedCameraDirection = AttachedCameraDirection.norm();
  AttachedCameraZenith = AttachedCameraZenith.norm();
  
}



void Scene::SetProblem(Problem *problem) {
  P = problem;
  NumBodies = P->NumBodies;
  GeomDim = P->GeomDim;
  SceneConfigurationDim = NumBodies * 6;  // 6 DOF for each body
}


// By default, don't change anything
MSLVector Scene::StateToSceneConfiguration(const MSLVector &x) {
  MSLVector sc,q;
  int i;
  if (GeomDim == 3)
    return P->StateToConfiguration(x);
  else { // GeomDim == 2
    q = P->StateToConfiguration(x); // Three parameters per body
    // Blow out the MSLVector to make 6 parameters per body
    sc = MSLVector(NumBodies*6);
    for (i = 0; i < NumBodies; i++) {
      sc[6*i] = q[3*i];
      sc[6*i+1] = q[3*i+1];
      sc[6*i+2] = 0.0;
      sc[6*i+3] = 0.0;
      sc[6*i+4] = 0.0;
      sc[6*i+5] = q[3*i+2];
    }
    return sc;
  }
}


MSLVector Scene::InterpolatedSceneConfiguration(const MSLVector &x1, 
						const MSLVector &x2, 
						const double &a) {

  return StateToSceneConfiguration(P->InterpolateState(x1,x2,a));
}

