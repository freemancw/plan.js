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



#ifndef MSL_PLANNER_H
#define MSL_PLANNER_H

#include <list>
#include <vector>
#include <fstream>
using namespace std;



#include "solver.h"
#include "random.h"
#include "graph.h"
#include "tree.h"
#include "vector.h"
#include "util.h"

//! The base class for all path planners
class Planner: public Solver {
 protected:
  MSLRandomSource R;

  //! Choose a state at random
  MSLVector RandomState();

  //! Pick a state using a Normal distribution
  MSLVector NormalState(MSLVector mean, double sd);

 public:
  //! Total amount of time spent on planning
  double CumulativePlanningTime;

  //! Total amount of time spent on construction
  double CumulativeConstructTime;

  //! The solution path, as a list of states
  list<MSLVector> Path;

  //! The times associated with the path
  list<double> TimeList;

  //! The solution policy before the jump
  list<MSLVector> Policy1;

  //! The times associated with a solution path before the jump
  list<double> TimeList1;

  //! The solution policy after the jump
  list<MSLVector> Policy2;  

  //! The times associated with a solution path after the jump
  list<double> TimeList2;

  //! The last state in a path before a jump occurs
  MSLVector GapState1;

  //! The first state in a path after a jump occurs
  MSLVector GapState2;

  //! Set to true to ignore inputs and avoid integration (default false).
  //! This will make "regular" path planning much faster.
  bool Holonomic;

  //! How much gap error is allowed for each element in bidirectional search
  MSLVector GapError; 

  //! A search tree (used by incremental planners, but included in 
  //! Planner base to allow GuiPlanner to handle all planners)
  MSLTree *T;  

  //! A second tree (if needed)
  MSLTree *T2;
  
  //! A graph to represent a roadmap (used by roadmap planners, but 
  //! included in Planner base to allow GuiPlanner to handle all planners)
  MSLGraph *Roadmap;  

  //! The states associated with a solution path
  list<MSLVector> StateList;

  //! The inputs associated with a solution path
  list<MSLVector> InputList;

  //! Number of nodes to generate in a single execution of Plan or Construct
  int NumNodes;
  
  //! Time step to use for incremental planners
  double PlannerDeltaT;

  //! A constructor that initializes data members.
  Planner(Problem *problem);

  ~Planner();

  //! Reset the planner
  void Reset();

  //! Generate a planning graph
  virtual void Construct() = 0;

  //! Attempt to solve an Initial-Goal query
  virtual bool Plan() = 0;

  //! Write roadmap or trees to a file
  virtual void WriteGraphs(ofstream &fout) = 0;

  //! Read roadmap or trees from a file
  virtual void ReadGraphs(ifstream &fin) = 0;

  //! Determine if the gap error is staisfied
  bool GapSatisfied(const MSLVector &x1, const MSLVector &x2);
};


class IncrementalPlanner: public Planner {
 public:
  //! A constructor that initializes data members.
  IncrementalPlanner(Problem *problem);

  ~IncrementalPlanner() {};

  //! Essentially do nothing (no precomputation for incremental planners)
  virtual void Construct();

  //! Convert a path in the graph to Path and Policy
  void RecordSolution(const list<MSLNode*> &glist,
		      const list<MSLNode*> &g2list);

  void RecordSolution(const list<MSLNode*> &glist);

  //! Write trees to a file
  virtual void WriteGraphs(ofstream &fout);

  //! Read trees from a file
  virtual void ReadGraphs(ifstream &fin);
};


class RoadmapPlanner: public Planner {
 public:
  //! A constructor that initializes data members.
  RoadmapPlanner(Problem *problem);

  ~RoadmapPlanner() {};

  //! Write roadmap to a file
  virtual void WriteGraphs(ofstream &fout);

  //! Read roadmap from a file
  virtual void ReadGraphs(ifstream &fin);
};


#endif



