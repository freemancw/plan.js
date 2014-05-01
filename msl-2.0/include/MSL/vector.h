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



#ifndef MSL_VECTOR_H
#define MSL_VECTOR_H


#include <fstream>
#include <iostream>
#include <list>
#include <vector>
using namespace std;


#include "mslio.h"

void error_handler(int i, const char* s);

class MSLVector
{
  friend class MSLMatrix;

  double* v;
  int d;

  void check_dimensions(const MSLVector&) const;
 
public:

  MSLVector(); 
  MSLVector(int d); 
  MSLVector(double a, double b);
  MSLVector(double a, double b, double c);
  MSLVector(const MSLVector& w, int prec);
  MSLVector(const MSLVector&);
  ~MSLVector(); 
  MSLVector& operator=(const MSLVector&);

  int    dim()    const { return d; }
  double& operator[](int i);
  double  operator[](int) const;
  double  hcoord(int i) const { return (i<d) ? (*this)[i] : 1; }
  double  coord(int i)  const { return (*this)[i]; }
  double sqr_length() const;
  double length() const;
  MSLVector norm() const { return *this/length(); }
  double angle(const MSLVector& w) const; 
  MSLVector rotate90() const;
  MSLVector rotate(double a) const;
  MSLVector& operator+=(const MSLVector&);
  MSLVector& operator-=(const MSLVector&);
  MSLVector  operator+(const MSLVector& v1) const;
  MSLVector  operator-(const MSLVector& v1) const;
  double  operator*(const MSLVector& v1) const;
  MSLVector  operator*(double r)        const;
  MSLVector  operator-() const;
  MSLVector  operator/(double)        const;
  bool     operator==(const MSLVector& w) const;
  bool     operator!=(const MSLVector& w)  const { return !(*this == w); }
  friend MSLVector operator*(double f, const MSLVector& v) { return v *f; }
  void print(ostream& O);
  void print() { print(cout); }
  void read(istream& I);
  void read() { read(cin); }
  friend ostream& operator<<(ostream& O, const MSLVector& v);
  friend istream& operator>>(istream& I, MSLVector& v);
};

ostream& operator<<(ostream& O, const MSLVector& v);
istream& operator>>(istream& I, MSLVector& v);

#endif
