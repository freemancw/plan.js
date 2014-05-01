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


main(int argc, char **argv)
{
  double xc, yc, zc, in_rad, out_rad;
  int is, os;

  if (argc < 8) {
    cout << "Usage: torus xc yc zv ir or is os\n";
    cout << "{x,y,z}c: center of the torus, {x,y,z}-coordinate\n";
    cout << "{i,o}r: {inner, outer} radius of the torus\n";
    cout << "{i,o}s: {inner, outer} number of sides of the torus\n";
    exit(1);
  }

  xc = atof(argv[1]);
  yc = atof(argv[2]);
  zc = atof(argv[3]);
  in_rad = atof(argv[4]);
  out_rad = atof(argv[5]);

  is = atoi(argv[6]);
  os = atoi(argv[7]);

  if ((is == 0) || (os == 0)) {
    cout << "Number of inner steps and outer steps may not be 0.\n";
    exit(1);
  }

  //  list<vector> pl;
  vector<double> p1,p2,p3;
  int i,j;
  double u,v;
  vector<double> x(3, 0.0);
  vector<double> torus[os][is];

  for (i = 0; i < os; i++) {
    u = i*2.0*PI/os;
    for (j = 0; j < is; j++) {
      v = j*2.0*PI/is;
      x[0] = xc + (out_rad + in_rad * cos(v))*cos(u);
      x[1] = yc + in_rad * sin(v);
      x[2] = zc + (out_rad + in_rad * cos(v))*sin(u);
      torus[i][j] = x;
    }
  }

  for (i = 0; i < os; i++) {
    for (j = 0; j < is; j++) {
      p1 = torus[i][j];
      p2 = torus[(i+1) % os][j];
      p3 = torus[i][(j+1) % is];
      cout << "(" << p1[2] << "," << p1[1] << "," << p1[0] << ") ";
      cout << "(" << p2[2] << "," << p2[1] << "," << p2[0] << ") ";
      cout << "(" << p3[2] << "," << p3[1] << "," << p3[0] << ")\n";
      p1 = torus[i][(j+1) % is];
      p2 = torus[(i+1) % os][j];
      p3 = torus[(i+1) % os][(j+1) % is];
      cout << "(" << p1[2] << "," << p1[1] << "," << p1[0] << ") ";
      cout << "(" << p2[2] << "," << p2[1] << "," << p2[0] << ") ";
      cout << "(" << p3[2] << "," << p3[1] << "," << p3[0] << ")\n";
    }
  }

}















