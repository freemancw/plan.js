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



#ifndef MSL_GUI_H
#define MSL_GUI_H

// FOX GUI library
// #include <fx.h>
#include "../../configs/configFOX.h"

#include "problem.h"
#include "scene.h"
#include "render.h"
#include "util.h"

class Render;  // This needs to be here because of mutual reference

//! A generic class for designing graphical user interfaces (GUIs)
/*!
The graphical user interface (GUI) is designed as a hierarchy of
classes to enable specific user interfaces to be designed for a
variety of different motion strategy problems and planning algorithms.
Currently, there is one derived class which serves as the GUI for all
of the RRT-based planners.  Each instance of Gui includes an instance
of an RRT Planner class and an instance of a Render class.  Using this
design, the same basic GUI design can be used, regardless of the
particular rendering methods.  
*/

class Gui {
 protected:
  string FilePath;

  //! Make the menu window
  virtual void CreateWindow() {};

  //! Initialize Gui and Render
  virtual void Init();

  //! The main event processing loop
  virtual void MainLoop();

  //! The window

 public:
  Gui(Render *render);
  virtual ~Gui() {};

  Render *R;

  //! Start running the Gui
  virtual void Start();

  //! Set to true if you want to main loop to terminate
  bool Finished;

  //! Process any IO events (may be used by Render)
  virtual void HandleEvents() = 0;

  //! Figure out what actions to take based on menu choices
  virtual void ButtonHandle(int b) {};
};


// ID numbers for GUIs
// (a simple, not-so-elegant way to avoid name ID conflicts)

enum {
  // Special IDs used by Render
  GID_RENDER_FIRST = FXMainWindow::ID_LAST,
  GID_TOGGLE_SHOWPATH,
  GID_TOGGLE_BOUNDINGBOX,
  GID_TOGGLE_MULTIPLEVIEWS,
  GID_TOGGLE_ATTACHEDCAMERA,
  GID_VCR_STOP,
  GID_VCR_LAST,
  GID_VCR_PAUSE,
  GID_VCR_NEXT,
  GID_VCR_SLOWER,
  GID_VCR_PLAY,
  GID_VCR_FASTER,
  GID_VCR_RESET,
  GID_RENDER_LAST,
  
  // General Gui IDs
  GID_CONSTRUCT,
  GID_PLAN,
  GID_CLEAR_GRAPHS,
  GID_2D_GRAPH,
  GID_SAVE_GRAPHS,
  GID_LOAD_GRAPHS,
  GID_SAVE_FRAMES,
  GID_LOAD_FRAMES,
  GID_SAVE_POLICY,
  GID_LOAD_POLICY,
  GID_DONE,
  
  GID_RRT,
  GID_RRTGOALBIAS,
  GID_RRTCON,
  GID_RRTDUAL,
  GID_RRTEXTEXT,
  GID_RRTEXTCON,
  GID_RRTCONCON,
  GID_RCRRT,
  GID_RCRRTEXTEXT,
  GID_RRTBIDIRBALANCED,
  GID_PRM,
  GID_FDP,
  GID_FDPSTAR,
  GID_FDPBESTFIRST,
  GID_FDPBI,

  GID_LAST
};



#endif
