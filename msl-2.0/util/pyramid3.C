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
#include <cmath>
#include <vector>
using namespace std;


main(int argc, char **argv)
{ 
  if (argc < 5) {
    std::cout << "Usage:    pyramid3 x1 y1 z1 side_length\n";
    exit(-1);
  }
 
  double x0=atof(argv[1]);
  double y0=atof(argv[2]);
  double z0=atof(argv[3]);
  double l=atof(argv[4]);

  std::vector<double> p1(3,0.0), p2(3,0.0), p3(3,0.0), p4(3,0.0);
  p1[0] = x0;
  p1[1] = y0;
  p1[2] = z0;

  p2[0] = x0+l/2;
  p2[1] = y0+l*sqrt(5.0)/2;
  p2[2] = z0;

  p3[0] = x0+l;
  p3[1] = y0;
  p3[2] = z0;

  p4[0] = x0+l/2;
  p4[1] = y0+l/(4*sqrt(3.0));
  p4[2] = z0+l*sqrt(61.0/3)/4;

  std::cout << "(" << p1[0] <<"," << p1[1] << "," << p1[2] << ") " <<
               "(" << p2[0] <<"," << p2[1] << "," << p2[2] << ") " <<
               "(" << p3[0] <<"," << p3[1] << "," << p3[2] << ") " << 
               std::endl;

  std::cout << "(" << p1[0] <<"," << p1[1] << "," << p1[2] << ") " <<
               "(" << p4[0] <<"," << p4[1] << "," << p4[2] << ") " <<
               "(" << p2[0] <<"," << p2[1] << "," << p2[2] << ") " << 
               std::endl;

  std::cout << "(" << p1[0] <<"," << p1[1] << "," << p1[2] << ") " <<
               "(" << p3[0] <<"," << p3[1] << "," << p3[2] << ") " <<
               "(" << p4[0] <<"," << p4[1] << "," << p4[2] << ") " << 
               std::endl;

  std::cout << "(" << p3[0] <<"," << p3[1] << "," << p3[2] << ") " <<
               "(" << p2[0] <<"," << p2[1] << "," << p2[2] << ") " <<
               "(" << p4[0] <<"," << p4[1] << "," << p4[2] << ") " << 
               std::endl;

}
  

