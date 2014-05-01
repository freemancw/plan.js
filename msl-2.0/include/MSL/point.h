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



#ifndef MSL_POINT_H
#define MSL_POINT_H


#include <iostream>
#include <list>
using namespace std;

#include "mslio.h"

class MSLPoint
{
  double xrep;
  double yrep;

public:
 
  MSLPoint();
  MSLPoint(double x, double y);
  ~MSLPoint() {}
  double xcoord()  const   { return xrep; }
  double ycoord()  const   { return yrep; }
  void normalize() const {}
  int dim() const { return 2; }
  double sqr_dist(const MSLPoint& q) const;
  double xdist(const MSLPoint& q) const;
  double ydist(const MSLPoint& q) const;
  double distance(const MSLPoint& q) const;
  double distance() const { return distance(MSLPoint(0,0)); }
  double angle(const MSLPoint& q, const MSLPoint& r) const;
  MSLPoint translate_by_angle(double alpha, double d) const;
  MSLPoint translate(double dx, double dy) const;
  MSLPoint rotate(const MSLPoint& q, double a) const;
  MSLPoint rotate(double a) const;
  MSLPoint rotate90(const MSLPoint& q) const;
  MSLPoint rotate90() const;
  MSLPoint reflect(const MSLPoint& q, const MSLPoint& r) const;
  MSLPoint reflect(const MSLPoint& q) const;
  bool operator==(const MSLPoint& q) const;
  bool operator!=(const MSLPoint& q)  const { return !operator==(q);}

  friend ostream& operator<<(ostream& O, const MSLPoint& p) ;
  friend istream& operator>>(istream& I, MSLPoint& p) ;
  //friend istream& operator>>(istream& is, list<MSLPoint>& vl);
  //friend ostream& operator<<(ostream& os, const list<MSLPoint>& vl);
  //friend istream& operator>>(istream& is, list<list<MSLPoint> >& vl);
  //friend ostream& operator<<(ostream& os, const list<list<MSLPoint> >& vl);
};

ostream& operator<<(ostream& O, const MSLPoint& p) ;
istream& operator>>(istream& I, MSLPoint& p) ;


inline MSLPoint center(const MSLPoint& a, const MSLPoint& b) { 
  return MSLPoint((a.xcoord()+b.xcoord())/2,(a.ycoord()+b.ycoord())/2); 
} 


inline MSLPoint midMSLPoint(const MSLPoint& a, const MSLPoint& b) { 
  return center(a,b); 
}


inline int orientation(const MSLPoint& a, const MSLPoint& b, const MSLPoint& c)
{ double d1 = (a.xcoord() - b.xcoord()) * (a.ycoord() - c.ycoord());
  double d2 = (a.ycoord() - b.ycoord()) * (a.xcoord() - c.xcoord()); 
  if (d1 == d2) return 0; else return (d1 > d2) ? +1 : -1;
}

inline int cmp_signed_dist(const MSLPoint& a, const MSLPoint& b, 
			   const MSLPoint& c, const MSLPoint& d)
{ double d1 = (a.xcoord() - b.xcoord()) * (d.ycoord() - c.ycoord());
  double d2 = (a.ycoord() - b.ycoord()) * (d.xcoord() - c.xcoord()); 
  if (d1 == d2) return 0; else return (d1 > d2) ? +1 : -1;
}

inline double area(const MSLPoint& a, const MSLPoint& b, const MSLPoint& c)
{ return ((a.xcoord()-b.xcoord()) * (a.ycoord()-c.ycoord()) -
          (a.ycoord()-b.ycoord()) * (a.xcoord()-c.xcoord()))/2; }

inline bool collinear(const MSLPoint& a, const MSLPoint& b, const MSLPoint& c)
{ return (a.ycoord()-b.ycoord()) * (a.xcoord()-c.xcoord()) ==
         (a.xcoord()-b.xcoord()) * (a.ycoord()-c.ycoord()); }

inline bool right_turn(const MSLPoint& a, const MSLPoint& b, const MSLPoint& c)
{ return (a.xcoord()-b.xcoord()) * (a.ycoord()-c.ycoord()) <
         (a.ycoord()-b.ycoord()) * (a.xcoord()-c.xcoord()); }

inline bool left_turn(const MSLPoint& a, const MSLPoint& b, const MSLPoint& c)
{ return (a.xcoord()-b.xcoord()) * (a.ycoord()-c.ycoord()) >
         (a.ycoord()-b.ycoord()) * (a.xcoord()-c.xcoord()); }

extern int side_of_circle(const MSLPoint& a, const MSLPoint& b, 
                                    const MSLPoint& c, const MSLPoint& d);

inline bool incircle(const MSLPoint& a, const MSLPoint& b, const MSLPoint& c,
                                                     const MSLPoint& d)
{ return (orientation(a,b,c) * side_of_circle(a,b,c,d)) > 0; }

inline bool outcircle(const MSLPoint& a, const MSLPoint& b, const MSLPoint& c,
                                                      const MSLPoint& d)
{ return (orientation(a,b,c) * side_of_circle(a,b,c,d)) < 0; }

inline bool cocircular(const MSLPoint& a, const MSLPoint& b, const MSLPoint& c,
                                                       const MSLPoint& d)
{ return side_of_circle(a,b,c,d) == 0; }


// Add a fake polygon class which is a list of points
// typedef list<MSLPoint> MSLPolygon;

#endif

