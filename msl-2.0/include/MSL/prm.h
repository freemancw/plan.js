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



#ifndef MSL_PRM_H
#define MSL_PRM_H

#include <queue>

#include "planner.h"
#include "util.h"
#include "disjointsets.h"


/*! The base class for planners based on the Probabilistic Roadmap Planner (PRM)
  framework of Kavraki, Svestka, Latombe, Overmars, 1994.  In the base class,
  only Holonomic planning problems can be solved (i.e., standard path planning,
  without differential constraints).

*/

//! A probabilistic roadmap planner, proposed by Kavraki, Svestka, Latombe, Overmars, 1994
class PRM: public RoadmapPlanner {
 protected:
  virtual list<MSLVertex*> NeighboringVertices(const MSLVector &x);
  virtual bool Connect(const MSLVector &x1, const MSLVector &x2, MSLVector &u);
  virtual MSLVector ChooseState(int i, int maxnum, int dim);
  MSLVector QuasiRandomStateHammersley(int i, int maxnum, int dim);
  MSLVector QuasiRandomStateHalton(int i, int dim);
  MSLVector QuasiRandomStateSukharev(int i, int maxnum, int dim);
  //! Computed from DeltaT using the model
  double StepSize;  // Derived from DeltaT using the model
  int MaxNeighbors;
  int MaxEdgesPerVertex;
 public:

  //! Used for deciding on which neighbors to choose
  double Radius;

  //! The disjoint sets data structure (for connected components)
  DisjointSets<MSLVertex*> ds;

  //! Number of times the collision checker has been called
  int SatisfiedCount;

  //! If true, then quasirandom sampling is used (make a file named QuasiRandom)
  bool QuasiRandom;

  //! If true, then use Sukharev grid sampling
  bool QuasiRandomSukharev;

  //! l-infinity dispersion used for Sukharev sampling
  double SukharevDispersion;

  //! Points per axis for the Sukharev grid
  int SukharevPointsPerAxis;

  //! Choose Hammersley, over Halton sequence
  bool QuasiRandomHammersley;

  //! A constructor that initializes data members.
  PRM(Problem *problem);

  //! Empty destructor
  virtual ~PRM() {};

  //! Build a PRM
  virtual void Construct();

  //! Try to solve a planning query using an existing PRM
  virtual bool Plan();
};


#endif

