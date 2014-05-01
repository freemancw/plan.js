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



// This file is used to put the classes holding the extra information in
// the node in the search tree.
// Written by Peng Cheng (pcheng1@cs.uiuc.edu) 1/14/2002
 
#ifndef MSL_NODEINFO_H
#define MSL_NODEINFO_H

#include "vector.h" 

//! The information holded in this class is explained in "Reducing
//! Metric Sensitivity in Randomized Trajectory Design" in IEEE/RSJ
//! International Conference on Intelligent Robots and Systems, 2001

class RCRRTNodeInfo{

 private:
  //! Exploration information 
  MSLVector explorationinfo;

  //! Path collision tendency 
  double collisiontendency;

 public:

  //! Get the exploration information
  MSLVector GetExplorationInfo() {return explorationinfo; };

  //! Set the exploration information
  void SetExplorationInfo(MSLVector& exploreinfo) {
    explorationinfo = exploreinfo;
  };

  //! Get the collision tendency information
  double GetCollisionTendency() {return collisiontendency; };

  //! Set the collision tendency information
  void SetCollisionTendency(double& collisioninfo) {
    collisiontendency = collisioninfo;
  };

  RCRRTNodeInfo() { };
  RCRRTNodeInfo(const MSLVector& exploreinfo, const double& collisioninfo ){
    explorationinfo = exploreinfo;
    collisiontendency = collisioninfo;
  };
  ~RCRRTNodeInfo();

};

#endif


