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



#ifndef MSL_GEOMPQP_H
#define MSL_GEOMPQP_H

#include <list>
#include <vector>

#include "../../configs/configPQP.h"

#include <cstdlib>
#include <cstdio>

#include <string.h>

#include "defs.h"
#include "geom.h"
#include "point.h"  // This includes the MSLPolygon class
#include "triangle.h"

// OK, this is bad.  The maximum number should be dynamic, but PQP
// really seems to want a static matrix.
#define MAXBODIES 100

//! Parent class PQP-based list of Triangle models

class GeomPQP: public Geom {
 protected:
  PQP_REAL RR[3][3],RO[3][3];
  PQP_REAL TR[3],TO[3];  
 public:
  list<MSLTriangle> Obst;
  list<MSLTriangle> Robot;
  PQP_Model Ro, Ob;
  GeomPQP(string path);
  virtual ~GeomPQP() {};
  virtual void LoadEnvironment(string path);
  virtual void LoadRobot(string path);
  virtual bool CollisionFree(const MSLVector &q){return true;} 
  virtual double DistanceComp(const MSLVector &q){return 10000.0;}
};

//! A parent class for 2D PQP geometries

class GeomPQP2D: public GeomPQP {
 public:
  list<MSLPolygon> ObstPolygons;
  list<MSLPolygon> RobotPolygons;
  GeomPQP2D(string path);
  virtual ~GeomPQP2D() {};
  virtual void LoadEnvironment(string path);
  virtual void LoadRobot(string path);
};


//! 2D rigid body 

class GeomPQP2DRigid: public GeomPQP2D {
 public:
  GeomPQP2DRigid(string path);
  virtual ~GeomPQP2DRigid() {};
  virtual bool CollisionFree(const MSLVector &q); // Input is configuration
  virtual double DistanceComp(const MSLVector &q);  // Distance in world
  virtual MSLVector ConfigurationDifference(const MSLVector &q1, 
					      const MSLVector &q2); 
  void SetTransformation(const MSLVector &q); // Input is configuration
};


//! A collection of 2D rigid bodies
class GeomPQP2DRigidMulti: public GeomPQP2DRigid {
 private:
  vector<list<MSLTriangle> > Robot;
  vector<PQP_Model> Ro;
  list<MSLVector> CollisionPairs; // Index pairs to check for collision
  PQP_REAL TR[MAXBODIES][3];  // Robot translation
  PQP_REAL RR[MAXBODIES][3][3];  // Robot rotation
 public:
  bool SelfCollisionCheck;
  GeomPQP2DRigidMulti(string path);
  virtual ~GeomPQP2DRigidMulti() {};
  virtual bool CollisionFree(const MSLVector &q); // Input is configuration
  virtual double DistanceComp(const MSLVector &q);  // Distance in world
  virtual void LoadRobot(string path); // Load multiple robots
  void SetTransformation(const MSLVector &q); // Input is configuration
};


//! 3D rigid body
class GeomPQP3DRigid: public GeomPQP {
 public:
  GeomPQP3DRigid(string path);
  virtual ~GeomPQP3DRigid() {};
  virtual bool CollisionFree(const MSLVector &q); // Input is configuration
  virtual double DistanceComp(const MSLVector &q);  // Distance in world
  virtual MSLVector ConfigurationDifference(const MSLVector &q1, 
					      const MSLVector &q2); 
  void SetTransformation(const MSLVector &q); // Input is configuration
};


//! A collection of 3D rigid modies
class GeomPQP3DRigidMulti: public GeomPQP3DRigid {
 private:
  vector<list<MSLTriangle> > Robot;
  vector<PQP_Model> Ro;
  list<MSLVector> CollisionPairs; // Index pairs to check for collision
  PQP_REAL TR[MAXBODIES][3];  // Robot translation
  PQP_REAL RR[MAXBODIES][3][3];  // Robot rotation
 public:
  bool SelfCollisionCheck;
  GeomPQP3DRigidMulti(string path);
  virtual ~GeomPQP3DRigidMulti() {};
  virtual bool CollisionFree(const MSLVector &q); // Input is configuration
  virtual double DistanceComp(const MSLVector &q);  // Distance in world
  virtual void LoadRobot(string path); // Load multiple robots
  void SetTransformation(const MSLVector &q); // Input is configuration
};

#endif



