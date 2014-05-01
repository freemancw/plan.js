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




#include "MSL/triangle.h"

/*
ostream& operator<<(ostream& out, const list<MSLTriangle>& L)
{
  list<MSLTriangle>::iterator x; 
  list<MSLTriangle> vl;
  vl = L;
  for (x = vl.begin(); x != vl.end(); x++) 
    out << " " << *x;
  return out;
}


istream& operator>>(istream& in, list<MSLTriangle>& L)
{ 
  L.clear();
  MSLTriangle x;
  for(;;)
    { 
      char c;
      while (in.get(c) && isspace(c));
      if (!in) break;
      in.putback(c);
      x = MSLTriangle(); in >> x; L.push_back(x);
    }
  return in;
}
*/

istream& operator>> (istream& is, MSLTriangle& tr) 
{ is >> tr.p1 >> tr.p2 >> tr.p3; return is; }


ostream& operator<< (ostream& os, const MSLTriangle& tr)
{ os << tr.p1 << " " << tr.p2 << " " << tr.p3 << endl; return os; }


MSLTriangle& MSLTriangle::operator= (const MSLTriangle& tr)
{ p1=tr.p1; p2=tr.p2; p3=tr.p3; return (*this);}


MSLTriangle::MSLTriangle(MSLPoint3d pt1, MSLPoint3d pt2, MSLPoint3d pt3){
  p1 = pt1;
  p2 = pt2;
  p3 = pt3;
}


MSLTriangle::MSLTriangle(){
  MSLPoint3d *p;
  p = new MSLPoint3d(0,0,0);
  p1 = *p;
  p2 = *p;
  p3 = *p;
}


MSLTriangle::MSLTriangle(const MSLTriangle& p){
  p1 = p.p1;
  p2 = p.p2;
  p3 = p.p3;
}


list<MSLTriangle> PolygonsToTriangles(const list<MSLPolygon > &pl,
				      double thickness) {

  list<MSLPolygon>::const_iterator p;
  list<MSLPoint>::const_iterator pt;
  MSLPoint fpt;
  MSLPoint3d p1,p2,p3,p4,roof;
  list<MSLTriangle> tl;

  tl.clear();

  for (p = pl.begin(); p != pl.end(); p++) {
    //cout << "Polygon: " << (*p) << "\n";
    // Make the sides
    fpt = p->LPoints.front();
    roof = MSLPoint3d(fpt.xcoord(),fpt.ycoord(),thickness);
    pt = p->LPoints.end(); 
    pt--;  // Moves to the last element
    p1 = MSLPoint3d(pt->xcoord(),pt->ycoord(),0.0);
    p4 = MSLPoint3d(pt->xcoord(),pt->ycoord(),thickness);
    pt = p->LPoints.begin();
    while (pt != p->LPoints.end()) {
      p2 = MSLPoint3d(pt->xcoord(),pt->ycoord(),0.0);
      p3 = MSLPoint3d(pt->xcoord(),pt->ycoord(),thickness);

      tl.push_back(MSLTriangle(p1,p2,p3));
      tl.push_back(MSLTriangle(p4,p1,p3));
    
      if ((p3 != roof)&&(p4 != roof))
	tl.push_back(MSLTriangle(roof,p4,p3));

      p1 = p2; p4 = p3;
      pt++;

    }
  }
  
  return tl;
}


