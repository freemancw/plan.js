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
  int i,j;
  double x1,x2,z1,z2;
  double xOuterTop1,yOuterTop1,zOuterTop1,xOuterTop2,yOuterTop2,zOuterTop2;
  double xOuterBottom1,yOuterBottom1,zOuterBottom1,xOuterBottom2,yOuterBottom2, zOuterBottom2;
  double xInnerTop1,yInnerTop1,zInnerTop1,xInnerTop2,yInnerTop2,zInnerTop2;
  double xInnerBottom1,yInnerBottom1,zInnerBottom1,xInnerBottom2,yInnerBottom2, zInnerBottom2;
  
  if (argc < 7) {
    cout << "Usage: cylinder xp yp zp  inner_rad outer_rad len\n";
    exit(-1);
  }

  double xp = atof(argv[1]);
  double yp = atof(argv[2]);
  double zp = atof(argv[3]);
  double InnerRadius = atof(argv[4]);
  double OuterRadius = atof(argv[5]);
  double length = atof(argv[6]);

  if (InnerRadius >= OuterRadius){
    cout << "Inner Radius must be lesser than the Outer Radius\n";
    exit(-1);
  }

  //(xp, yp, zp) is the centre of the top circle of the cylinder
  
  for (i=1; i <=  CIRCLESTEPS; i++){

    //computing the triangles for the outer surface
    x1 = cos((2*PI/CIRCLESTEPS)*(i-1))*OuterRadius;
    x2 = cos((2*PI/CIRCLESTEPS)*(i))*OuterRadius;
    z1 = -sin((2*PI/CIRCLESTEPS)*(i-1))*OuterRadius;
    z2 = -sin((2*PI/CIRCLESTEPS)*(i))*OuterRadius;
    
    xOuterTop1 = xp + x1;
    zOuterTop1 = zp + z1;
    yOuterTop1 = yp;
    xOuterTop2 = xp + x2;
    zOuterTop2 = zp + z2;
    yOuterTop2 = yp;
    
    xOuterBottom1 = xp + x1; //xBottom, zBottom are the same as xTop, ZTop
    zOuterBottom1 = zp + z1;
    yOuterBottom1 = yp - length; //since yBottom is length units below yp
    xOuterBottom2 = xp + x2;
    zOuterBottom2 = zp + z2;
    yOuterBottom2 = yp - length;

    //Therefore the four points that would form one side of the outer cylinder 
    //(a rectangle) sre: (xOuterTop1,yOuterTop1,zOuterTop1) , (xOuterTop2,yOuterTop2,zOuterTop2) , 
    //(xOuterBottom1,yOuterBottom1,zOuterBottom1) , (xOuterBottom2,yOuterBottom2,zOuterBottom2)

    //Each rectangle (one side of the cylinder) will be decomposed into two
    //triangles

    cout << "(" << xOuterBottom1 << "," << yOuterBottom1 << "," << zOuterBottom1 << ") ";
    cout << "(" << xOuterBottom2 << "," << yOuterBottom2 << "," << zOuterBottom2 << ") ";
    cout << "(" << xOuterTop2 << "," << yOuterTop2 << "," << zOuterTop2 << ")\n";
    
    cout << "(" << xOuterTop2 << "," << yOuterTop2 << "," << zOuterTop2 << ") ";
    cout << "(" << xOuterTop1 << "," << yOuterTop1 << "," << zOuterTop1 << ") ";
    cout << "(" << xOuterBottom1 << "," << yOuterBottom1 << "," << zOuterBottom1 << ")\n";

    //computing the triangles for the Inner surface
    x1 = cos((2*PI/CIRCLESTEPS)*(i-1))*InnerRadius;
    x2 = cos((2*PI/CIRCLESTEPS)*(i))*InnerRadius;
    z1 = -sin((2*PI/CIRCLESTEPS)*(i-1))*InnerRadius;
    z2 = -sin((2*PI/CIRCLESTEPS)*(i))*InnerRadius;
    
    xInnerTop1 = xp + x1;
    zInnerTop1 = zp + z1;
    yInnerTop1 = yp;
    xInnerTop2 = xp + x2;
    zInnerTop2 = zp + z2;
    yInnerTop2 = yp;
    
    xInnerBottom1 = xp + x1; //xBottom, zBottom are the same as xTop, ZTop
    zInnerBottom1 = zp + z1;
    yInnerBottom1 = yp - length; //since yBottom is length units below yp
    xInnerBottom2 = xp + x2;
    zInnerBottom2 = zp + z2;
    yInnerBottom2 = yp - length;

    //Therefore the four points that would form one side of the inner cylinder 
    //(a rectangle) sre: (xInnerTop1,yInnerTop1,zInnerTop1) , (xInnerTop2,yInnerTop2,zInnerTop2) , 
    //(xInnerBottom1,yInnerBottom1,zInnerBottom1) , (xInnerBottom2,yInnerBottom2,zInnerBottom2)

    //Each rectangle (one side of the cylinder) will be decomposed into two
    //triangles

    cout << "(" << xInnerBottom2 << "," << yInnerBottom2 << "," << zInnerBottom2 << ") ";
    cout << "(" << xInnerBottom1 << "," << yInnerBottom1 << "," << zInnerBottom1 << ") ";
    cout << "(" << xInnerTop1 << "," << yInnerTop1 << "," << zInnerTop1 << ")\n";
    
    cout << "(" << xInnerTop1 << "," << yInnerTop1 << "," << zInnerTop1 << ") ";
    cout << "(" << xInnerTop2 << "," << yInnerTop2 << "," << zInnerTop2 << ") ";
    cout << "(" << xInnerBottom2 << "," << yInnerBottom2 << "," << zInnerBottom2 << ")\n";

    //The surface connecting the outer and the inner surfaces of the cylinder are trapezoids
    //next we have to compute the trapezoids which would each be decomposed into two triangles

    //computing the trapezoids on the top
    cout << "(" << xOuterTop2 << "," << yOuterTop2 << "," << zOuterTop2 << ") ";
    cout << "(" << xInnerTop2 << "," << yInnerTop2 << "," << zInnerTop2 << ") ";
    cout << "(" << xInnerTop1 << "," << yInnerTop1 << "," << zInnerTop1 << ")\n";

    cout << "(" << xInnerTop1 << "," << yInnerTop1 << "," << zInnerTop1 << ") ";
    cout << "(" << xOuterTop1 << "," << yOuterTop1 << "," << zOuterTop1 << ") ";
    cout << "(" << xOuterTop2 << "," << yOuterTop2 << "," << zOuterTop2 << ")\n";

    //computing the trapezoids on the bottom
    cout << "(" << xOuterBottom2 << "," << yOuterBottom2 << "," << zOuterBottom2 << ") ";
    cout << "(" << xOuterBottom1 << "," << yOuterBottom1 << "," << zOuterBottom1 << ") ";
    cout << "(" << xInnerBottom1 << "," << yInnerBottom1 << "," << zInnerBottom1 << ")\n";

    cout << "(" << xInnerBottom1 << "," << yInnerBottom1 << "," << zInnerBottom1 << ") ";
    cout << "(" << xInnerBottom2 << "," << yInnerBottom2 << "," << zInnerBottom2 << ") ";
    cout << "(" << xOuterBottom2 << "," << yOuterBottom2 << "," << zOuterBottom2 << ")\n";

  }
  
}

    

