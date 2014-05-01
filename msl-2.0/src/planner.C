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



#include <math.h>
#include <stdio.h>

#include "MSL/planner.h"
#include "MSL/defs.h"


// *********************************************************************
// *********************************************************************
// CLASS:     Planner base class
// 
// *********************************************************************
// *********************************************************************

Planner::Planner(Problem *problem):Solver(problem) {
  T = NULL;
  T2 = NULL;
  Roadmap = NULL;
  Reset();
}


Planner::~Planner() {
  Reset();
}

void Planner::Reset() {
  int i;

  NumNodes = 1000;
  std::ifstream fin;

  READ_PARAMETER_OR_DEFAULT(PlannerDeltaT,1.0);

  GapError = MSLVector(P->StateDim);
  for (i = 0; i < P->StateDim; i++)
    GapError[i] = 1.0;
  READ_OPTIONAL_PARAMETER(GapError);

  Path.clear();
  TimeList.clear();
  Policy1.clear();
  TimeList1.clear();
  Policy2.clear();
  TimeList2.clear();

  fin.open((FilePath+"Holonomic").c_str());
  Holonomic = fin ? true : false; // Nonholonomic by default
  fin.close();

  CumulativePlanningTime = 0.0;
  CumulativeConstructTime = 0.0;

  if (T)
    delete T;
  if (T2)
    delete T2;
  T = NULL;
  T2 = NULL;

  if (Roadmap)
    delete Roadmap;
  Roadmap = NULL;
}


MSLVector Planner::RandomState() {
  int i;
  double r;
  MSLVector rx;

  rx = P->LowerState;
  for (i = 0; i < P->StateDim; i++) {
      R >> r; 
      rx[i] += r * (P->UpperState[i] - P->LowerState[i]);
    }

  return rx;
}



MSLVector Planner::NormalState(MSLVector mean, double sd = 0.5) {
  int i,j;
  double r;
  MSLVector rx;
  bool success = false;

  rx = mean;
  for (i = 0; i < P->StateDim; i++) {
    success = false;
    while (!success) {
      rx[i] = 0.0;
      for (j = 0; j < 12; j++) {  // Increase 12 here and below for more accuracy
	R >> r; rx[i] += r;
      }
      rx[i] = (rx[i] - 12/2)*sd*(P->UpperState[i]-P->LowerState[i])+mean[i];
      if ((rx[i] <= P->UpperState[i])&&(rx[i] >= P->LowerState[i]))
	success = true;
    }
  }

  return rx;
}



bool Planner::GapSatisfied(const MSLVector &x1, const MSLVector &x2) {
  MSLVector x;
  int i;

  x = P->StateDifference(x1,x2);
  for (i = 0; i < P->StateDim; i++) {
    if (fabs(x[i]) > GapError[i])
      return false;
  }

  return true;
}



// *********************************************************************
// *********************************************************************
// CLASS:     IncrementalPlanner base class
// 
// *********************************************************************
// *********************************************************************

IncrementalPlanner::IncrementalPlanner(Problem *problem):Planner(problem) {
}

void IncrementalPlanner::Construct() {
  cout << "  Incremental planners do not use Construct.\n";
  cout << "  Try Plan.\n";
}


void IncrementalPlanner::RecordSolution(const list<MSLNode*> &glist, 
					const list<MSLNode*> &g2list)
{
  list<MSLNode*>::const_iterator n,nfirst,nlast;
  double ptime;

  Path.clear();
  TimeList.clear();
  Policy1.clear();
  TimeList1.clear();
  Policy2.clear();
  TimeList2.clear();

  ptime = 0.0; 
  nfirst = glist.begin();

  forall(n,glist) {
    Path.push_back((*n)->State());
    if (n != nfirst) {
      Policy1.push_back((*n)->Input());
      TimeList1.push_back(PlannerDeltaT);
    }
    ptime += (*n)->Time();
    TimeList.push_back(ptime);
  }

  // The GapState is always comes from last node in glist
  GapState1 = Path.back();

  if(g2list.size() == 0)
    GapState2 = P->GoalState;
  else
    GapState2 = (*(g2list.begin()))->State();

  if (g2list.size() == 0) {
    // Push the goal state onto the end (jumps the gap)
    Path.push_back(P->GoalState);
  }
  else { // Using two graphs
    ptime += PlannerDeltaT; // Add a time step for the gap
    nlast = g2list.end();
    forall(n,g2list) {
      Path.push_back((*n)->State());
      if (n != nlast) {
	Policy2.push_back((*n)->Input());
        TimeList2.push_back(PlannerDeltaT);
      }
      TimeList.push_back(ptime);
      ptime += (*n)->Time();
    }
  }

  //cout << "Path: " << Path << "\n";
  //cout << "Policy: " << Policy << "\n";
  //cout << "TimeList: " << TimeList << "\n";
}



void IncrementalPlanner::RecordSolution(const list<MSLNode*> &glist)
{
  list<MSLNode*> emptylist;
  emptylist.clear(); // Make sure it is clear

  RecordSolution(glist,emptylist);
}



void IncrementalPlanner::WriteGraphs(ofstream &fout)
{
  if (T)
    fout << *T << "\n\n\n";
  if (T2)
    fout << *T2;
}



void IncrementalPlanner::ReadGraphs(ifstream &fin)
{
  if (T)
    delete T;
  if (T2)
    delete T2;

  T = new MSLTree();
  T2 = new MSLTree();

  fin >> *T;
  cout << "T \n" << *T << endl;
  fin >> *T2;
}




// *********************************************************************
// *********************************************************************
// CLASS:     RoadmapPlanner base class
// 
// *********************************************************************
// *********************************************************************

RoadmapPlanner::RoadmapPlanner(Problem *problem):Planner(problem) {
}




void RoadmapPlanner::WriteGraphs(ofstream &fout)
{
  fout << *Roadmap << "\n\n\n";
}



void RoadmapPlanner::ReadGraphs(ifstream &fin)
{
  if (Roadmap)
    delete Roadmap;

  Roadmap = new MSLGraph();
  fin >> *Roadmap;
}





