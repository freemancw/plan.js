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

#define PI 3.1415926535897932385

main(int argc, char **argv)
{ 
  if (argc < 5) {
    std::cout << "Usage:    spring_square x0 y0 z0 turns\n";
    exit(-1);
  }
 
  double    x0 = atof(argv[1]);
  double    y0 = atof(argv[2]);
  double    z0 = atof(argv[3]);
  int    turns = atoi(argv[4]);

  double inner = 12.0;
  double outer = 14.0;
  double spacing = 15.0;
  int ppt = 20;  

  double p1[ppt*turns][3], p2[ppt*turns][3], 
         p3[ppt*turns][3], p4[ppt*turns][3];

  //populate vectors
  for (int i = 0; i < ppt*turns; i++)
  {
    double th = double(i)*2*PI/ppt;
    //bottom inner
    p1[i][0] = inner*cos(th);
    p1[i][1] = spacing*th/(2*PI);
    p1[i][2] = inner*sin(th);
    //bottom outer
    p2[i][0] = outer*cos(th);
    p2[i][1] = spacing*th/(2*PI);
    p2[i][2] = outer*sin(th);
    //top outer
    p3[i][0] = outer*cos(th);
    p3[i][1] = spacing*th/(2*PI) + (outer-inner);
    p3[i][2] = outer*sin(th);
    //top inner
    p4[i][0] = inner*cos(th);
    p4[i][1] = spacing*th/(2*PI) + (outer-inner);
    p4[i][2] = inner*sin(th);
  }
  //triangle for bottom end of spring

  std::cout << "(" << p1[0][0] <<"," << p1[0][1] << "," << p1[0][2] << ") " <<
               "(" << p3[0][0] <<"," << p3[0][1] << "," << p3[0][2] << ") " << 
               "(" << p2[0][0] <<"," << p2[0][1] << "," << p2[0][2] << ") " <<
               std::endl;

  std::cout << "(" << p3[0][0] <<"," << p3[0][1] << "," << p3[0][2] << ") " <<
               "(" << p1[0][0] <<"," << p1[0][1] << "," << p1[0][2] << ") " << 
               "(" << p4[0][0] <<"," << p4[0][1] << "," << p4[0][2] << ") " <<
               std::endl;

  //triangles for top end of spring

  int pt = ppt*turns-1;

  std::cout << "(" << p1[pt][0] <<"," << p1[pt][1] << "," << 
                      p1[pt][2] << ") " <<
               "(" << p2[pt][0] <<"," << p2[pt][1] << "," << 
                      p2[pt][2] << ") " <<
               "(" << p3[pt][0] <<"," << p3[pt][1] << "," << 
                      p3[pt][2] << ") " << 
               std::endl;

  std::cout << "(" << p3[pt][0] <<"," << p3[pt][1] << "," << 
                      p3[pt][2] << ") " <<
               "(" << p4[pt][0] <<"," << p4[pt][1] << "," << 
                      p4[pt][2] << ") " <<
               "(" << p1[pt][0] <<"," << p1[pt][1] << "," << 
                      p1[pt][2] << ") " << 
               std::endl;

  //triangles for spring
  for (int i = 0; i < pt; i++)
  {
    //bottom face
    std::cout << "(" << p1[i][0] <<"," << p1[i][1] << "," << 
                        p1[i][2] << ") " <<
                 "(" << p2[i][0] <<"," << p2[i][1] << "," << 
                        p2[i][2] << ") " <<
                 "(" << p2[i+1][0] <<"," << p2[i+1][1] << "," << 
                        p2[i+1][2] << ") " << 
                 std::endl;

    std::cout << "(" << p2[i+1][0] <<"," << p2[i+1][1] << "," << 
                        p2[i+1][2] << ") " <<
                 "(" << p1[i+1][0] <<"," << p1[i+1][1] << "," << 
                        p1[i+1][2] << ") " <<
                 "(" << p1[i][0] <<"," << p1[i][1] << "," << 
                        p1[i][2] << ") " << 
                 std::endl;

    //outer face
    std::cout << "(" << p2[i][0] <<"," << p2[i][1] << "," << 
                        p2[i][2] << ") " <<
                 "(" << p3[i][0] <<"," << p3[i][1] << "," << 
                        p3[i][2] << ") " <<
                 "(" << p3[i+1][0] <<"," << p3[i+1][1] << "," << 
                        p3[i+1][2] << ") " << 
                 std::endl;

    std::cout << "(" << p3[i+1][0] <<"," << p3[i+1][1] << "," << 
                        p3[i+1][2] << ") " <<
                 "(" << p2[i+1][0] <<"," << p2[i+1][1] << "," << 
                        p2[i+1][2] << ") " <<
                 "(" << p2[i][0] <<"," << p2[i][1] << "," << 
                        p2[i][2] << ") " << 
                 std::endl;

    //top face
    std::cout << "(" << p3[i][0] <<"," << p3[i][1] << "," << 
                        p3[i][2] << ") " <<
                 "(" << p4[i][0] <<"," << p4[i][1] << "," << 
                        p4[i][2] << ") " <<
                 "(" << p4[i+1][0] <<"," << p4[i+1][1] << "," << 
                        p4[i+1][2] << ") " << 
                 std::endl;

    std::cout << "(" << p4[i+1][0] <<"," << p4[i+1][1] << "," << 
                        p4[i+1][2] << ") " <<
                 "(" << p3[i+1][0] <<"," << p3[i+1][1] << "," << 
                        p3[i+1][2] << ") " <<
                 "(" << p3[i][0] <<"," << p3[i][1] << "," << 
                        p3[i][2] << ") " << 
                 std::endl;

    //inner face
    std::cout << "(" << p4[i][0] <<"," << p4[i][1] << "," << 
                        p4[i][2] << ") " <<
                 "(" << p1[i][0] <<"," << p1[i][1] << "," << 
                        p1[i][2] << ") " <<
                 "(" << p1[i+1][0] <<"," << p1[i+1][1] << "," << 
                        p1[i+1][2] << ") " << 
                 std::endl;

    std::cout << "(" << p1[i+1][0] <<"," << p1[i+1][1] << "," << 
                        p1[i+1][2] << ") " <<
                 "(" << p4[i+1][0] <<"," << p4[i+1][1] << "," << 
                        p4[i+1][2] << ") " <<
                 "(" << p4[i][0] <<"," << p4[i][1] << "," << 
                        p4[i][2] << ") " << 
                 std::endl;
  }

}
  

