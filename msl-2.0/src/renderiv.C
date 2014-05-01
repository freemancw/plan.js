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



// Standard includes
#include <math.h>
#include <stdlib.h>
#include <assert.h>

// OpenInventor includes
#include <Xm/Xm.h>
#include <Xm/Form.h>
#include <Inventor/Xt/SoXt.h>
#include <Inventor/SoDB.h>
#include <Inventor/Xt/viewers/SoXtExaminerViewer.h>
#include <Inventor/nodes/SoTransform.h>
#include <Inventor/nodes/SoSeparator.h>
#include <Inventor/nodes/SoCamera.h>
#include <Inventor/nodes/SoIndexedFaceSet.h>
#include <Inventor/nodes/SoMaterial.h>
#include <Inventor/nodes/SoLineSet.h>
#include <Inventor/nodes/SoSwitch.h>
#include <Inventor/sensors/SoTimerSensor.h>
#include <Inventor/fields/SoMFInt32.h>

//Added for AttachedCamera
#include <Inventor/nodes/SoPerspectiveCamera.h>
#include <Inventor/nodes/SoDirectionalLight.h>
#include <Inventor/nodes/SoPointLight.h>

//Added for MultipleViews
#include <Inventor/nodes/SoOrthographicCamera.h>
#include <Inventor/nodes/SoRotationXYZ.h>
#include <Inventor/nodes/SoScale.h>
#include <Inventor/nodes/SoTranslation.h>
#include <Inventor/nodes/SoRotation.h>
#include <Inventor/fields/SoSFVec3f.h>

// MSL includes
#include "MSL/renderiv.h"
#include "MSL/defs.h"

// default viewer dimensions
const short DEF_VIEWER_WIDTH  = 500;
const short DEF_VIEWER_HEIGHT = 400;
const short MULTIPLE_VIEWER_WIDTH = 450;
const short MULTIPLE_VIEWER_HEIGHT = 350;
RenderIv *RIV;

//---------------------------------------------------------------------
//                       RenderIv
//
// Method:  Constructors
//
//---------------------------------------------------------------------
RenderIv::RenderIv(): Render()
{
  ControlFreak = true;
  _ivRoot = NULL;
  _ivData = NULL;
  RIV = this;
}


RenderIv::RenderIv(string filepath=""): Render(filepath)
{
  ControlFreak = true;
  _ivRoot = NULL;
  _ivData = NULL;
  RIV = this;
}


RenderIv::RenderIv(Scene *s, string filepath): Render(s,filepath)
{
  ControlFreak = true;
  _ivRoot = NULL;
  _ivData = NULL;
  RIV = this;
}


//---------------------------------------------------------------------
//                       RenderIv
//
// Method:  Destructor
//
//---------------------------------------------------------------------
RenderIv::~RenderIv()
{
  if (_ivRoot)
    _ivRoot->unref();
  // inventor garbage collection should take care of deleting
  // this and all of the other scene graph nodes
}


//---------------------------------------------------------------------
//                       RenderIv
//
// Method:  Reset
//
//---------------------------------------------------------------------
void RenderIv::Reset()
{
  // Use reset from base class
  Render::Reset();

  // clear all data
  if (_ivData)
    _ivData->removeAllChildren();
}



//---------------------------------------------------------------------
//                       RenderIv
//
// Method:  Init
//
//---------------------------------------------------------------------
void RenderIv::Init()
{
  Render::Init();

  // initialize Xt and Inventor. This returns a main window to use
  const char* MAIN_WINDOW_TITLE = "MSL Library   University of Illinois";
  mainWindow = SoXt::init(MAIN_WINDOW_TITLE);
  if (!mainWindow) {
    exit(1);
  }

  Widget form;
  int n;
  Arg args[10];
  form = XtCreateWidget("form", xmFormWidgetClass, mainWindow, NULL, 0);

  _ivPosition[0] = 0.0;
  _ivPosition[1] = 0.0;
  _ivPosition[2] = 0.0;
  _ivOrientation[0] = 0.0;
  _ivOrientation[1] = 0.0;
  _ivOrientation[2] = 0.0;

  _ivBoundingBoxMin[0] = S->LowerWorld[0];
  _ivBoundingBoxMin[1] = S->LowerWorld[1];
  _ivBoundingBoxMin[2] = S->LowerWorld[2];

  _ivBoundingBoxMax[0] = S->UpperWorld[0];
  _ivBoundingBoxMax[1] = S->UpperWorld[1];
  _ivBoundingBoxMax[2] = S->UpperWorld[2];

  _ivSceneCenter[0] = (_ivBoundingBoxMin[0] + _ivBoundingBoxMax[0])/2.0;
  _ivSceneCenter[1] = (_ivBoundingBoxMin[1] + _ivBoundingBoxMax[1])/2.0;
  _ivSceneCenter[2] = (_ivBoundingBoxMin[2] + _ivBoundingBoxMax[2])/2.0;

  CamPosX = (_ivBoundingBoxMax[0] + _ivBoundingBoxMin[0])/2.0;  
  CamPosY = (_ivBoundingBoxMax[1] + _ivBoundingBoxMin[1])/2.0;  
  CamPosZ = _ivBoundingBoxMax[2] + (_ivBoundingBoxMax[1]-_ivBoundingBoxMin[1])/tan(38.0/180.0*PI) + 10;

  CamViewX = (_ivBoundingBoxMax[0] + _ivBoundingBoxMin[0])/2.0;
  CamViewY = (_ivBoundingBoxMax[1] + _ivBoundingBoxMin[1])/2.0; 
  CamViewZ = (_ivBoundingBoxMax[2] + _ivBoundingBoxMin[2])/2.0;

  _ivNearDist = 1.0;
  _ivFarDist = 100000.0;
  _ivFocalDist = 45.0;

  LightPosX = CamPosX;
  LightPosY = CamPosY + (_ivBoundingBoxMax[1] - _ivBoundingBoxMin[1]);
  LightPosZ = _ivBoundingBoxMax[2] + (_ivBoundingBoxMax[1]-_ivBoundingBoxMin[1])/tan(38.0/180.0*PI)/2.0;

  //setting the view length
  _ivViewLength = CamPosZ - CamViewZ;

  //create the root of the scene
  _ivRoot = new SoSeparator;
  _ivRoot->ref();

  //create the main perspective viewer in which to see our scene graph
  //The viewer will appear within the main window
  _viewer = new SoXtExaminerViewer(form);

  _viewer->setTitle(MAIN_WINDOW_TITLE);
  
  //Added for AttachedCamera 
  //This switch node would enabling switching between global and attached camera positions
  CamSwitch = new SoSwitch;
  _ivRoot->addChild(CamSwitch);

  //This is the default camera
  defCam = new SoPerspectiveCamera;
  CamSwitch->addChild(defCam);
  defCam->position.setValue(0.0, 3.0, 5.0);
  defCam->pointAt(SbVec3f(0.0, 0.0, 0.0));
  defCam->focalDistance.setValue(_ivFocalDist);
  defCam->nearDistance.setValue(_ivNearDist);
  defCam->farDistance.setValue(_ivFarDist);

  attachedCam = new SoPerspectiveCamera;
  CamSwitch->addChild(attachedCam);
  attachedCam->position.setValue(2.0, 0.0, .0);
  attachedCam->pointAt(SbVec3f(2.0, -2.0, 0.0));
  
  lightSource = new SoPointLight;
  _ivRoot->addChild(lightSource);
  lightSource->location.setValue(LightPosX, LightPosY, LightPosZ);

  //Setting the default camera as the active camera
  CamSwitch->whichChild = 0;
  camToggle=0;

  //setting the Attached Camera toggle switch to OFF (false)
  _bAttachedCamera = false;

  //******************************************************************
  //** Code added for Multiple Views
  //** creating the four scene graphs for Multiple Views
  //******************************************************************
  
  _ivTopLeftObject = new SoSeparator;  
  _ivTopLeftObject->ref();
  //setting the specifications for the TopLeftCamera;
  TopLeftCamera = new SoOrthographicCamera;
  _ivTopLeftObject->addChild(TopLeftCamera);
  
  _ivTopRightObject = new SoSeparator;
  _ivTopRightObject->ref();
  //setting the specifications for the TopRightCamera
  TopRightCamera = new SoOrthographicCamera;
  _ivTopRightObject->addChild(TopRightCamera);
  

  _ivBottomLeftObject = new SoSeparator;
  _ivBottomLeftObject->ref();
  //setting the specifications for the BottomLeftCamera
  BottomLeftCamera = new SoOrthographicCamera;
  _ivBottomLeftObject->addChild(BottomLeftCamera);
  

  _ivBottomRightObject = new SoSeparator;
  _ivBottomRightObject->ref();
  //setting the specifications for the BottomRightCamera
  BottomRightCamera = new SoPerspectiveCamera;
  _ivBottomRightObject->addChild(BottomRightCamera);
  
  SoRotationXYZ* _ivTopRightRotation = new SoRotationXYZ;
  SoRotationXYZ* _ivBottomLeftRotation = new SoRotationXYZ;
  
  _ivTopRightRotation->angle = M_PI/2; //90 degrees
  _ivTopRightRotation->axis = SoRotationXYZ::X;
  
  _ivBottomLeftRotation->angle = M_PI/2;
  _ivBottomLeftRotation->axis = SoRotationXYZ::Y;
  
  _ivTopRightObject->addChild(_ivTopRightRotation);
  _ivBottomLeftObject->addChild(_ivBottomLeftRotation);
  
  MultipleViewsToggle = 0; //Multiple views is switched off initially
  _bMultipleViews = false; //The toggle switch is off initially

  TopLeftViewer = new SoXtExaminerViewer(form);
  TopLeftViewer->setSceneGraph(_ivTopLeftObject);
  TopLeftViewer->setSize(SbVec2s(MULTIPLE_VIEWER_WIDTH, MULTIPLE_VIEWER_HEIGHT));
 
  TopRightViewer = new SoXtExaminerViewer(form);
  TopRightViewer->setSceneGraph(_ivTopRightObject);
  TopRightViewer->setSize(SbVec2s(MULTIPLE_VIEWER_WIDTH, MULTIPLE_VIEWER_HEIGHT));
  
  BottomLeftViewer = new SoXtExaminerViewer(form);
  BottomLeftViewer->setSceneGraph(_ivBottomLeftObject);
  BottomLeftViewer->setSize(SbVec2s(MULTIPLE_VIEWER_WIDTH, MULTIPLE_VIEWER_HEIGHT));
  
  BottomRightViewer = new SoXtExaminerViewer(form);
  BottomRightViewer->setSceneGraph(_ivBottomRightObject);
  BottomRightViewer->setSize(SbVec2s(MULTIPLE_VIEWER_WIDTH, MULTIPLE_VIEWER_HEIGHT));
  
  //********************************************************************
  //Put the scene in the viewer
  _viewer->setSceneGraph(_ivRoot);
  _viewer->setSize(SbVec2s(DEF_VIEWER_WIDTH, DEF_VIEWER_HEIGHT));
  _viewer->show();

  //layout design for the main viewer
  n=0;
  XtSetArg(args[n], XmNtopAttachment, XmATTACH_FORM); n++;
  XtSetArg(args[n], XmNleftAttachment, XmATTACH_FORM); n++;
  XtSetArg(args[n], XmNrightAttachment, XmATTACH_FORM); n++;
  XtSetArg(args[n], XmNbottomAttachment, XmATTACH_FORM); n++;
  XtSetValues(_viewer->getWidget(), args, n);
  
  // set the background color
  SbColor ivColor(0,0,0);
  _viewer->setBackgroundColor(ivColor);

  // set up the timer callback 
  SoTimerSensor *callbackSensor = new SoTimerSensor(_TimerCB, this);
  callbackSensor->setInterval(1/2000.0);  // as fast as possible
  callbackSensor->schedule();

  // initialize the data
  _ivData = new SoSeparator;
  _ivRoot->addChild(_ivData);

  //Completing the four different scene graphs for MultipleViews
  _ivTopLeftObject->addChild(_ivData);
  _ivTopRightObject->addChild(_ivData);
  _ivBottomLeftObject->addChild(_ivData);
  _ivBottomRightObject->addChild(_ivData);

  if (!_InitData()) cerr << "renderiv: Error initializing data" << endl;
  _viewer->viewAll();

  //layout of the multiple views window
  n = 0;
  XtSetArg(args[n], XmNleftAttachment,    XmATTACH_FORM); n++;
  XtSetArg(args[n], XmNrightAttachment, XmATTACH_POSITION); n++;
  XtSetArg(args[n], XmNrightPosition,   50); n++;
  XtSetArg(args[n], XmNbottomAttachment, XmATTACH_POSITION); n++;
  XtSetArg(args[n], XmNbottomPosition,   50); n++;
  XtSetArg(args[n], XmNtopAttachment,     XmATTACH_POSITION); n++;
  XtSetArg(args[n], XmNtopPosition,         1); n++;
  XtSetValues(TopLeftViewer->getWidget(), args, n);

  n = 0;
  XtSetArg(args[n], XmNtopAttachment,     XmATTACH_FORM); n++;
  XtSetArg(args[n], XmNleftAttachment,    XmATTACH_POSITION); n++;
  XtSetArg(args[n], XmNleftPosition,      50); n++;
  XtSetArg(args[n], XmNrightAttachment,   XmATTACH_FORM); n++;
  XtSetArg(args[n], XmNbottomAttachment,  XmATTACH_WIDGET); n++;
  XtSetArg(args[n], XmNbottomWidget,      BottomRightViewer->getWidget()); n++;
  XtSetValues(TopRightViewer->getWidget(), args, n);

  n = 0;
  XtSetArg(args[n], XmNtopAttachment,     XmATTACH_WIDGET); n++;
  XtSetArg(args[n], XmNtopWidget,         TopLeftViewer->getWidget()); n++;
  XtSetArg(args[n], XmNleftAttachment,    XmATTACH_FORM); n++;
  XtSetArg(args[n], XmNrightAttachment,   XmATTACH_WIDGET); n++;
  XtSetArg(args[n], XmNrightWidget,       BottomRightViewer->getWidget()); n++;
  XtSetArg(args[n], XmNbottomAttachment,  XmATTACH_FORM); n++;
  XtSetValues(BottomLeftViewer->getWidget(), args, n);

  n = 0;
  
  XtSetArg(args[n], XmNtopAttachment,     XmATTACH_POSITION); n++;
  XtSetArg(args[n], XmNtopPosition,        50); n++;
  XtSetArg(args[n], XmNleftAttachment,     XmATTACH_POSITION); n++;
  XtSetArg(args[n], XmNleftPosition,        50); n++;
  XtSetArg(args[n], XmNrightAttachment,   XmATTACH_FORM); n++;
  XtSetArg(args[n], XmNbottomAttachment,  XmATTACH_FORM); n++;
  XtSetValues(BottomRightViewer->getWidget(), args, n);

  XtManageChild(form);

  SoXt::show(mainWindow);
    
}


//---------------------------------------------------------------------
//                           RenderIv
// Method:  MainLoop
//
//---------------------------------------------------------------------
void RenderIv::MainLoop(Gui *g)
{
  g->Finished = false;
  _pGui = g;

  // enter the inventor loop
  SoXt::mainLoop();
}


////////////////
//
// PROTECTED METHODS
//


//---------------------------------------------------------------------
//                           RenderIv
// Method:  _TimerCB
//
// Purpose: Callback for the timer sensor
//
//---------------------------------------------------------------------
void RenderIv::_TimerCB(void *userData, SoSensor *)
{
  RenderIv *riv = (RenderIv *)userData;
  // execute idle function
  riv->_IdleFunction();
}



//---------------------------------------------------------------------
//                           RenderIv
// Method:  _TimerCB
//
// Purpose: Callback for the timer sensor
//
//---------------------------------------------------------------------
inline void RenderIv::_IdleFunction()
{
  // Handle the window events for the Gui
  _pGui->HandleEvents();

  // Allow exiting by pressing Exit button in Gui
  if (_pGui->Finished) exit(-1);

  // update display toggles
  if (_bDisplayBounds != BoundingBoxOn) {
    _bDisplayBounds = BoundingBoxOn;
    _SetSwitch(_ivBoundsSwitch, _bDisplayBounds);
  }
  if (_bDisplayPath != ShowPathOn) {
    _bDisplayPath = ShowPathOn;
    _SetSwitch(_ivPathSwitch, _bDisplayPath);
  }
  if (_bDisplayPath && NumFrames != _pathFrames)
    _UpdatePathDisplay();

  // update body state if animation is on
  if (AnimationActive) {
    SetCurrentAnimationFrame();
    _UpdateBodies(CurrentAnimationFrame);
  }
  
  //Added for AttachedCamera
  if (_bAttachedCamera != AttachedCameraOn) {
    _bAttachedCamera = AttachedCameraOn;
    
    if (camToggle == 0) {
      CamSwitch->whichChild = 1;
      camToggle = 1;
    }
    else { //camToggle = 1
      CamSwitch->whichChild = 0;
      camToggle = 0;
    }
  }

  //Added for MultipleViews
  if (_bMultipleViews != MultipleViewsOn) {
    
    _bMultipleViews = MultipleViewsOn;
    
    if (MultipleViewsToggle == 0) {
	_viewer->hide();
	
	TopLeftViewer->show();
	TopLeftViewer->viewAll();
	
	TopRightViewer->show();
	TopRightViewer->viewAll();

	BottomLeftViewer->show();
	BottomLeftViewer->viewAll();

	BottomRightViewer->show();
	BottomRightViewer->viewAll();

	MultipleViewsToggle = 1;
    }
    
    else { //MultipleViewsToggle = 1
      
      TopLeftViewer->hide();
      TopRightViewer->hide();
      BottomLeftViewer->hide();
      BottomRightViewer->hide();
      
      _viewer->show();
      
      MultipleViewsToggle = 0;
    }
  }

}


//---------------------------------------------------------------------
//                            RenderIv
// Method:  _ReadIvFile
//
// Purpose: Read Inventor scene from a file
//
//---------------------------------------------------------------------
SoSeparator* RenderIv::_ReadIvFile(const char *filename)
{
  // Open the input file
  SoInput sceneInput;
  if (!sceneInput.openFile(filename)) {

    cerr << "Cannot open file: " << filename << endl;
    return NULL;
  }

  // Read the whole file into the database
  SoSeparator *graph = SoDB::readAll(&sceneInput);
  if (graph == NULL) {
    cerr << "Problem reading file: " << filename << endl;
    return NULL;
  } 

  sceneInput.closeFile();
  return graph;
}


//---------------------------------------------------------------------
//                           RenderIv
// Method:  _InitObject
//
// Purpose: Load a single object
//
//---------------------------------------------------------------------
SoSeparator* RenderIv::_InitObject(const string &fname)
{
  SoSeparator* pObject = NULL;
  cout << "  loading file: " << fname << endl;

  // check for native inventor file
  if (fname.substr(fname.length()-3,3) == ".iv")
    pObject = _ReadIvFile(fname.c_str());
  else {
    // otherwise load raw geometry
    list<MSLTriangle> trlist;
    std::ifstream fin(fname.c_str());
    
    if (S->GeomDim == 2) {
      list<MSLPolygon> plist;
      fin >> plist;
      trlist = PolygonsToTriangles(plist, 2.0); // Defined in 3Dtriangle.C
    }
    else
      fin >> trlist;
    pObject = _InitTriangleGeom(trlist);
  }
    
  return pObject;
}


//---------------------------------------------------------------------
//                           RenderIv
// Method:  _InitBoundsDisplay
//
// Purpose: initialize workspace boundary visualization
//
//---------------------------------------------------------------------
bool RenderIv::_InitBoundsDisplay()
{
  // build configuration bounds visualization nodes
  SoVertexProperty* pVertexProp = new SoVertexProperty;
  SoLineSet *lines = new SoLineSet;
  lines->vertexProperty = pVertexProp;
  _ivBoundsSwitch = new SoSwitch(1);
  _ivBoundsSwitch->addChild(lines);
  _ivRoot->addChild(_ivBoundsSwitch);

  //Added to compute bounding boxes for multiple views
  _ivTopLeftObject->addChild(_ivBoundsSwitch);
  _ivTopRightObject->addChild(_ivBoundsSwitch);
  _ivBottomLeftObject->addChild(_ivBoundsSwitch);
  _ivBottomRightObject->addChild(_ivBoundsSwitch);

  _bDisplayBounds = false;
  // display the bounds if flag is set
  _SetSwitch(_ivBoundsSwitch, _bDisplayBounds);

  // set the color
  const float color[3] = { 0.5, 0.5, 0.5};
  uint32_t red   = uint32_t(color[0] * 255) << 24;
  uint32_t green = uint32_t(color[1] * 255) << 16;
  uint32_t blue  = uint32_t(color[2] * 255) << 8;
  uint32_t alpha = 0x000000FF;
  uint32_t packedColor = red | green | blue | alpha;
  pVertexProp->orderedRGBA.setValue(packedColor);

  // default bounding box
  float L[3] = { -10, -10, -10 };
  float U[3] = { 10, 10, 10 };
  
  // get the workspace bounds
  if (S->LowerWorld[0] != S->UpperWorld[0]) {
    L[0]= S->LowerWorld[0];  L[1]= S->LowerWorld[1];  L[2]= S->LowerWorld[2];
    U[0]= S->UpperWorld[0];  U[1]= S->UpperWorld[1];  U[2]= S->UpperWorld[2];
  }
  cerr << "Workspace boundary: ( " << L[0] << ", " << L[1] << ", " << L[2]
       << " ) - ( "  << U[0] << ", " << U[1] << ", " << U[2] << " )" << endl;

  // set the bounding box lines
  const int numPoints = 16;
  float points[numPoints][3] = {
    {L[0],L[1],L[2]}, {L[0],L[1],U[2]}, {U[0],L[1],U[2]}, {U[0],L[1],L[2]},
    {L[0],L[1],L[2]}, {L[0],U[1],L[2]}, {L[0],U[1],U[2]}, {U[0],U[1],U[2]},
    {U[0],U[1],L[2]}, {L[0],U[1],L[2]}, {U[0],U[1],L[2]}, {U[0],L[1],L[2]},
    {U[0],L[1],U[2]}, {U[0],U[1],U[2]}, {L[0],U[1],U[2]}, {L[0],L[1],U[2]}
  };

  pVertexProp->vertex.setNum(numPoints);
  pVertexProp->vertex.setValues(0, numPoints, points);

  return true;
}


//---------------------------------------------------------------------
//                           RenderIv
// Method:  _InitPathDisplay
//
// Purpose: initialize path visualization
//
//---------------------------------------------------------------------
bool RenderIv::_InitPathDisplay()
{
  // build configuration bounds visualization nodes
  _pPathVertexProp = new SoVertexProperty;
  SoLineSet *lines = new SoLineSet;
  lines->vertexProperty = _pPathVertexProp;
  _ivPathSwitch = new SoSwitch(1);
  _ivPathSwitch->addChild(lines);
  _ivRoot->addChild(_ivPathSwitch);

  //Added for multiple views
  _ivTopLeftObject->addChild(_ivPathSwitch);
  _ivTopRightObject->addChild(_ivPathSwitch);
  _ivBottomLeftObject->addChild(_ivPathSwitch);
  _ivBottomRightObject->addChild(_ivPathSwitch);

  _bDisplayPath = false;
  _pathFrames = 0;
  // display the bounds if flag is set
  _SetSwitch(_ivPathSwitch, _bDisplayPath);

  // set the color
  const float color[3] = { 1.0, 1.0, 0.2};
  uint32_t red   = uint32_t(color[0] * 255) << 24;
  uint32_t green = uint32_t(color[1] * 255) << 16;
  uint32_t blue  = uint32_t(color[2] * 255) << 8;
  uint32_t alpha = 0x000000FF;
  uint32_t packedColor = red | green | blue | alpha;
  _pPathVertexProp->orderedRGBA.setValue(packedColor);

  // default bounding box
  float L[3] = { -3, -3, -1 };
  float U[3] = { 2, 3, 1 };

  // reset to empty path
  const int numPoints = 16;
  float points[numPoints][3] = {
    {L[0],L[1],L[2]}, {L[0],L[1],U[2]}, {U[0],L[1],U[2]}, {U[0],L[1],L[2]},
    {L[0],L[1],L[2]}, {L[0],U[1],L[2]}, {L[0],U[1],U[2]}, {U[0],U[1],U[2]},
    {U[0],U[1],L[2]}, {L[0],U[1],L[2]}, {U[0],U[1],L[2]}, {U[0],L[1],L[2]},
    {U[0],L[1],U[2]}, {U[0],U[1],U[2]}, {L[0],U[1],U[2]}, {L[0],L[1],U[2]}
  };
  _pPathVertexProp->vertex.setNum(numPoints);
  _pPathVertexProp->vertex.setValues(0, numPoints, points);

  return true;
}


//---------------------------------------------------------------------
//                           RenderIv
//
// Method:  _InitTriangleGeom
//
// Purpose: initialize object geometry from triangles
//
//---------------------------------------------------------------------
SoSeparator* RenderIv::_InitTriangleGeom(list<MSLTriangle> &triangles)
{
  int numTriangles = triangles.size();
  if (numTriangles <= 0) {
    cerr << "renderiv: WARNING - empty triangle list." << endl;
    return NULL;
  }

  // build iv hierarchy
  SoSeparator* pSep = new SoSeparator;
  SoMaterial* pMat = new SoMaterial;
  SoVertexProperty* pVertexProp = new SoVertexProperty;
  SoIndexedFaceSet* pFaceSet = new SoIndexedFaceSet;
  pSep->addChild(pMat);
  pSep->addChild(pFaceSet);

  // Change the colors for different bodies
  static int objnum = 0;
  objnum++;
  SbColor c(RGBRed[(objnum) % RENDERCOLORS],
	    RGBGreen[(objnum) % RENDERCOLORS],
	    RGBBlue[(objnum) % RENDERCOLORS]);
  pMat->diffuseColor.setValue(c[0], c[1], c[2]);

  // set the vertex data
  pFaceSet->vertexProperty = pVertexProp;
  const int numVerts = numTriangles * 3;
  typedef float float3[3];
  float3* points = new float3[numVerts];
  int v = 0;
  list<MSLTriangle>::iterator t;
  forall(t, triangles) {
    points[v][0] = t->p1.xcoord();
    points[v][1] = t->p1.ycoord();
    points[v][2] = t->p1.zcoord();
    v++;
    points[v][0] = t->p2.xcoord();
    points[v][1] = t->p2.ycoord();
    points[v][2] = t->p2.zcoord();
    v++;
    points[v][0] = t->p3.xcoord();
    points[v][1] = t->p3.ycoord();
    points[v][2] = t->p3.zcoord();
    v++;
  }
  assert(v == numVerts);
  pVertexProp->vertex.setNum(numVerts);
  pVertexProp->vertex.setValues(0, numVerts, points);
  
  // set the triangle vertex indices
  const int numIndices = numTriangles * 4;
  int32_t *vIndex = new int32_t[numIndices];
  int i = 0;
  v = 0;
  for (int t = 0; t < numTriangles; t++) {
    vIndex[i++] = v++;  vIndex[i++] = v++;  vIndex[i++] = v++; 
    vIndex[i++] = -1; 
  }
  assert (v == numVerts);
  assert (i == numIndices);

  pFaceSet->coordIndex.setValues(0, numIndices, vIndex);
  pFaceSet->coordIndex.setNum(numIndices);
  delete [] vIndex;

  return pSep;
}


//---------------------------------------------------------------------
//                           RenderIv
// Method:  _InitData
//
// Purpose: Load all obstacles and body geometry 
//
//---------------------------------------------------------------------
bool RenderIv::_InitData()
{
  // set control variables
  AnimationActive = false;

  // EnvList was initialized by Init in Render base class
  list<string>::iterator fname;
  forall(fname, EnvList) {
    SoSeparator* pObject = _InitObject(FilePath + *fname);
    if (!pObject)
      cerr << "renderiv: ERROR initializing obstacle: " << *fname << endl;
    else{
      _ivRoot->addChild(pObject);
      
      //Code added for multiple views
      _ivTopLeftObject->addChild(pObject);
      _ivTopRightObject->addChild(pObject);
      _ivBottomLeftObject->addChild(pObject);
      _ivBottomRightObject->addChild(pObject);
    }
  }

  // Bodies
  forall(fname, BodyList) {
    SoSeparator* pObject = _InitObject(FilePath + *fname);
    if (!pObject)
      cerr << "renderiv: ERROR initializing body: " << *fname << endl;
    else {
      // create a movable transformation
      SoSeparator* objRoot  = new SoSeparator;
      SoTransform* objTrans = new SoTransform;
      objRoot->addChild(objTrans);
      objRoot->addChild(pObject);
      _ivRoot->addChild(objRoot);
      _bodyTrans.push_back(objTrans);

      //Code added for multiple views
      _ivTopLeftObject->addChild(objRoot);
      _ivTopRightObject->addChild(objRoot);
      _ivBottomLeftObject->addChild(objRoot);
      _ivBottomRightObject->addChild(objRoot);
     
    }
  }

  // init the display items
  if (!_InitBoundsDisplay())
    cerr << "renderiv: ERROR initializing workspace boundary" << endl;
  if (!_InitPathDisplay())
    cerr << "renderiv: ERROR initializing path display" << endl;

  // update the current positions
  _UpdateBodies(CurrentAnimationFrame);
  
  return true;
}


//---------------------------------------------------------------------
//                           RenderIv
// Method:  _SetSwitch
//
// Purpose: set the value of a rendering switch
//
//---------------------------------------------------------------------
inline void RenderIv::_SetSwitch(SoSwitch *pSwitch, bool bFlag)
{
  pSwitch->whichChild.setValue(bFlag ? SO_SWITCH_ALL : SO_SWITCH_NONE); 
}


//---------------------------------------------------------------------
//                           RenderIv
//
// Method:  _UpdatePathDisplay
//
// Purpose: update the path visualization
//
//---------------------------------------------------------------------
void RenderIv::_UpdatePathDisplay()
{
  _pathFrames = NumFrames;

  // check for empty path
  if (NumFrames < 2) {
    _pPathVertexProp->vertex.setNum(0);
    return;
  }

  MSLVector next, prev = FrameList.front();
  int BodyNum = prev.dim() / 6;

  // point allocation
  const int numPoints = BodyNum * ((NumFrames - 1) * 2);
  typedef float float3[3];
  float3* points = new float3[numPoints];

  // get all frame data
  int bInd;
  int p = 0;

  list<MSLVector>::iterator frp;
  frp = FrameList.begin();
  for (int i = 1; i < NumFrames; i++) {
    for (int j = 0; j < BodyNum; j++) {
      bInd = 6 * j;
      frp++; next = *frp;
      // set the endpoints
      points[p][0] = prev[bInd];
      points[p][1] = prev[bInd+1];
      points[p][2] = prev[bInd+2];
      p++;
      points[p][0] = next[bInd];
      points[p][1] = next[bInd+1];
      points[p][2] = next[bInd+2];
      p++;
      prev = next;
    }
  }
  assert(p == numPoints);

  // set the points
  _pPathVertexProp->vertex.setNum(numPoints);
  _pPathVertexProp->vertex.setValues(0, numPoints, points);
  delete [] points;
}


//---------------------------------------------------------------------
//                           RenderIv
//
// Method:  _SetBodyTransform
//
// Purpose: set a 3D transformation
//
//---------------------------------------------------------------------
inline void RenderIv::_SetTransform(SoTransform* pTrans,
				    double tx, double ty, double tz,
				    double rx, double ry, double rz)
{
  // set the rotation matrix from RPY euler angles
  float ca = cos(rx);   float sa = sin(rx);
  float cb = cos(ry);   float sb = sin(ry);
  float cc = cos(rz);   float sc = sin(rz);
  
  float R11 = cb * cc;
  float R12 = sa * sb * cc  -  ca * sc;
  float R13 = ca * sb * cc  +  sa * sc;
  float R21 = cb * sc;
  float R22 = sa * sb * sc  +  ca * cc;
  float R23 = ca * sb * sc  -  sa * cc;
  float R31 = -sb;
  float R32 = sa * cb;
  float R33 = ca * cb;

  // build row-major matrix
  SbMatrix matrix(R11,  R21,  R31,  0.0,
		  R12,  R22,  R32,  0.0,
		  R13,  R23,  R33,  0.0,
		  tx,   ty,   tz,   1.0);


  /*
  //diff.way --unused(see geomPQP.C) -- had to transpose for inventor (why?)
  float R11 = ca*cb*cc - sa*sc;
  float R12 = -ca*cb*sc-sa*cc;
  float R13 = ca*sb;
  float R21 = sa*cb*cc+ca*sc;
  float R22 = -sa*cb*sc+ca*cc;
  float R23 = sa*sb;
  float R31 = -sb*cc;
  float R32 = sb*sc;
  float R33 = cb;


  // build row-major matrix
  SbMatrix matrix(R11,  R21,  R31,  0.0,
		  R12,  R22,  R32,  0.0,
		  R13,  R23,  R33,  0.0,
		  tx,   ty,   tz,   1.0);
  */

  pTrans->setMatrix(matrix);

}


//---------------------------------------------------------------------
//                           RenderIv
//
// Method:  _UpdateBodies
//
// Purpose: update the body configuration
//
//---------------------------------------------------------------------
void RenderIv::_UpdateBodies(const MSLVector &qConfig)
{
  int index = 0;
  list<SoTransform*>::iterator pTrans;
  forall (pTrans, _bodyTrans) {
    _SetTransform(*pTrans, qConfig[index], qConfig[index+1], qConfig[index+2], 
		  qConfig[index+3], qConfig[index+4], qConfig[index+5]);
    index += 6;
  }
  assert(index == qConfig.dim());

  //Added for attached camera
  if (RIV->AttachedCameraOn) {
    
    int k, j;
    MSLVector c, conf(6);
    float vsca;
    MSLVector vt1(3);
    MSLVector _ivSceneCenter(3);

    _ivSceneCenter[0] = (RIV->_ivBoundingBoxMin[0] + RIV->_ivBoundingBoxMax[0])/2.0;
    _ivSceneCenter[1] = (RIV->_ivBoundingBoxMin[1] + RIV->_ivBoundingBoxMax[1])/2.0;
    _ivSceneCenter[2] = (RIV->_ivBoundingBoxMin[2] + RIV->_ivBoundingBoxMax[2])/2.0;

    // get the current frameinformation
    list<MSLVector>::iterator fi;
    fi = RIV->FrameList.begin();
    for (k = 0; k < RIV->AnimationFrameIndex - 1; k++)
      fi++;
    c = *fi;

    // the configuration of the robot which the camera attaches to
    for (j = 0; j < 6; j++)
      conf[j] = c[ 6 * RIV->S->AttachedCameraBody + j];
      
    // get the camera position and orientation in the scene coordinate

    // AttachedCameraPosition is the position related to the car frame
    vt1 = RIV->S->AttachedCameraPosition;

    // Do the transformation to the global frame 
    vt1 = point_x_rotation(conf[3], vt1);
    vt1 = point_y_rotation(conf[4], vt1);
    vt1 = point_z_rotation(conf[5], vt1);      

    // Find the global position of the camera in problem frame 
    vt1[0] = vt1[0] + conf[0];
    vt1[1] = vt1[1] + conf[1];
    vt1[2] = vt1[2] + conf[2];

    // get the camera position and orientation in the global coordinate
    vt1[0] = vt1[0] - _ivSceneCenter[0];
    vt1[1] = vt1[1] - _ivSceneCenter[1];
    vt1[2] = vt1[2] - _ivSceneCenter[2];
      
    vt1 = point_x_rotation(RIV->_ivOrientation[0]*(PI/180.0), vt1);
    vt1 = point_y_rotation(RIV->_ivOrientation[1]*(PI/180.0), vt1);
    vt1 = point_z_rotation(RIV->_ivOrientation[2]*(PI/180.0), vt1);      

    vt1[0] = vt1[0] + _ivSceneCenter[0];
    vt1[1] = vt1[1] + _ivSceneCenter[1];
    vt1[2] = vt1[2] + _ivSceneCenter[2];
           
    vt1[0] = vt1[0] + RIV->_ivPosition[0];
    vt1[1] = vt1[1] + RIV->_ivPosition[1];
    vt1[2] = vt1[2] + RIV->_ivPosition[2];

    CamPosX = vt1[0];
    CamPosY = vt1[1];
    CamPosZ = vt1[2];

    vt1 = RIV->S->AttachedCameraDirection;

    // get the direction in the scene coordinate
    vt1 = point_x_rotation(conf[3], vt1);
    vt1 = point_y_rotation(conf[4], vt1);
    vt1 = point_z_rotation(conf[5], vt1);      

    // get the direction in the global coordinate
    vt1 = point_x_rotation(RIV->_ivOrientation[0]*(PI/180.0), vt1);
    vt1 = point_y_rotation(RIV->_ivOrientation[1]*(PI/180.0), vt1);
    vt1 = point_z_rotation(RIV->_ivOrientation[2]*(PI/180.0), vt1);      

    vsca = _ivViewLength / vt1.length();

    CamViewX = CamPosX + vt1[0]*vsca;
    CamViewY = CamPosY + vt1[1]*vsca;
    CamViewZ = CamPosZ + vt1[2]*vsca;

    vt1 = RIV->S->AttachedCameraZenith;
    // get the zenith in the scene coordinate
    vt1 = point_x_rotation(conf[3], vt1);
    vt1 = point_y_rotation(conf[4], vt1);
    vt1 = point_z_rotation(conf[5], vt1);

    // get the direction in the global coordinate
    vt1 = point_x_rotation(RIV->_ivOrientation[0]*(PI/180.0), vt1);
    vt1 = point_y_rotation(RIV->_ivOrientation[1]*(PI/180.0), vt1);
    vt1 = point_z_rotation(RIV->_ivOrientation[2]*(PI/180.0), vt1);      

    CamUpX = vt1[0];
    CamUpY = vt1[1];
    CamUpZ = vt1[2];

     MSLVector LookDirection(3);
    MSLVector UpDirection(3);
    MSLVector x(3);
    
    LookDirection[0] = CamViewX - CamPosX;
    LookDirection[1] = CamViewY - CamPosY;
    LookDirection[2] = CamViewZ - CamPosZ;
    
    LookDirection = LookDirection/LookDirection.length();
    
    UpDirection[0] = CamUpX;
    UpDirection[1] = CamUpY;
    UpDirection[2] = CamUpZ;

    UpDirection = UpDirection/UpDirection.length();
    normalMSLVector(UpDirection, LookDirection, x);

    //The following segment of code uses the Inventor vector class SbVec3f, instead of MSLVector
    SbVec3f UpDir(UpDirection[0], UpDirection[1], UpDirection[2]);
    SbVec3f LookDir(LookDirection[0], LookDirection[1], LookDirection[2]);
    UpDir.normalize();
    LookDir.normalize();
    SbVec3f x1(1.0, 0.0, 0.0);
    x1 = LookDir.cross(UpDir);
    x1.normalize();
    
    SbMatrix Rot(x1[0], x1[1], x1[2], 0.0,
		 UpDir[0], UpDir[1], UpDir[2], 0.0,
		 -LookDir[0], -LookDir[1], -LookDir[2], 0.0,
		 0.0, 0.0, 0.0, 1.0);

    //change the position and orientation of the camera
    attachedCam->position.setValue(SbVec3f(CamPosX, CamPosY, CamPosZ));
    attachedCam->orientation.setValue(SbRotation(Rot));attachedCam->nearDistance.setValue(_ivNearDist);
    attachedCam->farDistance.setValue(_ivFarDist);
  }

  if (RIV->MultipleViewsOn)
    {
      //The following chunk of code is th ensure that movements in any of the four windows would result in movements in the other 3 windows
      //getting the orientation of the Top Left Camera
      SbName orientation1("orientation");
      SoField* RotMat1 = TopLeftCamera->getField(orientation1);
      SbMatrix matrix1;
      if (RotMat1->isOfType(SoSFRotation::getClassTypeId())) {
	SoSFRotation *RotMatrix1 = (SoSFRotation*) RotMat1;
	SbVec3f axis1;
	float angle1;
	RotMatrix1->getValue(axis1, angle1);
	SbRotation rotation1(axis1, angle1);
	rotation1.getValue(matrix1);
      }
  
      //getting the position of the Top Left camera
      float TLCx;
      float TLCy;
      float TLCz;
      SbName name1("position");
      SoField* PosVec1 = TopLeftCamera->getField(name1);
      if (PosVec1->isOfType(SoSFVec3f::getClassTypeId())) {
	SoSFVec3f *PosVector1 = (SoSFVec3f*) PosVec1;
	SbVec3f PositionVector1 = PosVector1->getValue();
	PositionVector1.getValue(TLCx, TLCy, TLCz);
      }
  
      TopRightCamera->orientation.setValue(SbRotation(matrix1));
      BottomLeftCamera->orientation.setValue(SbRotation(matrix1));
      BottomRightCamera->orientation.setValue(SbRotation(matrix1));

      TopRightCamera->position.setValue(TLCx, TLCy, TLCz);
      BottomLeftCamera->position.setValue(TLCx, TLCy, TLCz);
      BottomRightCamera->position.setValue(TLCx, TLCy, TLCz);
    }
  
}

