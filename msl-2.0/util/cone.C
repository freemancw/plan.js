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







#include <cstdlib>
#include <iostream>

#include <list>
#include <vector>
#include <cmath>
using namespace std;


#define PI 3.1415926535897932385
#define CIRCLESTEPS 50

main(int argc, char **argv)
{
  int i;

  if (argc < 6) {
    cout << "Usage: Cone xp yp zp radius height\n";
    exit(-1);
  }

  double x1,x2,z1,z2;
  double xTop, yTop, zTop;
  double xBottom1, yBottom1, zBottom1;
  double xBottom2, yBottom2, zBottom2;

  double xp = atof(argv[1]);
  double yp = atof(argv[2]);
  double zp = atof(argv[3]);
  double Radius = atof(argv[4]);
  double Height = atof(argv[5]);
  
  //(xp,yp,zp) is the centre of the base of the cone

  xTop = xp;
  yTop = yp + Height;
  zTop = zp;

  //(xTop,yTop,zTop) would remain constant throughout

  for (i=1; i <=  CIRCLESTEPS; i++){
    
    x1 = cos((2*PI/CIRCLESTEPS)*(i-1))*Radius;
    x2 = cos((2*PI/CIRCLESTEPS)*(i))*Radius;
    z1 = -sin((2*PI/CIRCLESTEPS)*(i-1))*Radius;
    z2 = -sin((2*PI/CIRCLESTEPS)*(i))*Radius;
    
    xBottom1 = xp + x1;
    yBottom1 = yp;
    zBottom1 = zp + z1;

    xBottom2 = xp + x2;
    yBottom2 = yp;
    zBottom2 = zp + z2;

    //the following is the triangle for the base of the cone(circle)
    cout << "(" << xp << "," << yp << "," << zp << ") ";
    cout << "(" << xBottom2 << "," << yBottom2 << "," << zBottom2 << ") ";
    cout << "(" << xBottom1 << "," << yBottom1 << "," << zBottom1 << ")\n";

    //the following is the triangle for the lateral surface of the cone
    cout << "(" << xBottom1 << "," << yBottom1 << "," << zBottom1 << ") ";
    cout << "(" << xBottom2 << "," << yBottom2 << "," << zBottom2 << ") ";
    cout << "(" << xTop << "," << yTop << "," << zTop << ")\n";
  }
}


    
