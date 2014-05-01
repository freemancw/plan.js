//----------------------------------------------------------------------
//               The Motion Strategy Library (MSL)
//----------------------------------------------------------------------
//
// Copyright (c) University of Illinois and Steven M. LaValle.     
// All Rights Reserved.
// 
// Permission to use, copy, and distribute this software and its 
// documentation is hereby granted free of charge, provided that 
// (1) it is not a component of a commercial product, and 
// (2) this notice appears in all copies of the software and
//     related documentation. 
// 
// The University of Illinois and the author make no representations
// about the suitability or fitness of this software for any purpose.  
// It is provided "as is" without express or implied warranty.
//----------------------------------------------------------------------

#include "marray.h"


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





