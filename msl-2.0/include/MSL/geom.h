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



#ifndef MSL_GEOM_H
#define MSL_GEOM_H


// The world places objects using configuration (model uses state).
// Each derived class can define Obst and Robot however it likes.
// Methods such as "GeomToPolygons" can give output in whatever 
//  format is requested.  So far, only list<polygon> is shown,
//  but we could imagine an OpenInventor model, Geomview model, etc.

//! Geometric models and collision detection methods.

/*!  These classes define the geometric representations of all obstacles in
the world, and of each part of the robot.  The methods allow planning
algorithms to determine whether any of the robot parts are in
collision with each other or with obstacles in the world.  

A configuration vector specifies the positions and orientation of each
rigid body.
*/

//#include <list.h>
#include <string>

#include "vector.h"
#include "util.h"

class Geom {
 protected:
  string FilePath;
 public:
  //! Empty constructor in base class
  Geom(string path);

  //! Empty destructor
  virtual ~Geom() {};

  //! The number of rigid bodies in the geometry model
  int NumBodies;

  //! The dimension of the world geometry: 2 or 3
  int GeomDim;

  //! Return true if the robot(s) and obstacles are not in collision
  virtual bool CollisionFree(const MSLVector &q) = 0; // Input is configuration

  //! Compute the distance of the closest point on the robot to the
  //! obstacle region.
  virtual double DistanceComp(const MSLVector &q) = 0;  // Distance in world

  //! Maximum displacement of geometry with respect to change in each variable
  MSLVector MaxDeviates;

  //! Compute a MSLVector based on q2-q1.  In R^n, the configurations are simply
  //! subtracted to make the MSLVector.  This method exists to make things
  //! work correctly for other configuration-space topologies.
  virtual MSLVector ConfigurationDifference(const MSLVector &q1, 
					    const MSLVector &q2); 
};


//! A class with no geometry -- a collision never happens
class GeomNone: public Geom {
 public:
  GeomNone(string path);
  virtual ~GeomNone() {};
  virtual bool CollisionFree(const MSLVector &q){return true;} 
  virtual double DistanceComp(const MSLVector &q){return 10000.0;}
};

#endif
