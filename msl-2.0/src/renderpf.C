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
#include <stdlib.h>

#include "MSL/renderpf.h"
#include "MSL/defs.h"


#define CONTROLPANEL_CENTER_X -0.22
#define CONTROLPANEL_CENTER_Z -0.37
#define CONTROLPANEL_WIDTH 0.2
#define CONTROLPANEL_HEIGHT 0.1
#define CONTROLPANEL_BAR_WIDTH 0.18
#define CONTROLPANEL_BAR_HEIGHT 0.005
#define CONTROLPAD_WIDTH 0.01
#define CONTROLPAD_HEIGHT 0.02

// Range of speeds: 2^-ANIMATING_SPEED_FACTOR to 2^ANIMATING_SPEED_FACTOR
#define ANIMATING_SPEED_FACTOR 10


////////////////////////////////////////////////////////
//
// RenderPerformer Class
//
///////////////////////////////////////////////////////

SharedData* RenderPerformer::Shared;

RenderPerformer::RenderPerformer(): Render()
{

}


RenderPerformer::RenderPerformer(string filepath=""): Render(filepath)
{

}


RenderPerformer::RenderPerformer(Scene *s, 
				 string filepath): Render(s,filepath)
{

}



void RenderPerformer::LoadEnvironment(pfGroup *env){
  list<string>::iterator object;
  pfNode *root;

  forall(object, EnvList){
    // Append to Performer search path
    if (!strstr((*object).c_str(),".")) {
      root = LoadNativeModel(*object, 0);
    }
    else {
      pfFilePath(FilePath.c_str());
      
      cout << "Loading " << *object << "\n"; 
      root = pfdLoadFile((*object).c_str());
      if (root == NULL)
	{
	  pfExit();
	  exit(-1);
	}
    }
    env->addChild(root);    
  }
}



void RenderPerformer::LoadBodies(pfGroup *bodies){
  list<string>::iterator object;
  pfNode *root;
  int i;

  i = 0;
  forall(object, BodyList) {
    if (!strstr((*object).c_str(),".")) {
      root = LoadNativeModel(*object, i+1);
    }
    else {
      // Append to Performer search path
      pfFilePath(FilePath.c_str());
      
      cout << "Loading " << *object << "\n";
      root = pfdLoadFile((*object).c_str());
      if (root == NULL)
	{
	  pfExit();
	  exit(-1);
	}
    }
    pfDCS *piece = new pfDCS;
    piece->addChild(root);
    bodies->addChild(piece);    

    i++;
  }
}



pfNode* RenderPerformer::LoadNativeModel(string file, int colorindex)
{
  pfGeode *root = new pfGeode;
  pfGeoSet *gset = new pfGeoSet;
  list<MSLTriangle> trlist;
  list<MSLPolygon> plist;
  int i, num;
  double d1[3],d2[3], n[3];
  list<MSLTriangle>::iterator t;

  std::ifstream fin((FilePath + file).c_str());
  if (S->GeomDim == 2) {
    fin >> plist;
    trlist = PolygonsToTriangles(plist,5.0); // Defined in triangle.C
  }
  else
    fin >> trlist;
  fin.close();

  //cout << "number of triangles: " << num << endl; 
  num = trlist.size();
  pfVec3 *tri = new pfVec3[3*num];
  pfVec3 *norm = new pfVec3[num];
  pfVec4 *color = new pfVec4[1];

  i = 0;
  forall (t,trlist) {
    tri[3*i].set((float) (*t).p1.xcoord(), (float) (*t).p1.ycoord(), 
		 (float) (*t).p1.zcoord());
    tri[3*i+1].set((float) (*t).p2.xcoord(), (float) (*t).p2.ycoord(), 
		   (float) (*t).p2.zcoord());
    tri[3*i+2].set((float) (*t).p3.xcoord(), (float) (*t).p3.ycoord(), 
		   (float) (*t).p3.zcoord());

    d1[0] = (*t).p2.xcoord() - (*t).p1.xcoord();
    d1[1] = (*t).p2.ycoord() - (*t).p1.ycoord();
    d1[2] = (*t).p2.zcoord() - (*t).p1.zcoord();
    d2[0] = (*t).p3.xcoord() - (*t).p1.xcoord();
    d2[1] = (*t).p3.ycoord() - (*t).p1.ycoord();
    d2[2] = (*t).p3.zcoord() - (*t).p1.zcoord();
    NormCrossProduct(d1, d2, n);
    norm[i].set(n[0], n[1], n[2]);
    i++;
  }

  color[0].set( RGBRed[colorindex % RENDERCOLORS], 
		RGBGreen[colorindex % RENDERCOLORS], 
		RGBBlue[colorindex % RENDERCOLORS], 0.0f );

  gset->setAttr(PFGS_COORD3, PFGS_PER_VERTEX, tri, NULL);
  gset->setAttr(PFGS_NORMAL3, PFGS_PER_PRIM, norm, NULL);
  gset->setAttr(PFGS_COLOR4, PFGS_OVERALL, color, NULL);
  gset->setPrimType(PFGS_TRIS);
  gset->setNumPrims(num);

  //Specify Geometry State
  pfGeoState *gstate = new pfGeoState;
  gstate->setMode(PFSTATE_ENLIGHTING, PF_ON);
  gstate->setMode(PFSTATE_CULLFACE, PF_OFF);
  //gstate->setMode(PFSTATE_SHADEMODEL, PFSM_GOURAUD);

  // Using material
  pfMaterial *mat = new pfMaterial;
  mat->setColor(PFMTL_AMBIENT, 0.0f, 0.0f, 0.0f);
  mat->setColor(PFMTL_SPECULAR, 0.5f, 0.5f, 0.5f);
  mat->setShininess(10.0f);
  mat->setColorMode(PFMTL_BOTH, PFMTL_CMODE_AD);
  //mat->apply();

  gstate->setAttr(PFSTATE_FRONTMTL, mat);
  gset->setGState(gstate);

  //gset->setDrawMode(PFGS_FLATSHADE, PF_ON);

  root->addGSet(gset);
  
  return root;
}


void RenderPerformer::MakeBoundingBox(pfGeode *bound){
  pfGeoSet *gset = new pfGeoSet;
  pfVec3 *ver = new pfVec3[24];
  pfVec3 *norm = new pfVec3[12];
  pfVec4 *color = new pfVec4[1];

  ver[0].set(S->LowerWorld[0], S->LowerWorld[1], S->LowerWorld[2]);
  ver[1].set(S->UpperWorld[0], S->LowerWorld[1], S->LowerWorld[2]);
  norm[0].set(0.0,1.0,0.0);

  ver[2].set(S->LowerWorld[0], S->LowerWorld[1], S->LowerWorld[2]);
  ver[3].set(S->LowerWorld[0], S->UpperWorld[1], S->LowerWorld[2]);
  norm[1].set(0.0,1.0,0.0);

  ver[4].set(S->LowerWorld[0], S->LowerWorld[1], S->LowerWorld[2]);
  ver[5].set(S->LowerWorld[0], S->LowerWorld[1], S->UpperWorld[2]);
  norm[2].set(0.0,1.0,0.0);

  ver[6].set(S->UpperWorld[0], S->LowerWorld[1], S->LowerWorld[2]);
  ver[7].set(S->UpperWorld[0], S->UpperWorld[1], S->LowerWorld[2]);
  norm[3].set(0.0,1.0,0.0);

  ver[8].set(S->UpperWorld[0], S->LowerWorld[1], S->LowerWorld[2]);
  ver[9].set(S->UpperWorld[0], S->LowerWorld[1], S->UpperWorld[2]);
  norm[4].set(0.0,1.0,0.0);

  ver[10].set(S->LowerWorld[0], S->UpperWorld[1], S->LowerWorld[2]);
  ver[11].set(S->UpperWorld[0], S->UpperWorld[1], S->LowerWorld[2]);
  norm[5].set(0.0,1.0,0.0);

  ver[12].set(S->LowerWorld[0], S->UpperWorld[1], S->LowerWorld[2]);
  ver[13].set(S->LowerWorld[0], S->UpperWorld[1], S->UpperWorld[2]);
  norm[6].set(0.0,1.0,0.0);

  ver[14].set(S->LowerWorld[0], S->LowerWorld[1], S->UpperWorld[2]);
  ver[15].set(S->UpperWorld[0], S->LowerWorld[1], S->UpperWorld[2]);
  norm[7].set(0.0,1.0,0.0);

  ver[16].set(S->LowerWorld[0], S->LowerWorld[1], S->UpperWorld[2]);
  ver[17].set(S->LowerWorld[0], S->UpperWorld[1], S->UpperWorld[2]);
  norm[8].set(0.0,1.0,0.0);

  ver[18].set(S->UpperWorld[0], S->UpperWorld[1], S->UpperWorld[2]);
  ver[19].set(S->LowerWorld[0], S->UpperWorld[1], S->UpperWorld[2]);
  norm[9].set(0.0,1.0,0.0);

  ver[20].set(S->UpperWorld[0], S->UpperWorld[1], S->UpperWorld[2]);
  ver[21].set(S->UpperWorld[0], S->LowerWorld[1], S->UpperWorld[2]);
  norm[10].set(0.0,1.0,0.0);

  ver[22].set(S->UpperWorld[0], S->UpperWorld[1], S->UpperWorld[2]);
  ver[23].set(S->UpperWorld[0], S->UpperWorld[1], S->LowerWorld[2]);
  norm[11].set(0.0,1.0,0.0);

  color[0].set( 1, 0, 0, 0.0f );

  gset->setAttr(PFGS_COORD3, PFGS_PER_VERTEX, ver, NULL);
  gset->setAttr(PFGS_NORMAL3, PFGS_PER_PRIM, norm, NULL);
  gset->setAttr(PFGS_COLOR4, PFGS_OVERALL, color, NULL);
  gset->setPrimType(PFGS_LINES);
  gset->setNumPrims(12);

  //Specify Geometry State
  pfGeoState *gstate = new pfGeoState;
  gstate->setMode(PFSTATE_ENLIGHTING, PF_ON);
  gstate->setMode(PFSTATE_CULLFACE, PF_OFF);
  //gstate->setMode(PFSTATE_SHADEMODEL, PFSM_GOURAUD);

  // Using material
  pfMaterial *mat = new pfMaterial;
  mat->setColor(PFMTL_AMBIENT, 0.0f, 0.0f, 0.0f);
  mat->setColor(PFMTL_SPECULAR, 0.5f, 0.5f, 0.5f);
  mat->setShininess(10.0f);
  mat->setColorMode(PFMTL_BOTH, PFMTL_CMODE_AD);
  gstate->setAttr(PFSTATE_FRONTMTL, mat);
 
  gset->setGState(gstate);

  bound->addGSet(gset);
}



void RenderPerformer::MakeControlPanel(pfGroup *con, pfDCS *pad){
  pfGeode *geopad = new pfGeode;
  pfGeode *geo = new pfGeode;
  pfGeoSet *gset_frame = new pfGeoSet;
  pfGeoSet *gset_pad = new pfGeoSet;

  //Specify Geometry State
  pfGeoState *gstate = new pfGeoState;
  gstate->setMode(PFSTATE_TRANSPARENCY, PFTR_ON);
  gstate->setMode(PFSTATE_ENLIGHTING, PF_ON);
  gstate->setMode(PFSTATE_CULLFACE, PF_OFF);

  // Using material
  pfMaterial *mat = new pfMaterial;
  mat->setColor(PFMTL_AMBIENT, 0.0f, 0.0f, 0.0f);
  mat->setColor(PFMTL_SPECULAR, 0.5f, 0.5f, 0.5f);
  mat->setShininess(10.0f);
  mat->setColorMode(PFMTL_BOTH, PFMTL_CMODE_AD);
  gstate->setAttr(PFSTATE_FRONTMTL, mat);

  pfVec3 *tri = new pfVec3[4];
  pfVec3 *norm = new pfVec3[1];
  pfVec4 *color = new pfVec4[1];

  tri[0].set(-CONTROLPANEL_BAR_WIDTH + CONTROLPANEL_CENTER_X, -299.0,
	     -CONTROLPANEL_BAR_HEIGHT + CONTROLPANEL_CENTER_Z);
  tri[1].set(-CONTROLPANEL_BAR_WIDTH + CONTROLPANEL_CENTER_X, -299.0,
	     CONTROLPANEL_BAR_HEIGHT + CONTROLPANEL_CENTER_Z);
  tri[2].set(CONTROLPANEL_BAR_WIDTH + CONTROLPANEL_CENTER_X, -299.0,
	     CONTROLPANEL_BAR_HEIGHT + CONTROLPANEL_CENTER_Z);
  tri[3].set(CONTROLPANEL_BAR_WIDTH + CONTROLPANEL_CENTER_X, -299.0,
	     -CONTROLPANEL_BAR_HEIGHT + CONTROLPANEL_CENTER_Z);
  norm[0].set(0.0, -1.0, 0.0);
  color[0].set(0.5, 0.5, 1.0, 0.5f );

  gset_frame->setAttr(PFGS_COORD3, PFGS_PER_VERTEX, tri, NULL);
  gset_frame->setAttr(PFGS_NORMAL3, PFGS_PER_PRIM, norm, NULL);
  gset_frame->setAttr(PFGS_COLOR4, PFGS_PER_PRIM, color, NULL);
  gset_frame->setPrimType(PFGS_QUADS);
  gset_frame->setNumPrims(1);
  gset_frame->setGState(gstate);
  geo->addGSet(gset_frame);

  con->addChild(geo);

  // Draw Control Pad
  pfVec3 *tri1 = new pfVec3[4];
  pfVec3 *norm1 = new pfVec3[1];
  pfVec4 *color1 = new pfVec4[1];

  tri1[0].set(-CONTROLPAD_WIDTH + CONTROLPANEL_CENTER_X, -299.0,
	      -CONTROLPAD_HEIGHT + CONTROLPANEL_CENTER_Z);
  tri1[1].set(-CONTROLPAD_WIDTH + CONTROLPANEL_CENTER_X, -299.0,
	      CONTROLPAD_HEIGHT + CONTROLPANEL_CENTER_Z);
  tri1[2].set(CONTROLPAD_WIDTH + CONTROLPANEL_CENTER_X, -299.0,
	      CONTROLPAD_HEIGHT + CONTROLPANEL_CENTER_Z);
  tri1[3].set(CONTROLPAD_WIDTH + CONTROLPANEL_CENTER_X, -299.0,
	      -CONTROLPAD_HEIGHT + CONTROLPANEL_CENTER_Z);
  norm1[0].set(0.0, -1.0, 0.0);
  color1[0].set(0.0, 0.0, 1.0, 0.5);

  gset_pad->setAttr(PFGS_COORD3, PFGS_PER_VERTEX, tri1, NULL);
  gset_pad->setAttr(PFGS_NORMAL3, PFGS_PER_PRIM, norm1, NULL);
  gset_pad->setAttr(PFGS_COLOR4, PFGS_PER_PRIM, color1, NULL);
  gset_pad->setPrimType(PFGS_QUADS);
  gset_pad->setNumPrims(1);
  gset_pad->setGState(gstate);
  geopad->addGSet(gset_pad);
  
  pad->addChild(geopad);
}





void RenderPerformer::NormCrossProduct(double v1[3], double v2[3], 
				       double out[3]) {
  out[0] = v1[1]*v2[2] - v1[2]*v2[1];
  out[1] = v1[2]*v2[0] - v1[0]*v2[2];
  out[2] = v1[0]*v2[1] - v1[1]*v2[0];

  GLfloat d = sqrt(out[0]*out[0] + out[1]*out[1] + out[2]*out[2]);

  out[0] /= d;
  out[1] /= d;
  out[2] /= d;
}



void RenderPerformer::GetCurrentMousePos(double &x, double &y){
  pfuGetMouse(Shared->Mouse);
  pfuMapMouseToChan(Shared->Mouse, Shared->Chan); // no matter mouse in chan or not return a value
  x = (double)Shared->Mouse->xchan;
  y = (double)Shared->Mouse->ychan;

  switch(Shared->Mouse->click){
  case 1: // click right
    Shared->HoldRightMouse = true;
    break;
  case 2: // click  middle
    Shared->HoldMiddleMouse = true;
    break;
  case 4: // click left
    Shared->HoldLeftMouse = true;
    break;
  default: // none
    break;
  }
  
  switch(Shared->Mouse->release){
  case 5: // release right and left
    Shared->HoldRightMouse = false;
    Shared->HoldLeftMouse = false;
    break;
  case 7: // release middle;
    Shared->HoldMiddleMouse = false;
    break;
  default: // none
    break;
  }	
}


void RenderPerformer::ShowCurrentAnimationFrame() {
  int i,j;
  MSLVector conf(6),oldframe;
  pfMatrix orientation, rot, delta_rot;

  if (AnimationActive)
    SetCurrentAnimationFrame();
  
  // Show the bodies in their proper places
  for (i = 0; i < S->NumBodies; i++) {
    // for each robot, first read its own configuration from FrameList
    for (j = 0; j < 6; j++)
      conf[j] = CurrentAnimationFrame[6*i+j];
    
    // update coordinate system
    orientation.makeIdent();
    rot.makeIdent();
    // rotate x
    delta_rot.makeRot(conf[3]*180.0/PI, 1.0, 0.0, 0.0);
    rot.postMult(delta_rot);
    // rotate y
    delta_rot.makeRot(conf[4]*180.0/PI, 0.0, 1.0, 0.0);
    rot.postMult(delta_rot);
    // rotate Z
    delta_rot.makeRot(conf[5]*180.0/PI, 0.0, 0.0, 1.0);
    rot.postMult(delta_rot);
    
    // Translate
    orientation.postTrans(rot, conf[0], conf[1], conf[2]);
    
    pfDCS *child_robot = (pfDCS *) Shared->BodiesDCS->getChild(i);
    child_robot->setMat(orientation);
  }
}
  

void RenderPerformer::Init() {
  Render::Init();

  // Initialize Performer
  pfInit();
    
  // Use default multiprocessing mode based on number of processors.
  pfMultiprocess( PFMP_DEFAULT );

  // allocate shared before fork()'ing parallel processes  
  Shared = (SharedData*)pfMalloc(sizeof(SharedData), pfGetSharedArena());
 
  // Set Performer Search Path
  pfFilePath(FilePath.c_str());

  // Load all loader DSO's before pfConfig() forks 
  list<string>::iterator object;

  forall(object, EnvList) {
    if( strstr((*object).c_str(),".") ) 
      pfdInitConverter((*object).c_str());
  }

  forall(object, BodyList) {
    if( strstr((*object).c_str(),".") )
      pfdInitConverter((*object).c_str());
  }

  // initiate multi-processing mode set in pfMultiprocess call 
  // FORKs for Performer processes,  CULL and DRAW, etc. happen here.
  pfConfig();			
  
  // Initiate performer utility library
  pfuInit();

  // Create Mouse and InputEvents
  Shared->Mouse = new pfuMouse;
  Shared->InputEvents = new pfuEventStream;
    
  // Create a new pfScene
  pfScene *PerfScene = new pfScene;

  // Load Environment and attach it to scene
  Shared->ShowCase = new pfSwitch;
  Shared->ControlPanel = new pfGroup;
  Shared->ControlPad = new pfDCS;
  Shared->WorldDCS = new pfDCS;
  Shared->WorkEnv = new pfSwitch;
  Shared->Env = new pfGroup;
  Shared->BodiesDCS = new pfDCS;
  Shared->BoundingBox = new pfGeode;

  LoadEnvironment(Shared->Env);
  LoadBodies(Shared->BodiesDCS);

  MakeBoundingBox(Shared->BoundingBox);
  MakeControlPanel(Shared->ControlPanel, Shared->ControlPad);

  Shared->ControlPanel->addChild(Shared->ControlPad);
  Shared->WorkEnv->addChild(Shared->Env);
  Shared->WorkEnv->addChild(Shared->BoundingBox);
  Shared->WorldDCS->addChild(Shared->WorkEnv);
  Shared->WorldDCS->addChild(Shared->BodiesDCS);
  Shared->ShowCase->addChild(Shared->WorldDCS);
  Shared->ShowCase->addChild(Shared->ControlPanel);  
  PerfScene->addChild(Shared->ShowCase);

  // Create a pfLightSource
  pfLightSource *sun = new pfLightSource;
  sun->setPos(-100.0, -100.0, 100.0, 1.0);
  PerfScene->addChild(sun);
  pfLightSource *sun2 = new pfLightSource;
  sun2->setPos(0.0, 0.0, 0.0, 0.0);

  // Uncomment the next line to make things brighter
  //sun2->setAmbient(1.0, 1.0, 1.0);

  PerfScene->addChild(sun2);

  // Configure and open GL window
  pfPipe *Pipe = pfGetPipe(0);
  Shared->PW = new pfPipeWindow(Pipe);
  Shared->PW->setWinType(PFPWIN_TYPE_X);
  Shared->PW->setName("MSL Render: IRIS Performer Window");
  Shared->PW->setOriginSize(0,0,500,500);
  Shared->PW->open();
  
  // Create and configure a pfChannel.
  pfChannel *chan = new pfChannel(Pipe);
  chan->setScene(PerfScene);
  chan->setFOV(45.0f, 45.0f);
  chan->setNearFar(1.0f, 1000.0f);
  chan->setTravFunc(PFTRAV_DRAW, DrawChannel);
  chan->setViewport(0.0, 1.0, 0, 1.0);
  chan->setShare(PFCHAN_FOV | PFCHAN_NEARFAR
		 | PFCHAN_EARTHSKY 
		 | PFCHAN_STRESS 
		 | PFCHAN_LOD | PFCHAN_SWAPBUFFERS
		 | PFCHAN_SWAPBUFFERS_HW);

  Shared->Chan = chan;
  // Set Chan view point  
  // Unfortunately, this viewing transformation has to be fixed,
  // otherwise the control panel will disappear because of the 
  // way it was designed.
  pfCoord view;
  view.hpr.set(0.0, 0.0, 0.0); // z,x,y
  view.xyz.set(0.0, -300.0, 0.0);
  Shared->Chan->setView(view.xyz, view.hpr);

  pfEarthSky *esky = new pfEarthSky();
  esky->setMode(PFES_BUFFER_CLEAR, PFES_SKY_GRND);
  esky->setAttr(PFES_GRND_HT, -1000.0f);
  esky->setColor(PFES_GRND_FAR, 0.3f, 0.1f, 0.0f, 1.0f);
  esky->setColor(PFES_GRND_NEAR, 0.5f, 0.3f, 0.1f, 1.0f);
  chan->setESky(esky);

  // Initilize the slave channel
  /*pfChannel *chaneye = new pfChannel(Pipe);
  pfScene *eyescene = new pfScene;
  pfMatrix m;
  m.makeIdent();
  pfSCS *eyeworld = new pfSCS(m); 
  
  eyeworld->addChild(Shared->EnvDCS);
  eyeworld->addChild(Shared->BodiesDCS);
  eyescene->addChild(eyeworld);

  chaneye->setScene(eyescene);
  chan->attach(chaneye);
  chaneye->setViewport(0.0, 1.0/4.0, 3.0/4.0, 1.0);
  Shared->ChanEye = chaneye;
  PW->removeChan(ChanEye); // remove chanslaver as default
  */

  // Initilize input device
  pfuInitInput(Shared->PW,PFUINPUT_X);

  // Get frame rate and set it to FrameTime
  FrameTime = (double) 0.1; // (1.0/pfGetFrameRate());
  //cout << "FrameTime: " << FrameTime << endl;

  Shared->HoldRightMouse = false;
  Shared->HoldLeftMouse = false;
  Shared->HoldMiddleMouse = false;
  //Shared->ReleaseRightMouse = false;
  //Shared->ReleaseLeftMouse = false;
  //Shared->ReleaseMiddleMouse = false;

  // Here is where we have to make the initial values correspond
  // to what the viewing parameters from Scene dictate.
  Shared->TranX = 0.0;
  Shared->TranY = 0.0;
  Shared->TranZ = 0.0;
  Shared->RotX = 0.0;
  Shared->RotY = 0.0;
  Shared->RotZ = 0.0;

  //Set boundbox
  BoundingBoxOn = false;

  // By default, don't use attached camera
  AttachedCameraOn = false;
  
  // Set control pannel initial pos
  Shared->ControlPanelOn = true;
  Shared->FocusOnControlPad = false;
  Shared->PadX = 0.0;
  Shared->ControlPad->setTrans(Shared->PadX, 0.0, 0.0);

  // Make Eye initial matrix
  pfMatrix delta_rot;
  Shared->EyeMat.makeIdent();
  // rotate along Z 90 degrees
  delta_rot.makeRot(-90.0, 0.0, 0.0, 1.0);
  Shared->EyeMat.postMult(delta_rot);
  // Translate to designed position
  delta_rot.makeTrans(10, 10, 0);
  Shared->EyeMat.postMult(delta_rot);

  // Get courrent mouse position
  GetCurrentMousePos(Shared->MouseXOld, Shared->MouseYOld);
}



void RenderPerformer::Terminate(){
  // Terminate parallel processes and exit
  pfuExitInput();
  pfExit();
}



void RenderPerformer::HandleKeyInput(){
  int inkey;

  pfuGetEvents(Shared->InputEvents);

  if (Shared->InputEvents->numKeys > 0) {
    inkey = Shared->InputEvents->keyQ[0];
    pfuResetEventStream(Shared->InputEvents);
    //cout << inkey << endl;

    switch(inkey){
    case 'b' : 
      BoundingBoxOn = !BoundingBoxOn;  // Toggle
      break;
    case 'c' :
      Shared->ControlPanelOn = !Shared->ControlPanelOn;  // Toggle
      break;
    case 'v' :
      AttachedCameraOn = !AttachedCameraOn;  // Toggle
      break;
    }
  }
}



void RenderPerformer::GetControlPadSize(double &padwidth_l, 
					double &padwidth_r, 
					double &padheight_b, 
					double &padheight_top){

  padwidth_l = (CONTROLPANEL_CENTER_X + 
		Shared->PadX - CONTROLPAD_WIDTH)/tan(22.5*PI/180.0);
  padwidth_r = (CONTROLPANEL_CENTER_X + 
		Shared->PadX + CONTROLPAD_WIDTH)/tan(22.5*PI/180.0);
  padheight_b = (CONTROLPANEL_CENTER_Z - 
		 CONTROLPAD_HEIGHT)/tan(22.5*PI/180.0);
  padheight_top = (CONTROLPANEL_CENTER_Z + 
		   CONTROLPAD_HEIGHT)/tan(22.5*PI/180.0);

}



void RenderPerformer::HandleMouseEvents() {
  double mousex_new, mousey_new, theta;
  pfMatrix transform, dtransform;
  double padw_l, padw_r, padh_b, padh_top;
  MSLVector vp,vd;
  double vo;
  int i,j,k;
  MSLVector c,conf(6);
  list<MSLVector>::iterator fi;

  // Get control pad size
  GetControlPadSize(padw_l, padw_r, padh_b, padh_top);

  // Get current mouse position
  GetCurrentMousePos(mousex_new, mousey_new);

  // If mouse is inside the pad and ControlPanelOn is true
  // deal with control pannel
  if( Shared->MouseXOld >= padw_l
      && Shared->MouseXOld <= padw_r
      && Shared->MouseYOld >= padh_b
      && Shared->MouseYOld <= padh_top
      && Shared->HoldLeftMouse
      && Shared->ControlPanelOn ){
    Shared->FocusOnControlPad = true;    
  }
  if(!Shared->HoldLeftMouse)
    Shared->FocusOnControlPad = false;; 

  if(Shared->FocusOnControlPad){
    Shared->PadX = Shared->PadX + 0.3*(mousex_new - Shared->MouseXOld);
    if(Shared->PadX >= CONTROLPANEL_BAR_WIDTH)
      Shared->PadX = CONTROLPANEL_BAR_WIDTH;
    else
      if(Shared->PadX <= -CONTROLPANEL_BAR_WIDTH)
	Shared->PadX = -CONTROLPANEL_BAR_WIDTH;

    // Range of speeds: 2^-ANIMATING_SPEED_FACTOR to 2^ANIMATING_SPEED_FACTOR
    AnimationTimeScale = pow(2.0,ANIMATING_SPEED_FACTOR *
			     Shared->PadX/CONTROLPANEL_BAR_WIDTH);

    Shared->ControlPad->setTrans(Shared->PadX, 0.0, 0.0);    
  }

  // else set global orientation
  if( !Shared->FocusOnControlPad && Shared->HoldRightMouse ) {
    if(fabs(Shared->MouseXOld - mousex_new) > 0.00001)
      Shared->RotY += 40*(mousex_new - Shared->MouseXOld);
    if(fabs(Shared->MouseYOld - mousey_new) > 0.00001) {
      Shared->TranY += 60*(mousey_new - Shared->MouseYOld);
    }
  }
  
  if( !Shared->FocusOnControlPad && Shared->HoldLeftMouse ){
    if(fabs(Shared->MouseXOld - mousex_new) > 0.00001)
      Shared->RotZ -= 40*(Shared->MouseXOld - mousex_new);
    if(fabs(Shared->MouseYOld - mousey_new) > 0.00001)
      Shared->RotX += 40*(Shared->MouseYOld - mousey_new);
  }

  if( !Shared->FocusOnControlPad && Shared->HoldMiddleMouse ){
    if(fabs(Shared->MouseXOld - mousex_new) > 0.00001)
      Shared->TranX += 60*(mousex_new - Shared->MouseXOld);
    if(fabs(Shared->MouseYOld - mousey_new) > 0.00001)
      Shared->TranZ += 60*(mousey_new - Shared->MouseYOld);
  }


  // Compute the global transformation matrix

  // Start with identity
  transform.makeIdent();

  // Determine where to take the viewing transformations from
  if (AttachedCameraOn) {
    k = AnimationFrameIndex;
    fi = FrameList.begin();
    for (i = 0; i < (int) FrameList.size(); i++)
      fi++;
    c = *fi;
    for (j = 0; j < 6; j++)
      conf[j] = c[ 6 * S->AttachedCameraBody + j];

    vp = S->AttachedCameraPosition;
    vd = S->AttachedCameraDirection;
    vo = 0.0;  // THIS NEEDS TO BE COMPUTED FROM AttachedCameraZenith

    // Transform the camera according to the attached body
    dtransform.makeTrans(-conf[0], -conf[1], -conf[2]);
    transform.postMult(dtransform);

    dtransform.makeRot(-conf[5]*180.0/PI, 0.0, 0.0, 1.0);
    transform.postMult(dtransform);

    dtransform.makeRot(-conf[4]*180.0/PI, 0.0, 1.0, 0.0);
    transform.postMult(dtransform);

    dtransform.makeRot(-conf[3]*180.0/PI, 1.0, 0.0, 0.0);
    transform.postMult(dtransform);
  }
  else {
    vp = S->GlobalCameraPosition;
    vd = S->GlobalCameraDirection;
    vo = 0.0;  // THIS NEEDS TO BE COMPUTED FROM GlobalCameraZenith
  }

  // Set up the viewing direction
  dtransform.makeTrans(-vp[0], -vp[1], -vp[2]);
  transform.postMult(dtransform);

  dtransform.makeRot(-vo*180.0/PI, vd[0], vd[1], vd[2]);
  transform.postMult(dtransform);

  theta = -asin(sqrt(sqr(vd[0]) + sqr(vd[2])));
  dtransform.makeRot(theta*180.0/PI, vd[2], 0.0, -vd[0]);
  transform.postMult(dtransform);

  // Handle the translation generated by the user
  dtransform.makeTrans(Shared->TranX, Shared->TranY, Shared->TranZ);
  transform.postMult(dtransform);

  // Undo the forced channel viewpoint
  dtransform.makeTrans(0.0, -300.0, 0.0);
  transform.postMult(dtransform);

  // Handle the rotation generated by the user
  dtransform.makeRot(Shared->RotZ, 0.0, 0.0, 1.0);
  transform.postMult(dtransform);
  dtransform.makeRot(Shared->RotY, 0.0, 1.0, 0.0);
  transform.postMult(dtransform);
  dtransform.makeRot(Shared->RotX, 1.0, 0.0, 0.0);
  transform.postMult(dtransform);

  // Set the transformation
  Shared->WorldDCS->setMat(transform);
  
  //Update old mouse position
  Shared->MouseXOld = mousex_new;
  Shared->MouseYOld = mousey_new;
}



void RenderPerformer::HandleEvents() {
  // Handle events from render control window
  Render::HandleEvents();

  // Go to sleep until next frame time.
  pfSync();		
  
  //Collect key input events
  HandleKeyInput();
 
  // handle Mouse events
  HandleMouseEvents();

  // setup body animating
  if (AnimationActive) {
    ShowCurrentAnimationFrame();
  }

  // Always display world
  Shared->WorkEnv->setVal(Shared->WorkEnv->searchChild(Shared->Env));
  Shared->ShowCase->setVal(Shared->ShowCase->searchChild(Shared->WorldDCS));

  // Show Bounding Box
  if (BoundingBoxOn){
    Shared->WorkEnv->setVal(PFSWITCH_ON);
  }

  // Show Control Panel
  if(Shared->ControlPanelOn){
    Shared->ShowCase->setVal(PFSWITCH_ON);
  }

  // Initiate cull/draw for this frame.
  pfFrame();
}



// Draw process callback
void RenderPerformer::DrawChannel(pfChannel *chan, void *) {
  chan->clear();
  pfDraw();
}


