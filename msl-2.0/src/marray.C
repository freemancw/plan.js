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



#include "MSL/marray.h"


template<class E> MultiArray<E>::MultiArray(const vector<int> &dims, 
					    const E &x) {
  int i,offset;

  MaxSize = 10000000; // Maximum allowable size
  Dimensions = dims;
  Dimension = dims.size();
  
  Offsets = vector<int>(Dimension);

  offset = 1;
  for (i = 0; i < Dimension; i++) {
    Offsets[i] = offset;
    offset *= Dimensions[i];
  }

  Size = offset;

  if (Size <= MaxSize) {
    // Make the array to hold all of the data
    A = vector<E>(Size);
    for (i = 0; i < Size; i++)
      A[i] = x; // Write the value x to all elements
  }
  else {
    cout << "Size " << Size << " exceeds MaxSize limit " << MaxSize << "\n";
    exit(-1);
  }

}


template<class E> MultiArray<E>::MultiArray(const vector<int> &dims) {
  E x;

  MultiArray(dims,x);
}


template<class E> inline E& MultiArray<E>::operator[](const vector<int> 
						      &indices) {
  int i,index;

  index = indices[0];

  for (i = 1; i < Dimension; i++) {
    index += indices[i]*Offsets[i];
  }

  return A[index];
}


template<class E> inline bool MultiArray<E>::Increment(vector<int> &indices) {
  int i;
  bool carry,done;

  carry = false;
  done = false;

  if (indices[0] < Dimensions[0] - 1)
    indices[0]++;
  else { // Carry
    indices[0] = 0;
    carry = true;
    i = 1;
    while ((carry)&&(i < Dimension)) {
      if (indices[i] < Dimensions[i] - 1) {
	indices[i]++;
	carry = false;
      }
      else {
	indices[i] = 0;
	if (i == Dimension - 1)
	  done = true;
      }
      i++;
    }
  }

  // This will report true if the end of array was reached
  return done;
}





