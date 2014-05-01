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



#ifndef MSL_MATRIX_H
#define MSL_MATRIX_H

#include "vector.h"
#include "mslio.h"

class MSLMatrix {

  MSLVector** v;
  int  d1;
  int  d2;

  void     flip_rows(int,int);
  void     check_dimensions(const MSLMatrix&) const; 
  double&  elem(int i, int j) const { return v[i]->v[j]; }
  double** triang(const MSLMatrix&, int&) const;
  
public:

  MSLMatrix(int n=0, int m=0);
  MSLMatrix(int n, int m, double* D);
  MSLMatrix(const MSLMatrix&);
  MSLMatrix(const MSLVector&);
  MSLMatrix& operator=(const MSLMatrix&);
  ~MSLMatrix();

  int     dim1()  const  {  return d1; }
  int     dim2()  const  {  return d2; }
  MSLVector& row(int i) const;
  MSLVector  col(int i) const;
  MSLMatrix  trans() const;
  MSLMatrix  inv()   const;
  double  det()   const;
  MSLMatrix solve(const MSLMatrix&) const;
  MSLVector solve(const MSLVector& b) const 
    { return MSLVector(solve(MSLMatrix(b))); }
  operator MSLVector() const;
  MSLVector& operator[](int i)    const { return row(i); }
  double& operator()(int i, int j);
  double  operator()(int,int) const;
  int     operator==(const MSLMatrix&)    const;
  int     operator!=(const MSLMatrix& x)  const { return !(*this == x); }
  MSLMatrix operator+(const MSLMatrix& M1) const;
  MSLMatrix operator-(const MSLMatrix& M1) const;
  MSLMatrix operator-() const;
  MSLMatrix& operator-=(const MSLMatrix&);
  MSLMatrix& operator+=(const MSLMatrix&);
  MSLMatrix operator*(const MSLMatrix& M1) const;
  MSLVector operator*(const MSLVector& vec) const 
    { return MSLVector(*this * MSLMatrix(vec)); }
  MSLMatrix operator*(double x) const;
  void read(istream& I);
  void read() { read(cin); }

  friend ostream& operator<<(ostream& O, const MSLMatrix& M);
  friend istream& operator>>(istream& I, MSLMatrix& M);
};

ostream& operator<<(ostream& O, const MSLMatrix& M);
istream& operator>>(istream& I, MSLMatrix& M);


#endif
