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



#ifndef MSL_MARRAY_H
#define MSL_MARRAY_H

#include <vector>
using namespace std;


#include "mslio.h"

//! A multidimensional array made from a 1D vector

template<class E> class MultiArray {
  //! The one-dimensional STL vector which actually holds the data
  vector<E> A;

  //! Used for computing fast offsets
  vector<int> Offsets;

  //! Gives the limit for each index: 0..Dimensions[i]-1
  vector<int> Dimensions;

  //! The dimension of the multi-dimensional array
  int Dimension;

  //! Number of elements in the array
  int Size;

 public:
  //! Maximum allowable array size (default = 10 million)
  int MaxSize;
  
  //! Constructor with default assignment of x to each element
  MultiArray(const vector<int> &dims, const E &x);

  //! Constructor with no default assignment
  MultiArray(const vector<int> &dims);

  //! Constructor with no initialization
  MultiArray() {};
  ~MultiArray() {};

  //! This can be used for access or assignment (e.g., ma[indices] = 1).
  inline E& operator[](const vector<int> &indices);

  //! Get the next element (used as an iterator).  Return true if at end.
  inline bool Increment(vector<int> &indices);

  //! This will not work correctly unless dimensions are preset correctly
  friend istream& operator>> (istream &is, MultiArray &ma) 
    { is >> ma.A; return is; }

  //! Just print out the vector
  friend ostream& operator<< (ostream &os, const MultiArray &ma)
    { os << ma.A; return os; }
};

 
#endif
