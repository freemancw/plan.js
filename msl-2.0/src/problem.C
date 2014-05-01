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

#include "MSL/problem.h"
#include "MSL/defs.h"

// Constructor
Problem::Problem(Geom *geom, Model *model, string path = "") {

  SetGeom(geom);
  SetModel(model);

  if ((path.length() > 0)&&(path[path.length()-1] != '/'))
    path += "/";

  FilePath = path;

  READ_PARAMETER_OR_DEFAULT(InitialState,M->LowerState + \
			    0.5*(M->UpperState - M->LowerState));

  if (!Satisfied(InitialState)) {
    cout << "Warning!  Initial state is not collision-free." << endl;
  }

  READ_PARAMETER_OR_DEFAULT(GoalState,M->LowerState);

  if (!Satisfied(GoalState)) {
    cout << "Warning!  Goal state is not collision-free." << endl;
  }

  StateDim = M->StateDim;
  InputDim = M->InputDim;
  LowerState = M->LowerState;
  UpperState = M->UpperState;

  NumBodies = G->NumBodies;
  MaxDeviates = G->MaxDeviates;
}


void Problem::SetGeom(Geom *geom) {
  G = geom;
  NumBodies = G->NumBodies;
  MaxDeviates = G->MaxDeviates;
  GeomDim = G->GeomDim;
}


void Problem::SetModel(Model *model) {
  M = model;
  StateDim = M->StateDim;
  InputDim = M->InputDim;
  LowerState = M->LowerState;
  UpperState = M->UpperState;

  READ_PARAMETER_OR_DEFAULT(InitialState,M->LowerState + \
			    0.5*(M->UpperState - M->LowerState));

  READ_PARAMETER_OR_DEFAULT(GoalState,M->LowerState);

}


// In the base class, steal the following methods from Model

list<MSLVector> Problem::GetInputs(const MSLVector &x) {
  return M->GetInputs(x);
}

list<MSLVector> Problem::GetInputs() {
  MSLVector x(StateDim);

  return M->GetInputs(x);
}


MSLVector Problem::InterpolateState(const MSLVector &x1, const MSLVector &x2, 
				 const double &a) {
  return M->LinearInterpolate(x1,x2,a);
}

// By default, don't change anything
MSLVector Problem::StateToConfiguration(const MSLVector &x) {
  return M->StateToConfiguration(x);
}

// Default metric: use the metric from the model
double Problem::Metric(const MSLVector &x1, const MSLVector &x2) {
  return M->Metric(x1,x2);
}

MSLVector Problem::StateDifference(const MSLVector &x1, 
				const MSLVector &x2) {
  return M->StateDifference(x1,x2);
}

bool Problem::Satisfied(const MSLVector &x) {
  return ((G->CollisionFree(StateToConfiguration(x)))&&
	  (M->Satisfied(x)));
}

MSLVector Problem::Integrate(const MSLVector &x, const MSLVector &u, 
			  const double &deltat) {
  return M->Integrate(x,u,deltat);
} 

// In the base class, steal the following methods from Geom

bool Problem::CollisionFree(const MSLVector &q) {
  return G->CollisionFree(q);
}


double Problem::DistanceComp(const MSLVector &q) {
  return G->DistanceComp(q);
}


MSLVector Problem::ConfigurationDifference(const MSLVector &q1, 
				    const MSLVector &q2) {
  return G->ConfigurationDifference(q1,q2);
}

