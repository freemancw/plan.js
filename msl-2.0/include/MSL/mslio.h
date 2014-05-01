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



#ifndef MSL_IO_H
#define MSL_IO_H

#include <list>
#include <fstream>
#include <sstream>
#include <vector>
using namespace std;

template<class T> ostream& operator<<(ostream& out, const list<T>& L);
template<class T> istream& operator>>(istream& in, list<T>& L);
template<class T> ostream& operator<<(ostream& out, const vector<T>& L);
template<class T> istream& operator>>(istream& in, vector<T>& L);

template<class T> ostream& operator<<(ostream& out, const list<T>& L)
{
  typename list<T>::iterator x; 
  list<T> vl;
  vl = L;
  for (x = vl.begin(); x != vl.end(); x++) 
    out << " " << *x;
  return out;
}

template<class T> istream& operator>>(istream& in, list<T>& L)
{ 
  L.clear();
  T x;
  for(;;)
    { 
      char c;
      while (in.get(c) && isspace(c));
      if (!in) break;
      in.putback(c);
      x = T(); in >> x; L.push_back(x);
   }
  return in;
}


template<class T> ofstream& operator<<(ofstream& out, const vector<T>& L)
{
  typename vector<T>::iterator x; 
  vector<T> vl;
  vl = L;
  for (x = vl.begin(); x != vl.end(); x++) 
    out << " " << *x;
  return out;
}


template<class T> ifstream& operator>>(ifstream& in, vector<T>& L)
{ 
  L.clear();
  T x;
  for(;;)
    { 
      char c;
      while (in.get(c) && isspace(c));
      if (!in) break;
      in.putback(c);
      x = T(); in >> x; L.push_back(x);
   }
  return in;
}


#endif
