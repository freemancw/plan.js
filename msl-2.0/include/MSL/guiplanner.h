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



#ifndef MSL_GUIPLANNER_H
#define MSL_GUIPLANNER_H

#include <math.h>
#include <cstdio>
//#include <fstream.h>
#include <sys/stat.h>
#include <signal.h>

//#include <fx.h>
#include "../../configs/configFOX.h"


#include "gui.h"
#include "defs.h"
#include "planner.h"
#include "rrt.h"
#include "rcrrt.h"
#include "prm.h"
#include "fdp.h"
#include "util.h"


//A quick fix to solve some FOX version problems. Benjamin
// typedef FXMenuBar FXMenubar;

//! A rendering-independent GUI for the Planner classes

class GuiPlanner;
class MSLPlotWindow;

class MSLPlannerWindow : public FXMainWindow {
  FXDECLARE(MSLPlannerWindow)
protected:
  FXMenubar*         menubar;
  FXMenubar*         vcrbar;
  FXMenubar*         buttonbar;
  FXMenuPane*        loadmenu;
  FXMenuPane*        savemenu;
  FXMenuPane*        plotmenu;
  FXMenuPane*        plannermenu;
  FXMatrix*          matrix;

  FXDataTarget       plannerdeltat_target;
  FXDataTarget       numnodes_target;
  FXDataTarget       drawindexx_target;
  FXDataTarget       drawindexy_target;
  FXDataTarget       animationtimescale_target;
  FXDataTarget       realAnimationtimescale_target;
  FXDataTarget       ambientlight_target;

  GuiPlanner*        GP;

public:
  MSLPlannerWindow() {}
  MSLPlannerWindow(GuiPlanner* gp);
  virtual ~MSLPlannerWindow();

  void create();
  void Restart();
  long onCmdTimer(FXObject*,FXSelector,void*);
  long GeneralHandler(FXObject*,FXSelector,void*);

  friend class GuiPlanner;
  friend class MSLPlotWindow;

};



class MSLPlotWindow : public FXDialogBox {

  // Macro for class hierarchy declarations
  FXDECLARE(MSLPlotWindow)
private:

  FXHorizontalFrame *contents;                // Content frame
  FXVerticalFrame   *canvasFrame;             // Canvas frame
  FXVerticalFrame   *buttonFrame;             // Button frame
  FXCanvas          *canvas;                  // Canvas to draw into
  int               indexx,indexy;
  
protected:
  MSLPlotWindow(){}

  MSLPlannerWindow* Owner;
  GuiPlanner* GP;

public:

  // Message handlers
  long onPaint(FXObject*,FXSelector,void*);
  long onCmdPrint(FXObject*,FXSelector,void*);
  
  MSLPlotWindow(MSLPlannerWindow* owner);

  void drawPage(FXDC& dc,FXint w,FXint h,FXint tx = 0,FXint ty = 0);

  // Messages for our class
  enum{
    ID_CANVAS=FXMainWindow::ID_LAST,
    ID_PRINT,
    ID_LAST
    };
};



class GuiPlanner: public FXApp, public Gui {
 protected:
  virtual void Init();
  virtual void CreateMenuWindow();

  MSLPlannerWindow* Window;
 public:
  virtual void HandleEvents();
  virtual void ButtonHandle(int b);
  double LineWidth;
  double PSLineWidth;
  int DrawIndexX,DrawIndexY;
  Planner *Pl;
  GuiPlanner(Render *render, Planner *planner);
  virtual ~GuiPlanner(){};
  void ResetPlanner();
  void WriteGraphs();
  void ReadGraphs();
  //  void DrawGraphs();
  void ReadAnimationFrames();
  void WriteAnimationFrames();
  void ReadPolicy();
  void WritePolicy();
  void DrawGraphs();

  friend class MSLPlotWindow;
};

#endif
