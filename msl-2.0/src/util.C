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



#if defined(__unix__)
#include <unistd.h>
#include <pwd.h>
#include <sys/time.h>
#include <sys/times.h>
#include <sys/types.h>
#endif

#ifdef WIN32
#include <time.h>
#endif

#include "MSL/util.h"

float used_time()
{ 
#if defined(__unix__)

#if defined(CLK_TCK)
  long clk_tck = CLK_TCK;
#else
  //  long clk_tck = HZ;
  long clk_tck = sysconf(_SC_CLK_TCK);
#endif

  tms x;
  times(&x);
  return  float(x.tms_utime)/clk_tck;

#else

  return  float(clock())/CLOCKS_PER_SEC;

#endif
}


float used_time(float& T)
{ float t = T;
  T = used_time();
  return  T-t;
}

/*
ostream& operator<<(ostream& out, const list<string>& L)
{
  list<string>::iterator x; 
  list<string> vl;
  vl = L;
  for (x = vl.begin(); x != vl.end(); x++) 
    out << *x << "\n";
  return out;
}


istream& operator>>(istream& in, list<string>& L)
{ 
  L.clear();
  string x;
  for(;;)
    { 
      char c;
      while (in.get(c) && isspace(c));
      if (!in) break;
      in.putback(c);
      x = string(); in >> x; L.push_back(x);
    }
  return in;
}

ostream& operator<<(ostream& out, const list<int>& L)
{
  list<int>::iterator x; 
  list<int> vl;
  vl = L;
  for (x = vl.begin(); x != vl.end(); x++) 
    out << *x << "\n";
  return out;
}


istream& operator>>(istream& in, list<int>& L)
{ 
  L.clear();
  int x;
  for(;;)
    { 
      char c;
      while (in.get(c) && isspace(c));
      if (!in) break;
      in.putback(c);
      in >> x; L.push_back(x);
    }
  return in;
}
*/


bool is_file(string fname)
{ struct stat stat_buf;
  if (stat(fname.c_str(),&stat_buf) != 0) return false;
  return (stat_buf.st_mode & S_IFMT) == S_IFREG;
}


bool is_directory(string fname)
{ struct stat stat_buf;
  if (stat(fname.c_str(),&stat_buf) != 0) return false;
  return (stat_buf.st_mode & S_IFMT) == S_IFDIR;
}
