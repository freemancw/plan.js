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

#define LATITUDESTEPS 30
#define LONGITUDESTEPS 25
#define PI 3.1415926535897932385


main(int argc, char **argv)
{ 
  vector<double> p1,p2,p3;
  int i,j;
  double u,v;
  vector<double> x(3, 0.0);
  vector<double> sphere[LATITUDESTEPS][LONGITUDESTEPS];

  if (argc < 5) {
    cout << "Usage:    sphere xc yc zc r \n";
    exit(-1);
  }

  double xc = atof(argv[1]);
  double yc = atof(argv[2]);
  double zc = atof(argv[3]);
  double radius = atof(argv[4]);

  for (i = 0; i < LATITUDESTEPS; i++) {
    u = i*PI/(LATITUDESTEPS-1);
    for (j = 0; j < LONGITUDESTEPS; j++) {
      v = j*2.0*PI/LONGITUDESTEPS;
      x[0] = xc + radius*cos(v)*sin(u);
      x[1] = yc + radius*sin(v)*sin(u);
      x[2] = zc + radius*cos(u);
      sphere[i][j] = x;
    }
  }

  for (i = 0; i < LATITUDESTEPS; i++) {
    for (j = 0; j < LONGITUDESTEPS; j++) {
      p1 = sphere[i][j];
      p2 = sphere[(i+1) % LATITUDESTEPS][j];
      p3 = sphere[i][(j+1) % LONGITUDESTEPS];
      cout << "(" << p1[0] << "," << p1[1] << "," << p1[2] << ") ";
      cout << "(" << p2[0] << "," << p2[1] << "," << p2[2] << ") ";
      cout << "(" << p3[0] << "," << p3[1] << "," << p3[2] << ")\n";
      p1 = sphere[i][(j+1) % LONGITUDESTEPS];
      p2 = sphere[(i+1) % LATITUDESTEPS][j];
      p3 = sphere[(i+1) % LATITUDESTEPS][(j+1) % LONGITUDESTEPS];
      cout << "(" << p1[0] << "," << p1[1] << "," << p1[2] << ") ";
      cout << "(" << p2[0] << "," << p2[1] << "," << p2[2] << ") ";
      cout << "(" << p3[0] << "," << p3[1] << "," << p3[2] << ")\n";
    }
  }

}
  

