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



#ifndef MSL_RENDERIV_H
#define MSL_RENDERIV_H


// MSL includes
#include "triangle.h"
#include "render.h"
#include "point.h"
#include "vector.h"
#include "renderglobj.h"
#include <Xm/Xm.h>
#include <Inventor/Xt/SoXt.h>

// Inventor classes
class SoSeparator;
class SoXtExaminerViewer;
class SoSensor;
class SoTransform;
class SoSwitch;
class SoVertexProperty;
class SoCamera;
class SoPerspectiveCamera;
class SoOrthographicCamera;
class SoPointLight;
class SoRotation;
//-----------------------------------------------------------------
//                       Class RenderIv
//
//! Perform 3D rendering using the OpenInventor library
//
//-----------------------------------------------------------------
class RenderIv: public Render
{
public: 
  
  // Constructors & Destructor
  RenderIv();
  RenderIv(string filepath);
  RenderIv(Scene *s, string filepath);
  virtual ~RenderIv();
  
  // method to reset the scene
  virtual void Reset();
 
  // initialization
  virtual void Init();
  virtual void MainLoop(Gui *g);
  
  
protected:

 // event callbacks
  static void  _TimerCB(void* userData, SoSensor*);
  inline void  _IdleFunction();

 // initialization
  SoSeparator* _ReadIvFile(const char *filename);
  SoSeparator* _InitObject(const string &fname);
  bool         _InitBoundsDisplay();
  bool         _InitPathDisplay();
  SoSeparator* _InitTriangleGeom(list<MSLTriangle> &triangles);
  bool         _InitData();

 // helper methods
  inline void  _SetSwitch(SoSwitch *pSwitch, bool bFlag);
  inline void  _UpdatePathDisplay();
  inline void  _SetTransform(SoTransform* pTrans,
			     double tx, double ty, double tz,
			     double rx, double ry, double rz);
  inline void  _UpdateBodies(const MSLVector &qConfig);
 

 // Data

  SoXtExaminerViewer*  _viewer;         // the viewer window
  Gui*                 _pGui;           // gui pointer

  SoSeparator*         _ivRoot;         // scene graph root
  SoSeparator*         _ivData;         // root of all scene data

  SoSwitch*            _ivBoundsSwitch; // workspace boundary display
  bool                 _bDisplayBounds;

  SoSwitch*            _ivPathSwitch;   // path display
  SoVertexProperty*    _pPathVertexProp;
  int                  _pathFrames;
  bool                 _bDisplayPath;

  list<SoTransform*>   _bodyTrans;      // list of body transforms

  //for AttachedCamera
  int                  camToggle;
  bool                 _bAttachedCamera;
  SoSwitch*            CamSwitch;
  SoPerspectiveCamera* defCam;
  SoPerspectiveCamera* attachedCam;
  SoPointLight*        lightSource;
  float                _ivPosition[3];
  float                _ivOrientation[3];
  float                _ivBoundingBoxMin[3];
  float                _ivBoundingBoxMax[3];
  float                _ivSceneCenter[3];
  float                CamPosX;
  float                CamPosY;
  float                CamPosZ;
  float                CamViewX;
  float                CamViewY;
  float                CamViewZ;
  float                _ivViewLength;
  float                _ivFocalDist;
  float                _ivNearDist;
  float                _ivFarDist;
  float                LightPosX;
  float                LightPosY;
  float                LightPosZ;
  float                CamUpX;
  float                CamUpY;
  float                CamUpZ;
  
  //for multiple views
  bool                 _bMultipleViews;
  SoSeparator*         _ivTopLeftObject;
  SoSeparator*         _ivTopRightObject;
  SoSeparator*         _ivBottomLeftObject;
  SoSeparator*         _ivBottomRightObject;
  int                  MultipleViewsToggle;
  SoXtExaminerViewer*  TopLeftViewer;
  SoXtExaminerViewer*  TopRightViewer;
  SoXtExaminerViewer*  BottomLeftViewer;
  SoXtExaminerViewer*  BottomRightViewer;
  Widget               mainWindow;  
  SoOrthographicCamera*            TopLeftCamera;
  SoOrthographicCamera*            TopRightCamera;
  SoOrthographicCamera*            BottomLeftCamera;
  SoPerspectiveCamera*             BottomRightCamera;

};

#endif



