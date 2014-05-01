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



#ifndef MSL_SCENE_H
#define MSL_SCENE_H

#include "problem.h"
#include "util.h"

//! An interface class that gives Problem information to Render.
//! It tells the renderer how the "scene" appears for rendering
//! purposes, as opposed to collision-detection purposes.

/*!
This is an interface class that computes
configurations of all bodies to be displayed by a rendering method.
Currently, configuration information is passed through an instance of
Problem.  Thus, the base class for Scene is simply a wrapper to Problem.
*/

class Scene {
 protected:
  //! The Problem instance used by the planner/solver
  Problem *P;

 public:
  //! A common filepath
  string FilePath;

  //! The geometry dimension, 2 or 3
  int GeomDim;

  //! The number of bodies in the scene
  int NumBodies;

  //! Total degrees of freedom of the scene
  int SceneConfigurationDim;

  //! The smallest x,y,z world coordinates for the environment
  MSLVector LowerWorld;
  
  //! The largest x,y,z world coordinated for the environment
  MSLVector UpperWorld;

  //! The location of the default camera in x,y,z
  MSLVector GlobalCameraPosition;

  //! The direction the default camera is pointing with respect to the model
  MSLVector GlobalCameraDirection;

  //! The up direction of the default camera 
  MSLVector GlobalCameraZenith;

  //! The location of the body-attached camera in x,y,z
  MSLVector AttachedCameraPosition;

  //! The direction the body-attached camera is pointing
  MSLVector AttachedCameraDirection;

  //! The up direction of the body-attached camera 
  MSLVector AttachedCameraZenith;

  //! The index of the body to which the camera is attached (default = 0)
  int AttachedCameraBody;

  //! Scene must be initialized with the Problem that was passed to the planner
  Scene(Problem *problem, string path);
  
  //! Empty destructor
  virtual ~Scene() {};

  //! A method for changing the associated Problem
  void SetProblem(Problem *P);

  //! Convert the state into configurations for each body (a long MSLVector)
  virtual MSLVector StateToSceneConfiguration(const MSLVector &x);

  //! Interpolate the states; convert the result to a SceneConfiguratrion
  virtual MSLVector InterpolatedSceneConfiguration(const MSLVector &x1, 
						   const MSLVector &x2, 
						   const double &a);
};

#endif
