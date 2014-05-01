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

#include "MSL/model3ddyn.h"
#include "MSL/defs.h"


// *********************************************************************
// *********************************************************************
// CLASS:     Model3DDyn
// 
// *********************************************************************
// *********************************************************************


// Constructor
Model3DDyn :: Model3DDyn(string path) : Model3DRigid(path) 
{
  MSLVector u(3);

  StateDim = 12;
  InputDim = 3;

  m = 10.0;

  I = MSLMatrix(3, 3);
  
  I(0,0) = 1.0; I(0,1) = 0.0; I(0,2) = 0.0;
  I(1,0) = 0.0; I(1,1) = 1.0; I(1,2) = 0.0;
  I(2,0) = 0.0; I(2,1) = 0.0; I(2,2) = 1.0;

  // Make inputs
  u[0] = 1.0; u[1] = 0.0; u[2] = 0.0;
  Inputs.push_back(u);

  u[0] = -1.0; u[1] = 0.0; u[2] = 0.0;
  Inputs.push_back(u);

  u[0] = 0.0; u[1] = 1.0; u[2] = 0.0;
  Inputs.push_back(u);

  u[0] = 0.0; u[1] = -1.0; u[2] = 0.0;
  Inputs.push_back(u);

  u[0] = 0.0; u[1] = 0.0; u[2] = 1.0;
  Inputs.push_back(u);

  u[0] = 0.0; u[1] = 0.0; u[2] = -1.0; 
  Inputs.push_back(u);

  u[0] = 0.0; u[1] = 0.0; u[2] = 0.0; 
  Inputs.push_back(u);
}

MSLVector Model3DDyn::StateTransitionEquation(const MSLVector &x, 
					      const MSLVector &u)
{
  MSLVector r_ddot(4), t_ddot(4);
  MSLVector v_rpy(3);
  MSLVector dx(12);
  MSLMatrix ori(4,4);
  
  v_rpy[0] = x[3];
  v_rpy[1] = x[4];
  v_rpy[2] = x[5];

  ori = rpy(v_rpy);

  t_ddot[0] = u[0];
  t_ddot[1] = u[1];
  t_ddot[2] = u[2];
  t_ddot[3] = 1.0;

  t_ddot = ori * t_ddot;
  t_ddot = t_ddot * (1.0/m);
  
  r_ddot[0] = u[2] / 80.0;
  r_ddot[1] = u[0] / 80.0;
  r_ddot[2] = u[1] / 10.0;
  r_ddot[3] = 1.0;

  r_ddot = ori * r_ddot;
  
  dx[0] = x[6];
  dx[1] = x[7];
  dx[2] = x[8];
  dx[3] = x[9];
  dx[4] = x[10];
  dx[5] = x[11];

  dx[6] = t_ddot[0];
  dx[7] = t_ddot[1];
  dx[8] = t_ddot[2];
  
  dx[9] = r_ddot[0];
  dx[10] = r_ddot[1];
  dx[11] = r_ddot[2];

  return dx;
}


bool Model3DDyn::Satisfied(const MSLVector &state)
{
  int i;
  
  for (i = 0; i < StateDim; i++)
    if ((state[i] > UpperState[i]) || (state[i] < LowerState[i]))
      return false;
  
  return true;
}







