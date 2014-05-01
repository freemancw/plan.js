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



// RenderPerformer was written by Libo Yang (lyang@cs.iastate.edu)
// Modifications made by Steve LaValle (lavalle@cs.iatate.edu)

#ifndef MSL_RENDERPF_H
#define MSL_RENDERPF_H

#include "triangle.h"
#include "render.h"

#include <Performer/pf/pfChannel.h>
#include <Performer/pf/pfEarthSky.h>
#include <Performer/pf/pfLightSource.h>
#include <Performer/pf/pfNode.h>
#include <Performer/pf/pfGeode.h>
#include <Performer/pf/pfText.h>
#include <Performer/pf/pfScene.h>
#include <Performer/pf/pfGroup.h>
#include <Performer/pf/pfSwitch.h>
#include <Performer/pf/pfDCS.h>
#include <Performer/pf/pfSCS.h>
#include <Performer/pr/pfGeoSet.h>
#include <Performer/pr/pfGeoState.h>
#include <Performer/pr/pfString.h>
#include <Performer/pr/pfFont.h>
#include <Performer/pr/pfMaterial.h>
#include <Performer/pfui.h>
#include <Performer/pfutil.h>
#include <Performer/pfdu.h>
#include <Performer/pr.h>

typedef struct{
  pfPipeWindow *PW;
  pfChannel *Chan;
  pfChannel *ChanEye;
  pfSwitch *ShowCase;
  pfGroup *ControlPanel;
  pfDCS *ControlPad;
  pfDCS *BodiesDCS;
  pfGroup *Env;
  pfGeode *BoundingBox;
  pfSwitch *WorkEnv;
  pfDCS *WorldDCS;
  pfuMouse *Mouse;
  pfuEventStream *InputEvents;
  //static pfLightSource *Sun;

  // Display Control
  double TranX, TranY,TranZ; // Global tranlation offset
  double RotX, RotY, RotZ;  //Global rotation offset

  // Mouse Control
  bool HoldRightMouse, HoldLeftMouse, HoldMiddleMouse;
  //bool ReleaseRightMouse, ReleaseLeftMouse, ReleaseMiddleMouse;
  double MouseXOld, MouseYOld; // Mouse's previous position

  //Control of Eye
  pfMatrix EyeMat;

  //Control of Control panel
  bool ControlPanelOn;
  bool FocusOnControlPad;
  double PadX; 
} SharedData;




//! Perform 3D rendering using the SGI IRIS Performer library
class RenderPerformer: public Render
{
 protected:
  static SharedData *Shared;

  virtual void ShowCurrentAnimationFrame();

  // Loaders
  void LoadEnvironment(pfGroup *env);
  void LoadBodies(pfGroup *bodies);

  //! Load a model that is a list of 2D polygons or 3D triangles
  pfNode* LoadNativeModel(string file, int colorindex);

  void MakeBoundingBox(pfGeode *bound);
  void MakeControlPanel(pfGroup *con, pfDCS *pad);

  void GetCurrentMousePos(double &x, double &y);
  void HandleKeyInput();
  void HandleMouseEvents();
  void GetControlPadSize(double &padwidth_l, double &padwidth_r, 
			 double &padheight_b, double &padheight_top);
  void NormCrossProduct(double v1[3], double v2[3], double out[3]);
  static void DrawChannel(pfChannel *chan, void *data);

 public:
  RenderPerformer();
  RenderPerformer(string filepath);
  RenderPerformer(Scene *s, string filepath);
  virtual ~RenderPerformer() {};

  virtual void Init();
  virtual void HandleEvents();
  virtual void Terminate();
};

#endif
