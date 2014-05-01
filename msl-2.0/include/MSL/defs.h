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


#ifndef MSL_DEFS_H
#define MSL_DEFS_H

#ifndef PI
#define PI 3.1415926535897932385
#endif 
#ifndef INFINITY
#define INFINITY 1.0e40
#endif
#ifndef sqr
#define sqr(x) ((x)*(x))
#endif
#ifndef min
#define min(x,y) ((x<y) ? x : y)
#endif
#ifndef max
#define max(x,y) ((x>y) ? x : y)
#endif

#ifndef MSL_GLOBAL_VARS
#define MSL_GLOBAL_VARS

#include <fstream>
#include <iostream>
using namespace std;


static std::ifstream _msl_fin;
#endif

#define READ_OPTIONAL_PARAMETER(F)\
_msl_fin.clear();\
_msl_fin.open((FilePath+""#F"").c_str());\
if (_msl_fin) {_msl_fin >> F;}\
_msl_fin.close();\

#define READ_PARAMETER_OR_DEFAULT(F,D)\
_msl_fin.clear();\
_msl_fin.open((FilePath+""#F"").c_str());\
if (_msl_fin) {_msl_fin >> F;}\
else F = D;\
_msl_fin.close();\

#define READ_PARAMETER_OR_ERROR(F)\
_msl_fin.clear();\
_msl_fin.open((FilePath+""#F"").c_str());\
if (_msl_fin) {_msl_fin >> F; _msl_fin.close();}\
else {cerr << "Error reading "#F"\n"; exit(-1);}\
_msl_fin.close();\
  
// Convenient list iterator
#define forall(x,S)\
for (x = S.begin(); x != S.end(); x++)\

#endif



