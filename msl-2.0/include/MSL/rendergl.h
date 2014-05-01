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



// RenderGL was written by Peng Cheng (chp@cs.iastate.edu)
// Modifications made by Steve LaValle (lavalle@cs.iatate.edu)

#ifndef MSL_RENDERGL_H
#define MSL_RENDERGL_H

//#include <GL/glut.h>
//#include <GL/gl.h>
#include "../../configs/configGLUT.h"
#include "../../configs/configGL.h"


//#include <vector.h>
//#include <string>

#include "render.h"
#include "triangle.h"
#include "renderglobj.h"
#include "vector.h"
#include "defs.h"
#include "util.h"
#include "mslio.h"

//! Perform 3D rendering using the GL and GLUT libraries
class RenderGL: public Render
{
 protected:
  vector<int> EnvIndex;
  vector<int> BodyIndex;

  float WindowX, WindowY, WindowZ;

  float BoundingBoxMin[3];
  float BoundingBoxMax[3];

  float Orientation[3];
  float Position[3];

  // view parameters
  float Fov, AspectRatio, Near, Far;
  float EyeX, EyeY, EyeZ;
  float VpX, VpY, VpZ;
  float VupX, VupY, VupZ;
  float ViewLength;  // the distance from the eye to the center of the scene

  // unit MSLVector for the viewer coordinate
  MSLVector VCoordZ, VCoordY, VCoordX;
  MSLVector VRpy;

  MSLVector DefVCoordZ, DefVCoordY, DefVCoordX;
  MSLVector DefVRpy;

  MSLVector RpyModification;

  // unit MSLVector for the scene coordinate
  MSLVector SCoordZ, SCoordY, SCoordX;

  // light position
  float LightPosX, LightPosY, LightPosZ;

  // number of object(robots and obstacles)
  int NumberOfObject;
  int NumberOfBody;
  int NumberOfEnvObj;

  // robot and obstacle model information list
  mslGLObject ** SceneBodyLib;
  mslGLObject ** SceneEnvObjLib;
  
  // used to control the original scale, position of object 
  MSLVector EnvTransform;
  MSLVector BodyTransform;

  // used for gui control
  int MainWindow;

  // control varibles
  int SelectObjectID;
  int CurrentObject;
 
  // mouse control parameter 
  int CurrentMouseButton, CurrentMouseState;
  int CurrentKeyboard;
  float LastX, LastY;
  float ChangeRate;
  float AnimationTimeScaleTmp;

  // method to load the configuration
  void LoadConfig();

  // method to add new object into scene
  void AddBodyObject(mslGLObject * obj);
  void AddEnvObject(mslGLObject * obj);

  // method to get object according to object ID
  mslGLObject* WhichObject(int id);
  void SceneRender();

  // method to set the position of light
  void SetLightPos();

  // method to set the change of orientation and position
  void SetSceneOrientationChange(const MSLVector& oric);
  void SetScenePositionChange(const MSLVector& posc);

  // method to set the body or environment obstacles' position and orientation
  void SetBodyState(const MSLVector& state);
  void SetEnvState(const MSLVector& state);

  // method to draw the bounding box
  void DrawBoundingBox();

  void DrawPath();

  void InitData();
  void InitGeometry(list<MSLTriangle> triangles);
  void DrawBodies(const MSLVector &x);
  void DrawEnv();
  void NormCrossProduct(float v1[3], float v2[3], float out[3]);
  void Normalize(float v[3]);

  void ShowCoordinateFrame();

 public: 
  Gui *G;

  RenderGL();
  RenderGL(string filepath);
  RenderGL(Scene *s, string filepath);
  virtual ~RenderGL();

  // method to reset the scene
  virtual void Reset();

  virtual void Init();
  virtual void MainLoop(Gui *g);

  static void GlutIdleProcessing();
  static void GlutDrawEnvironment();
  static void GlutReshape(int w, int h);
  static void GlutMouse(int button, int state, int x, int y);
  static void GlutMouseMove( int x, int y );
  static void GlutKeyboard(unsigned char Key, int x, int y);

};


#endif
