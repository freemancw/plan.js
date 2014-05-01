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




#include "MSL/tree.h"

// *********************************************************************
// *********************************************************************
// CLASS:     MSLNode class
// 
// *********************************************************************
// *********************************************************************

ostream& operator<<(ostream& out, const MSLNode& n)
{
  out << n.id;
  if (n.parent) 
    out << " " << n.parent->id;
  else
    out << " -1";
  out << " " << n.state << " " << n.input;
  out << "\n";

  return out;
}


ostream& operator<<(ostream& out, const list<MSLNode*>& L)
{
  list<MSLNode*>::iterator x; 
  list<MSLNode*> vl;
  vl = L;
  for (x = vl.begin(); x != vl.end(); x++) 
    out << " " << **x;
  return out;
}




MSLNode::MSLNode() { 
}


MSLNode::MSLNode(void* pninfo) { 
  info = pninfo;
}


MSLNode::MSLNode(MSLNode *pn, const MSLVector &x, const MSLVector &u) {
  state = x;
  input = u;
  parent = pn;
  time = 1.0; // Make up a default
  cost = 0.0;
}


MSLNode::MSLNode(MSLNode *pn, const MSLVector &x, const MSLVector &u, double t) {
  state = x;
  input = u;
  parent = pn;
  time = t;
  cost = 0.0;
}

MSLNode::MSLNode(MSLNode *pn, const MSLVector &x, const MSLVector &u, double t, void* pninfo) {
  state = x;
  input = u;
  parent = pn;
  time = t;
  cost = 0.0;

  info = pninfo;
}


// *********************************************************************
// *********************************************************************
// CLASS:     MSLTree class
// 
// *********************************************************************
// *********************************************************************


ostream& operator<< (ostream& os, const MSLTree& T) {
  list<MSLNode*>::iterator x;
  list<MSLNode*> vl;
  vl = T.nodes;
  os << T.size << "\n";
  for (x = vl.begin(); x != vl.end(); x++) 
    os << **x;
  return os;
}



istream& operator>> (istream& is, MSLTree & T) {
  int i,nid,pid,tsize;
  MSLVector x,u;
  MSLNode *pnode,*n; // Parent node

  T.Clear();

  is >> tsize;
  cout << "Loading a tree that has " << tsize << " nodes\n";
  for (i = 0; i < tsize; i++) {
    is >> nid >> pid >> x >> u;
    pnode = T.FindNode(pid);
    if (pnode) {
      n = T.Extend(pnode,x,u);
      n->SetID(nid);
    }
    else
      T.MakeRoot(x);
  }

  return is; 
}


MSLTree::MSLTree() { 
  root = NULL;
  size = 0;
}


MSLTree::MSLTree(const MSLVector &x) { 
  MSLVector u;

  root = new MSLNode(NULL,x,u,0.0);
  root->id = 0;
  nodes.push_back(root);
  size = 1;
}


MSLTree::MSLTree(const MSLVector &x, void* nodeinfo) { 
  MSLVector u;

  root = new MSLNode(NULL,x,u,0.0,nodeinfo);
  root->id = 0;
  nodes.push_back(root);
  size = 1;
}


MSLTree::~MSLTree() {
  Clear();
}


void MSLTree::MakeRoot(const MSLVector &x) {
  MSLVector u;
  
  if (!root) {
    root = new MSLNode(NULL,x,u,0.0);
    root->id = 0;
    nodes.push_back(root);
  }
  else
    cout << "Root already made.  MakeRoot has no effect.\n";
  size = 1;
}


MSLNode* MSLTree::Extend(MSLNode *parent, const MSLVector &x, const MSLVector &u) {
  MSLNode *nn;

  nn = new MSLNode(parent, x, u);
  nn->id = size;
  nodes.push_back(nn);
  size++;

  return nn;
}



MSLNode* MSLTree::Extend(MSLNode *parent, const MSLVector &x, 
			 const MSLVector &u,
			 double time) {
  MSLNode *nn;

  nn = new MSLNode(parent, x, u, time);
  nn->id = size;
  nodes.push_back(nn);
  size++;

  return nn;
}


MSLNode* MSLTree::Extend(MSLNode *parent, const MSLVector &x, 
			 const MSLVector &u,
			 double time, void* pninfo) {
  MSLNode *nn;

  nn = new MSLNode(parent, x, u, time, pninfo);
  nn->id = size;
  nodes.push_back(nn);
  size++;

  return nn;
}



MSLNode* MSLTree::FindNode(int nid) {
  list<MSLNode*>::iterator ni;

  for(ni = nodes.begin(); ni != nodes.end(); ni++) {
    if ((*ni)->id == nid)
      return *ni;
  }

  return NULL; // Indicates failure
}



list<MSLNode*> MSLTree::PathToRoot(MSLNode *n) {
  list<MSLNode*> nl;
  MSLNode *ni;
  
  ni = n;
  while (ni != root) {
    nl.push_back(ni);
    ni = ni->Parent();
  }

  nl.push_back(root);
 
  return nl;
}


void MSLTree::Clear() {
  list<MSLNode*>::iterator n; 
  for (n = nodes.begin(); n != nodes.end(); n++)
    delete *n;
  nodes.clear();
  root = NULL;
}
