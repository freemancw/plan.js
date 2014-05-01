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

#include "MSL/render.h"
#include "MSL/defs.h"

// Include the VCR buttons
#include "pixmaps/ff.xpm"
#include "pixmaps/pause.xpm"
#include "pixmaps/play.xpm"
#include "pixmaps/rw.xpm"
#include "pixmaps/stop.xpm"
#include "pixmaps/prev.xpm"
#include "pixmaps/next.xpm"

// Include the msl icon
#include "pixmaps/msl.xpm"


////////////////////////////////////////////////////////
//
// Render Class
//
///////////////////////////////////////////////////////

Render::Render() {
  Render("");

  
}


Render::Render(string filepath)
{
  FilePath = filepath;
}


Render::Render(Scene *s, string filepath)
{
  SetScene(s);

  FilePath = filepath;
  ControlFreak = false;
}


// This sets up the file names for the environment and movable bodies
void Render::Init()
{
  int i;
  std::ifstream fin;
  Reset();

  FrameTime = 0.1; // This is default; each renderer should determine this
  AnimationStartPause = 0.0; // should be in seconds
  AnimationEndPause = 0.0;
  RenderCtlWindowOn = false;

  AttachedCameraOn = false;
  BoundingBoxOn = false;
  MultipleViewsOn = false;
  ShowPathOn = false;

  // Colors for objects (add more if you like, but increase RENDERCOLORS)
  //RGBRed[0] = .467; RGBGreen[0] = 0.53; RGBBlue[0] = 0.6; // Light Slate Gray
  RGBRed[0] = 1.0; RGBGreen[0] = 0.0; RGBBlue[0] = 1.0; // Magenta
  RGBRed[1] = 0.8; RGBGreen[1] = 0.0; RGBBlue[1] = 0.0; // Red
  RGBRed[2] = 0.0; RGBGreen[2] = 0.7; RGBBlue[2] = 0.0; // Green
  RGBRed[3] = 0.7; RGBGreen[3] = 0.7; RGBBlue[3] = 0.0; // Yellow
  RGBRed[4] = 0.0; RGBGreen[4] = 0.7; RGBBlue[4] = 0.7; // Lightblue
  RGBRed[5] = 1.0; RGBGreen[5] = 0.0; RGBBlue[5] = 1.0; // Magenta
  RGBRed[6] = 0.0; RGBGreen[6] = 0.0; RGBBlue[6] = 0.7; // Blue
  RGBRed[7] = 1.0; RGBGreen[7] = 0.65; RGBBlue[7] = 0.0; // Orange
  RGBRed[8] = 1.0; RGBGreen[8] = 0.078; RGBBlue[8] = 0.576; // DeepPink
  RGBRed[9] = 1.0; RGBGreen[9] = 0.51; RGBBlue[9] = 0.278; // Sienna1

  fin.clear();
  fin.open((FilePath + "EnvList").c_str());
  if (fin)
    fin >> EnvList;
  else {
    fin.clear();
    fin.open((FilePath + "Obst").c_str());
    if (fin)
      EnvList.push_back("Obst");
  }
  fin.close();

  //cout << "EnvList: " << EnvList.size() << endl;

  char* s = new char[50];

  // Load bodies
  fin.clear();
  fin.open((FilePath+"BodyList").c_str());
  if (fin)
    fin >> BodyList;
  else {
    fin.clear();
    fin.open((FilePath+"Robot").c_str());
    if (fin)
      BodyList.push_back("Robot");
    else { // Multiple robots 
      for (i = 0; i < S->NumBodies; i++) {
	    sprintf(s,"%sRobot%d",FilePath.c_str(),i);
	    fin.clear();
		fin.open(s);
	    if (fin) {
	      sprintf(s,"Robot%d",i);
	      BodyList.push_back(string(s)); // Use the robot from World
		}
		fin.close();
      }
    }
  }

  // Close ifstream
  fin.close();

  //cout << "BodyList: " << BodyList.size() << endl;
}



void Render::SetScene(Scene *s) 
{
  S = s; // S is the Scene for Render
}


void Render::MakeAnimationFrames(const list<MSLVector> &xlist, double deltat) 
{
  double t;
  int i;

  StateList = xlist;
  TimeList.clear();
  
  t = 0.0;
  for (i = 0; i < (int) xlist.size(); i++) {
    TimeList.push_back(t);
    t += deltat;
  }
  
  SetFrameList();
}


void Render::MakeAnimationFrames(const list<MSLVector> &xlist,
				 const list<double> &timelist) 
{
  StateList = xlist;
  TimeList = timelist;
  SetFrameList();
}


void Render::SetFrameList() {
  double ltime; // Lower time
  double utime; // Upper time
  double crtime; // Current time
  double lasttime;
  double lambda;
  MSLVector sc; // scene configuration
  MSLVector lx,ux; // lower and upper states
  int i;
  list<MSLVector>::iterator stli,tstli;
  list<double>::iterator tli,li;

  //cout << "Running SetFrameList\n";
  //cout << "StateList: " << StateList << "\n";
  //cout << "TimeList: " << TimeList << "\n";

  FrameList.clear();
  NumFrames = 0;

  if (TimeList.size() < 2) {
    if (TimeList.size() == 1) {
      FrameList.push_back(S->StateToSceneConfiguration(StateList.front()));
      NumFrames = 1;
    }
    return;
  }

  // Make the starting pause
  for (i = 0; i < (int) (AnimationStartPause/FrameTime); i++) {
    FrameList.push_back(S->StateToSceneConfiguration(StateList.front()));
    NumFrames++;
  }

  li = TimeList.begin(); li++;
  stli = StateList.begin(); stli++;
  utime = *li;  // Time index of second element
  ux = *stli;
  ltime = TimeList.front();
  lx = StateList.front();
  crtime = ltime;
  lasttime = TimeList.back();
  tli = li; tli++;
  while (crtime <= lasttime) {
    while ((utime < crtime)&&  // Make sure the crtime within upper and lower
	   (tli != TimeList.end())) {
      li++;
      stli++;
      utime = *li;
      ux = *stli;
      tli = li; tli++;
    }
    tli = li; tli--;
    ltime = *tli;
    tstli = stli; tstli--;
    lx = *tstli;
    while (ltime > crtime) { // This can happen sometimes (I think)!
      tli--;
      tstli--;
      ltime = *tli;
      lx = *tstli;
    }

    lambda = (crtime - ltime)/(utime - ltime);
    //cout << "lambda: " << lambda << "\n";

    // Interoplate based on states lx and ux
    sc = S->InterpolatedSceneConfiguration(lx,ux,lambda);
    FrameList.push_back(sc);
    NumFrames++;
    crtime += FrameTime;
  }
  
  // Add in the last frame, if necessary
  if (FrameList.back() != (S->StateToSceneConfiguration(StateList.back())))
    FrameList.push_back(S->StateToSceneConfiguration(StateList.back()));

  // Make the ending pause
  for (i = 0; i < (int) (AnimationEndPause/FrameTime); i++) {
    FrameList.push_back(S->StateToSceneConfiguration(StateList.back())); 
    NumFrames++;
  }

  //list<MSLVector>::iterator x;
  //cout << "StateList:\n";
  //forall(x,StateList)
  //  cout << *x << "\n";
  //cout << "TimeList: " << TimeList << "\n";
  //cout << "\n\nFrameList:\n";
  //forall(x,FrameList)
  //  cout << *x << "\n";
  //cout << "NumFrames: " << NumFrames << "\n";
}


void Render::SetCurrentAnimationFrame() {
  MSLVector c(S->SceneConfigurationDim);
  int num,skip,i;

  // How long has the frame been stuck?
  FrameStuckTime = used_time() - LastFrameTime;

  if (AnimationTimeScale != AnimationTimeScale_prev) {   
    //this means the slider bar has moved
    AnimationTimeScale_prev = AnimationTimeScale;
    realAnimationTimeScale = pow(2.0, AnimationTimeScale/10.0);
    realAnimationTimeScale_prev = realAnimationTimeScale;
  }

  if (realAnimationTimeScale != realAnimationTimeScale_prev) {   
    //this means the text box has been updated
    realAnimationTimeScale_prev = realAnimationTimeScale;
    AnimationTimeScale = (log(realAnimationTimeScale)/log(2.0)) * 10.0;
    AnimationTimeScale_prev = AnimationTimeScale;
  }

  skip = (int) (realAnimationTimeScale * FrameStuckTime / FrameTime);

  if (skip > 0) {
    AnimationFrameIndex += skip;
    used_time(LastFrameTime);
  }
    
  num = FrameList.size();
  if (AnimationFrameIndex > num - 1) {
    AnimationFrameIndex = 0;
    used_time(LastFrameTime);
  }

  if (AnimationFrameIndex < 0) {
    AnimationFrameIndex = 0;
    used_time(LastFrameTime);
  }

  if (num > 0) {
    list<MSLVector>::iterator fi;
    fi = FrameList.begin();
    for (i = 0; i < AnimationFrameIndex - 1; i++)
      fi++;
    c=*fi;
  }

  CurrentAnimationFrame = c;
}


void Render::ButtonHandle(int b) 
{
  int i;
  list<MSLVector>::iterator fi;
  //cout << "Button " << b << "\n";

  switch (b) {

  case GID_VCR_PLAY: // Play
    if (!AnimationActive) {
      used_time(LastFrameTime);
      AnimationActive = true;
    }
    break;
  case GID_VCR_STOP: // Stop
      AnimationActive = false;
      AnimationFrameIndex = 0;
      LastFrameTime = 0.0;;
      used_time(LastFrameTime);
    break;
  case GID_VCR_PAUSE: // Pause
    if (AnimationActive) {
      AnimationActive = false;
    }
    else {
      AnimationActive = true;
      used_time(LastFrameTime);
    }
    cout << "Frame: " << AnimationFrameIndex << "   Time stamp: " 
	 << AnimationFrameIndex*FrameTime << "s\n";
    break;
  case GID_VCR_SLOWER: // Deccelerate animation
    AnimationTimeScale -= 5.0;
    realAnimationTimeScale /= 1.41421356237; // Two presses doubles the speed
    AnimationTimeScale_prev = AnimationTimeScale;
    realAnimationTimeScale_prev = realAnimationTimeScale;
    break;
  case GID_VCR_FASTER: // Accelerate animation
    AnimationTimeScale += 5.0;
    realAnimationTimeScale *= 1.41421356237; // Two presses doubles the speed
    AnimationTimeScale_prev = AnimationTimeScale;
    realAnimationTimeScale_prev = realAnimationTimeScale;
    break;
  case GID_VCR_RESET:
    Reset();
    break;
  case GID_VCR_LAST: // Prev frame
    AnimationActive = false;
    if (AnimationFrameIndex > 0)
      AnimationFrameIndex--;
    else
      AnimationFrameIndex = FrameList.size() - 1;
    fi = FrameList.begin();
    for (i = 0; i < AnimationFrameIndex - 1; i++)
      fi++;
    CurrentAnimationFrame = *fi;
    ShowCurrentAnimationFrame();
    cout << "Frame: " << AnimationFrameIndex << "   Time stamp: " 
	 << AnimationFrameIndex*FrameTime << "s\n";
   break;
  case GID_VCR_NEXT: // Next frame
    AnimationActive = false;
    if (AnimationFrameIndex < (int) FrameList.size() - 1)
      AnimationFrameIndex++;
    else
      AnimationFrameIndex = 0;
    fi = FrameList.begin();
    for (i = 0; i < AnimationFrameIndex - 1; i++)
      fi++;
    CurrentAnimationFrame = *fi;
    ShowCurrentAnimationFrame();
    cout << "Frame: " << AnimationFrameIndex << "   Time stamp: " 
	 << AnimationFrameIndex*FrameTime << "s\n";
    break;
  case GID_TOGGLE_SHOWPATH: cout << "Toggle Show Path\n";
      ShowPathOn = !ShowPathOn; 
      break;
  case GID_TOGGLE_ATTACHEDCAMERA: cout << "Toggle Attached Camera\n";
      AttachedCameraOn = !AttachedCameraOn; 
      break;
  case GID_TOGGLE_MULTIPLEVIEWS: cout << "Toggle Multiple Views\n";
      MultipleViewsOn = !MultipleViewsOn; 
      break;
  case GID_TOGGLE_BOUNDINGBOX: cout << "Toggle Bounding Box\n";
      BoundingBoxOn = !BoundingBoxOn; 
      break;
  default: cout << "Option " << b << " not implemented\n";
    break;
  }
}



void Render::MainLoop(Gui *g) {

  g->Finished = false;
  while (!g->Finished) {
    g->HandleEvents();
    HandleEvents();
  }

}



void Render::Reset() {
  AnimationActive = false;
  AnimationFrameIndex = 0;
  if (FrameList.size() > 0)
    CurrentAnimationFrame = FrameList.front();
  else
    CurrentAnimationFrame = MSLVector(S->SceneConfigurationDim);

  AnimationTimeScale = 0.0;
  realAnimationTimeScale = pow(2.0, AnimationTimeScale/10.0);
  AnimationTimeScale_prev = AnimationTimeScale;
  realAnimationTimeScale_prev = realAnimationTimeScale;

  LastFrameTime = 0.0;
  used_time(LastFrameTime);

  // Leave these next four alone because the GUI is not connected to them
  //AttachedCameraOn = false;
  //BoundingBoxOn = false;
  //MultipleViewsOn = false;
  //ShowPathOn = false;
  AmbientLight = 0.2;
}
