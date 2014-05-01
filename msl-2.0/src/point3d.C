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



#include <math.h>
#include <ctype.h>
#include "MSL/point3d.h"

/*ostream& operator<<(ostream& out, const list<MSLPoint3d>& L)
{
  list<MSLPoint3d>::iterator x; 
  list<MSLPoint3d> vl;
  vl = L;
  for (x = vl.begin(); x != vl.end(); x++) 
    out << " " << *x;
  return out;
}


istream& operator>>(istream& in, list<MSLPoint3d>& L)
{ 
  L.clear();
  MSLPoint3d x;
  for(;;)
    { 
      char c;
      while (in.get(c) && isspace(c));
      if (!in) break;
      in.putback(c);
      x = MSLPoint3d(); in >> x; L.push_back(x);
    }
  return in;
}
*/

static void error_handler(int i, const char* s) {
  cerr << s << "\n";
  exit(i);
}


MSLPoint3d::MSLPoint3d() { xrep = 0; yrep = 0; zrep=0; }

MSLPoint3d::MSLPoint3d(double x, double y, double z) 
{ xrep = x; yrep = y; zrep=z; }


// Translations

MSLPoint3d MSLPoint3d::translate(double dx, double dy, double dz) const
{ return MSLPoint3d(xcoord()+dx,ycoord()+dy,zcoord()+dz); }



// Distances

double MSLPoint3d::sqr_dist(const MSLPoint3d& p)  const
{ double dx = p.xcoord() - xrep; 
  double dy = p.ycoord() - yrep;
  double dz = p.zcoord() - zrep;
  return dx*dx + dy*dy + dz*dz;
 }

double MSLPoint3d::xdist(const MSLPoint3d& q) const 
{ return fabs(xrep - q.xcoord()); }

double MSLPoint3d::ydist(const MSLPoint3d& q) const 
{ return fabs(yrep - q.ycoord()); }

double MSLPoint3d::zdist(const MSLPoint3d& q) const 
{ return fabs(zrep - q.zcoord()); }


MSLPoint3d MSLPoint3d::reflect(const MSLPoint3d& q) const
{ // reflect point across point q
  return MSLPoint3d(2*q.xcoord()-xcoord(), 2*q.ycoord()-ycoord(),
                                         2*q.zcoord()-zcoord());
 }


MSLPoint3d  MSLPoint3d::reflect(const MSLPoint3d& a, const MSLPoint3d& b,
                                               const MSLPoint3d& c) const
{  
  // reflect point across plane through a, b, and c

  double x1 = b.xcoord() - a.xcoord();
  double y1 = b.ycoord() - a.ycoord();
  double z1 = b.zcoord() - a.zcoord();

  double x2 = c.xcoord() - a.xcoord();
  double y2 = c.ycoord() - a.ycoord();
  double z2 = c.zcoord() - a.zcoord();

  double x3 = xcoord() - a.xcoord();
  double y3 = ycoord() - a.ycoord();
  double z3 = zcoord() - a.zcoord();

  double x = (z1*y2-y1*z2);
  double y = (x1*z2-z1*x2);
  double z = (y1*x2-x1*y2);

  if (x == 0 && y == 0 && z == 0)
      error_handler(1,"MSLPoint3d::reflect(a,b,c): a,b,c are coplanar");


  double f = -2*(x*x3+y*y3+z*z3)/(x*x+y*y+z*z);

  return translate(f*x,f*y,f*z);
}

  


double  MSLPoint3d::distance(const MSLPoint3d& q) const 
{ return sqrt(sqr_dist(q)); }


bool MSLPoint3d::operator==(const MSLPoint3d& p) const 
{ return xrep == p.xrep && 
         yrep == p.yrep && 
         zrep == p.zrep; 
}



ostream& operator<<(ostream& out, const MSLPoint3d& p)
{ out << "(" << p.xcoord() << "," << p.ycoord() << "," << p.zcoord() << ")";
  return out;
 } 

istream& operator>>(istream& in, MSLPoint3d& p) 
{ // syntax: {(} x {,} y {,} z{)}

  double x,y,z; 
  char c;

  do in.get(c); while (in && isspace(c));

  if (!in) return in;

  if (c != '(') in.putback(c);

  in >> x;

  do in.get(c); while (isspace(c));
  if (c != ',') in.putback(c);

  in >> y; 

  do in.get(c); while (isspace(c));
  if (c != ',') in.putback(c);

  in >> z; 

  do in.get(c); while (c == ' ');
  if (c != ')') in.putback(c);

  p = MSLPoint3d(x,y,z); 
  return in; 

 } 

