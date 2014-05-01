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









#include <fstream>
#include <math.h>
using namespace std;

#include <MSL/model3d.h>

#include "modelnew.h"


// *********************************************************************
// *********************************************************************
// CLASS:     Model3DRigidHelical
//
// A nonlinear model that generates helical motions
// *********************************************************************
// *********************************************************************


// Constructor
Model3DRigidHelical::Model3DRigidHelical(string path = ""):Model3DRigid(path) {
  InputDim = 3;  // Override the default of 6 from Model3DRigid

  // Make inputs
  // u[0] is the speed: positive is forward, negative is reverse
  // u[1] is the steering: 0.0 is straight, 0.1 is left, -0.1 is right
  // u[2] changes altitude (Z direction)
  Inputs.clear();  // Clear whatever inputs came from Model3DRigid!!!
  Inputs.push_front(MSLVector(1.0,0.0,0.0));
  Inputs.push_front(MSLVector(1.0,0.1,0.0));
  Inputs.push_front(MSLVector(1.0,-0.1,0.0));
  Inputs.push_front(MSLVector(1.0,0.0,0.5));
  Inputs.push_front(MSLVector(1.0,0.1,0.5));
  Inputs.push_front(MSLVector(1.0,-0.1,0.5));
  Inputs.push_front(MSLVector(1.0,0.0,-0.5));
  Inputs.push_front(MSLVector(1.0,0.1,-0.5));
  Inputs.push_front(MSLVector(1.0,-0.1,-0.5));
  
  READ_OPTIONAL_PARAMETER(Inputs);

}


//! Give the equations of motion for a helical kinematic system
MSLVector Model3DRigidHelical::StateTransitionEquation(const MSLVector &x, 
						    const MSLVector &u) {

  MSLVector dx(6);
  
  // With respect to 0,1,5, it should look like a Reeds-Shepp car model

  dx[0] = u[0]*cos(x[5]);
  dx[1] = u[0]*sin(x[5]);
  dx[2] = u[2];  // Change elevation
  dx[3] = 0.0;   // No roll
  dx[4] = 0.0;   // No pitch
  dx[5] = u[0]*u[1];  // Some yaw

  return dx;
}


MSLVector Model3DRigidHelical::Integrate(const MSLVector &x, const MSLVector &u, 
				      const double &h)
{
  return RungeKuttaIntegrate(x,u,h);
}


