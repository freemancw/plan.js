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



#ifndef MSL_TRIANGLE_H
#define MSL_TRIANGLE_H

#include <ctype.h>

#include <list>
#include <iostream>
#include <fstream>
using namespace std;


#include "point3d.h" 
#include "point.h"
#include "mslio.h"
#include "polygon.h"

//! A 3D triangle, made of 3 3D points

class MSLTriangle {
 public:
  MSLPoint3d p1,p2,p3;

  MSLTriangle(MSLPoint3d pt1, MSLPoint3d pt2, MSLPoint3d pt3);
  MSLTriangle();
  ~MSLTriangle(){}
  MSLTriangle(const MSLTriangle& tr);
  friend istream& operator>> (istream& is, MSLTriangle& tr);
  friend ostream& operator<< (ostream& os, const MSLTriangle& tr);
  MSLTriangle& operator= (const MSLTriangle& tr);

  //friend istream& operator>> (istream& is, list<MSLTriangle> & tl);
  //friend ostream& operator<< (ostream& os, const list<MSLTriangle> & tl);

};

istream& operator>> (istream& is, MSLTriangle& tr);
ostream& operator<< (ostream& os, const MSLTriangle& tr);


//! A handy utility for converting 2D geometries into 3D
//list<MSLTriangle> PolygonsToTriangles(const list<list<MSLPoint> > &pl,
//				      double thickness);
list<MSLTriangle> PolygonsToTriangles(const list<MSLPolygon> &pl,
				      double thickness);


#endif

