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



#ifndef MSL_MODEL3D_H
#define MSL_MODEL3D_H

#include <vector>

#include "model.h"
#include "matrix.h"

//! A base class for all models in 3D worlds
class Model3D: public Model {
 public:
  Model3D(string path);
  virtual ~Model3D() {}
};



//! A rigid robot in a 3D world
class Model3DRigid: public Model3D {
 public:
  Model3DRigid(string path);
  virtual ~Model3DRigid() {}
  virtual MSLVector Integrate(const MSLVector &x, const MSLVector &u, const double &h);
  MSLVector StateTransitionEquation(const MSLVector &x, const MSLVector &u);
  virtual double Metric(const MSLVector &x1, const MSLVector &x2);
  virtual MSLVector LinearInterpolate(const MSLVector &x1, const MSLVector &x2, 
				   const double &a);  // Depends on topology
  virtual MSLVector StateDifference(const MSLVector &x1, const MSLVector &x2); 
};


//! A collection of free-floating bodies in a 3D world
class Model3DRigidMulti: public Model3DRigid {
 public:
  int NumBodies;
  Model3DRigidMulti(string path);
  virtual ~Model3DRigidMulti() {}
  virtual double Metric(const MSLVector &x1, const MSLVector &x2);
  virtual MSLVector Integrate(const MSLVector &x, const MSLVector &u, const double &h);
  virtual MSLVector LinearInterpolate(const MSLVector &x1, const MSLVector &x2, 
				   const double &a);  // Depends on topology
  virtual MSLVector StateDifference(const MSLVector &x1, const MSLVector &x2); 
};


/*! A 3D kinematic chain of bodies that uses DH parameters that should
  be given in a DH file in the following order: Alpha(1,2...),
  Theta(1,2...), A(1,2...), D(1,2...). Some of these parameters change
  during the movement, and each of these parameters becomes a state
  variable.  The indices of these parameters should be given in
  the file StateIndices (i.e., each entry corresponds to a state, and
  indicates which DH parameter is variable).
*/



//! A 3D kinematic chain of bodies that uses DH parameters
class Model3DRigidChain: public Model3DRigid {
 public:
  //! Number of bodies in the chain
  int NumBodies;

  //! The distances between joints ("a" parameters in kinematics)
  MSLVector DH;

  vector<int> StateIndices;

  Model3DRigidChain(string path);
  virtual ~Model3DRigidChain() {};
  virtual MSLVector StateTransitionEquation(const MSLVector &x, 
					    const MSLVector &u);
  virtual MSLVector StateToConfiguration(const MSLVector &x);
  virtual double Metric(const MSLVector &x1, const MSLVector &x2);
  virtual bool Satisfied(const MSLVector &x);
};


/*! A 3D kinematic tree of bodies that uses DH parameters which should
be given in a DH file in the following order: Alpha(1,2...),
Theta(1,2...), A(1,2...), D(1,2...).  Some of these parameters change
during the movement, and each of these parameters becomes a state
variable.  The indices of these parameters should be given in the file
StateIndices (i.e., each entry corresponds to a state, and indicates
which DH parameter is variable).  For each body in the tree, the parent
body in the tree should be indicated.  This is specified in the file
Parents.  Each entry in Parents corresponds to a body (the i^th
element is Robot i).  The first entry is the root (this index is
ignored because the root has no parent).  The bodies in the tree must
be arranged so that the indices in Parents are in nondecrreasing order
(corresponding, for example to a depth-first search of the tree). 
*/

//! A 3D kinematic tree of bodies that uses DH parameters
class Model3DRigidTree: public Model3DRigid {
 public:
  //! Number of bodies in the tree
  int NumBodies;

  //! The distances between joints ("a" parameters in kinematics)
  MSLVector DH;

  vector<int> StateIndices;

  vector<int> Parents;

  Model3DRigidTree(string path);
  virtual ~Model3DRigidTree() {};
  virtual MSLVector StateTransitionEquation(const MSLVector &x, 
					    const MSLVector &u);
  virtual MSLVector StateToConfiguration(const MSLVector &x);
  virtual double Metric(const MSLVector &x1, const MSLVector &x2);
  virtual bool Satisfied(const MSLVector &x);
};


#endif
