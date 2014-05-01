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



#ifndef MSL_FDP_H
#define MSL_FDP_H

#include <queue>
#include <vector>
using namespace std;


#include "marray.h"
#include "planner.h"
#include "tree.h"
#include "vector.h"
#include "defs.h"
#include "mslio.h"

#define UNVISITED 0
#define VISITED 1   // Visited by the first tree, G
#define COLLISION 2
#define VISITED2 3  // Visited by the second tree, G2
#define GOAL 4      // Lies in goal region (not used in base class)


/*! Forward Dynamic Programming, as proposed by Barraquand, Latombe, 
Algorithmica 10:6, pp. 121-155, 1993.  The solutions should be optimized 
with respect to time, although problems can be caused by quantization 
errors.

When an instance is constructed, a grid is initialized and each
element of checked for collision.  The test point for collision is the
center of the cell.  The current version does not use distance
computations; therefore, a large value for PlannerDeltaT might cause
collisions to be missed.

Make sure that PlannerDeltaT is large enough to allow the state to
move from one cell to another without in a single step.  For example,
if the quantization leads to a grid boundary every 2.0 units, then
PlannerDeltaT could be set to cause the state to change by 3.0 units.

GridDimensions sets the resolution of the grid and can be read from a file.
For high-dimensional problems an error message may occur due to a grid
that is too large.  To enable larger grids, set the MaxSize to a desirable
size in the MultiArray class (in marray.C).  */

//! A dynamic programming approach to nonholonomic planning, as proposed by Barraquand, Latombe, 
//! Algorithmica 10:6, pp. 121-155, 1993.

class FDP: public IncrementalPlanner {
 protected:

  //! Priority queue of nodes
  priority_queue<MSLNode*,vector<MSLNode*>,MSLNodeGreater> Q;

  //! A quantized state space
  MultiArray<int> *Grid;

  //! Dimensions for the grid
  vector<int> GridDimensions;

  //! Default size for each axis of the grid
  int GridDefaultResolution;

  //! The quantized step size for each axis (computed automatically)
  MSLVector Quantization;

  virtual double SearchCost(double initcost, 
			    MSLNode* &n, 
			    MSLNode* &nn);

  virtual vector<int> StateToIndices(const MSLVector &x);

  virtual MSLVector IndicesToState(const vector<int> &indices);

  public:

  //! A constructor that initializes data members.
  FDP(Problem *problem);

  //! Empty destructor
  ~FDP() {};
  
  //! Number of times the collision checker has been called
  int SatisfiedCount;

  //! Reset the planner
  virtual void Reset();

  //! Attempt to solve an Initial-Goal query by growing an FDP tree
  virtual bool Plan();

};



//! An A-Star search variant. The Metric in Problem is used as the cost.
class FDPStar: public FDP {
 protected:
  virtual double SearchCost(double initcost, 
			    MSLNode* &n, 
			    MSLNode* &nn);
 public:
  FDPStar(Problem *p);
};
 

//! Best first search variant, using the Metric in Problem.
class FDPBestFirst: public FDP {
 protected:
  virtual double SearchCost(double initcost, 
			    MSLNode* &n, 
			    MSLNode* &nn);
 public:
  FDPBestFirst(Problem *p);
};


//! A bidirectional version of forward dynamic programming
class FDPBi: public FDP {
 protected:

  //! Priority queue of nodes
  priority_queue<MSLNode*,vector<MSLNode*>,MSLNodeGreater> Q2;

  //! Pull out the path and timings from the graphs
  void RecoverSolution(MSLNode* &n1, MSLNode* &n2);

 public:

  //! A constructor that initializes data members.
  FDPBi(Problem *problem);

  //! Empty destructor
  ~FDPBi() {};

  //! Reset the planner
  virtual void Reset();

  //! Attempt to solve an Initial-Goal query by growing an FDP
  virtual bool Plan();
};


#endif


