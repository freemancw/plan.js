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



#ifndef MSL_POINT3D_H
#define MSL_POINT3D_H


#include <iostream>
#include <list>
using namespace std;


#include "mslio.h"

class MSLPoint3d
{
  double xrep;
  double yrep;
  double zrep;

public:
  
  MSLPoint3d();
  MSLPoint3d(double x, double y, double z);
  ~MSLPoint3d() {}
  double  xcoord()  const   { return xrep; }
  double  ycoord()  const   { return yrep; }
  double  zcoord()  const   { return zrep; }
  double  W()   const   { return 1; }
  double  WD()  const   { return 1; }
  int     dim() const { return 3; }
  double  sqr_dist(const MSLPoint3d& q) const;
  double xdist(const MSLPoint3d& q) const;
  double ydist(const MSLPoint3d& q) const;
  double zdist(const MSLPoint3d& q) const;
  double  distance(const MSLPoint3d& q) const;
  MSLPoint3d translate(double dx, double dy, double dz) const;
  MSLPoint3d reflect(const MSLPoint3d& q, const MSLPoint3d& r, 
		     const MSLPoint3d& s) const;
  MSLPoint3d reflect(const MSLPoint3d& q) const;
  bool operator==(const MSLPoint3d& q) const;
  bool operator!=(const MSLPoint3d& q)  const { return !operator==(q);}
  friend ostream& operator<<(ostream& O, const MSLPoint3d& p) ;
  friend istream& operator>>(istream& I, MSLPoint3d& p) ;
  //friend istream& operator>>(istream& is, list<MSLPoint3d> & vl);
  //friend ostream& operator<<(ostream& os, const list<MSLPoint3d> & vl);
};

ostream& operator<<(ostream& O, const MSLPoint3d& p) ;
istream& operator>>(istream& I, MSLPoint3d& p) ;

#endif





