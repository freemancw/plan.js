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

#include "MSL/model.h"
#include "MSL/defs.h"

Model::Model(string path) {

  if ((path.length() > 0)&&(path[path.length()-1] != '/'))
    path += "/";

  FilePath = path;
  
  READ_PARAMETER_OR_DEFAULT(ModelDeltaT,1.0);

  StateDim = 2;
  InputDim = 2;

}



MSLVector Model::EulerIntegrate(const MSLVector &x, const MSLVector &u, 
		  const double &h) 
{
  int s,i,k;
  double c;
  MSLVector nx;

  s = (h > 0) ? 1 : -1;

  c = s*h/ModelDeltaT;  // Number of iterations (as a double)
  k = (int) c;

  nx = x;
  for (i = 0; i < k; i++) {
    nx += s * ModelDeltaT * StateTransitionEquation(nx,u);
  }
  
  // Integrate the last step for the remaining time
  nx += s * (c - k) * ModelDeltaT * StateTransitionEquation(nx,u);

  return nx;
}



MSLVector Model::RungeKuttaIntegrate(const MSLVector &x, const MSLVector &u, 
		  const double &h) 
{
  MSLVector k1,k2,k3,k4;
  int s,i,k;
  double c,deltat;
  MSLVector nx;

  s = (h > 0) ? 1 : -1;

  c = s*h/ModelDeltaT;  // Number of iterations (as a double)
  k = (int) c;
  deltat = s * ModelDeltaT;

  nx = x;
  for (i = 0; i < k; i++) {
    k1 = StateTransitionEquation(nx,u);
    k2 = StateTransitionEquation(nx + (0.5*deltat)*k1,u);
    k3 = StateTransitionEquation(nx + (0.5*deltat)*k2,u);
    k4 = StateTransitionEquation(nx + deltat*k3,u);
    nx += deltat / 6.0 * (k1 + 2.0*k2 + 2.0*k3 + k4);
  }

  // Integrate the last step for the remaining time
  deltat = s * (c - k) * ModelDeltaT;
  k1 = StateTransitionEquation(nx,u);
  k2 = StateTransitionEquation(nx + (0.5*deltat)*k1,u);
  k3 = StateTransitionEquation(nx + (0.5*deltat)*k2,u);
  k4 = StateTransitionEquation(nx + deltat*k3,u);
  nx += deltat / 6.0 * (k1 + 2.0*k2 + 2.0*k3 + k4);
  
  return nx;
}



list<MSLVector> Model::GetInputs(const MSLVector &x) {
  return Inputs;
}



// By default, don't change anything
MSLVector Model::StateToConfiguration(const MSLVector &x) {
  return x;
}


bool Model::Satisfied(const MSLVector &x) {
  return true;
}


// Default is to use the standard Euclidean metric
double Model::Metric(const MSLVector &x1, const MSLVector &x2) {

  double rho;

  rho = (x1 - x2).length();

  return rho;
}


// Some models will interpolate differently because of 
// topology (e.g., S^1, P^3)
MSLVector Model::LinearInterpolate(const MSLVector &x1, const MSLVector &x2, 
				const double &a) {
  return (1.0-a)*x1 + a*x2;
}


// Ignore topology in the base class
MSLVector Model::StateDifference(const MSLVector &x1, const MSLVector &x2) {
  return (x2 - x1);
}


