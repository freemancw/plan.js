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
#include <stdio.h>
//#include <fstream.h>

#include "MSL/gui.h"
#include "MSL/defs.h"


// *********************************************************************
// *********************************************************************
// CLASS:     Gui base class
// 
// *********************************************************************
// *********************************************************************

Gui::Gui(Render *render) {
  R = render;

  FilePath = R->FilePath;
}


void Gui::Init() 
{
  // Perform Render initialization
  R->Init();
}



void Gui::Start() 
{
  // Perform initialization
  Init();

  // Enter the event processing loop
  MainLoop();
}




void Gui::MainLoop() 
{
  int i;
  if (R->ControlFreak) // Does the renderer NEED to be in control?
    R->MainLoop(this); // Give a pointer to this Gui
    // It is the responsibility of Render to handle Gui events
  else {
    Finished = false;
    while (!Finished) {
      R->HandleEvents(); // Handle events in the renderer
      for (i = 0; i < 10; i++) // Need to make this better!!!!! 
	HandleEvents();
    }
  }

  R->Terminate();  // If we ever get here (some control freaks don't allow it)
}

