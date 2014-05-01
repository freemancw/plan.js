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
using namespace std;


main(int argc, char **argv)
{ 
  if (argc < 7) {
    cout << "Usage:    rectangle x1 y1 z1 x2 y2 z2 \n";
    exit(-1);
  }
 
  double x0=atof(argv[1]);
  double y0=atof(argv[2]);
  double z0=atof(argv[3]);
  double x1=atof(argv[4]);
  double y1=atof(argv[5]);
  double z1=atof(argv[6]);
  
  cout << "(" << x0 << "," << y0 << "," << z1 << ") ";
  cout << "(" << x0 << "," << y0 << "," << z0 << ") ";
  cout << "(" << x1 << "," << y0 << "," << z0 << ") ";
  cout << '\n';
  cout << "(" << x1 << "," << y0 << "," << z0 << ") ";
  cout << "(" << x1 << "," << y0 << "," << z1 << ") ";
  cout << "(" << x0 << "," << y0 << "," << z1 << ") ";
  cout << '\n';

  cout << "(" << x1 << "," << y0 << "," << z0 << ") ";
  cout << "(" << x0 << "," << y0 << "," << z0 << ") ";
  cout << "(" << x0 << "," << y1 << "," << z0 << ") ";
  cout << '\n';
  cout << "(" << x0 << "," << y1 << "," << z0 << ") ";
  cout << "(" << x1 << "," << y1 << "," << z0 << ") ";
  cout << "(" << x1 << "," << y0 << "," << z0 << ") ";
  cout << '\n';

  cout << "(" << x0 << "," << y1 << "," << z0 << ") ";
  cout << "(" << x0 << "," << y0 << "," << z0 << ") ";
  cout << "(" << x0 << "," << y0 << "," << z1 << ") ";
  cout << '\n';
  cout << "(" << x0 << "," << y0 << "," << z1 << ") ";
  cout << "(" << x0 << "," << y1 << "," << z1 << ") ";
  cout << "(" << x0 << "," << y1 << "," << z0 << ") ";
  cout << '\n';

  cout << "(" << x1 << "," << y1 << "," << z0 << ") ";
  cout << "(" << x1 << "," << y1 << "," << z1 << ") ";
  cout << "(" << x1 << "," << y0 << "," << z1 << ") ";
  cout << '\n';
  cout << "(" << x1 << "," << y0 << "," << z1 << ") ";
  cout << "(" << x1 << "," << y0 << "," << z0 << ") ";
  cout << "(" << x1 << "," << y1 << "," << z0 << ") ";
  cout << '\n';

  cout << "(" << x0 << "," << y1 << "," << z1 << ") ";
  cout << "(" << x0 << "," << y0 << "," << z1 << ") ";
  cout << "(" << x1 << "," << y0 << "," << z1 << ") ";
  cout << '\n';
  cout << "(" << x1 << "," << y0 << "," << z1 << ") ";
  cout << "(" << x1 << "," << y1 << "," << z1 << ") ";
  cout << "(" << x0 << "," << y1 << "," << z1 << ") ";
  cout << '\n';

  cout << "(" << x1 << "," << y1 << "," << z0 << ") ";
  cout << "(" << x0 << "," << y1 << "," << z0 << ") ";
  cout << "(" << x0 << "," << y1 << "," << z1 << ") ";
  cout << '\n';
  cout << "(" << x0 << "," << y1 << "," << z1 << ") ";
  cout << "(" << x1 << "," << y1 << "," << z1 << ") ";
  cout << "(" << x1 << "," << y1 << "," << z0 << ") ";
  cout << '\n';


}
  

