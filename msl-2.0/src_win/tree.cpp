//----------------------------------------------------------------------
//               The Motion Strategy Library (MSL)
//----------------------------------------------------------------------
//
// Copyright (c) University of Illinois and Steven M. LaValle.     
// All Rights Reserved.
// 
// Permission to use, copy, and distribute this software and its 
// documentation is hereby granted free of charge, provided that 
// (1) it is not a component of a commercial product, and 
// (2) this notice appears in all copies of the software and
//     related documentation. 
// 
// The University of Illinois and the author make no representations
// about the suitability or fitness of this software for any purpose.  
// It is provided "as is" without express or implied warranty.
//----------------------------------------------------------------------

#include "tree.h"

/*ostream& operator<<(ostream& out, const list<MSLNode*>& L)
{
  list<MSLNode*>::iterator x;
  for (x = L.begin(); x != L.end(); x++)
    out << " " << **x;

  return out;
}
*/


// *********************************************************************
// *********************************************************************
// CLASS:     MSLNode class
// 
// *********************************************************************
// *********************************************************************

MSLNode::MSLNode() { 
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


ostream& operator<<(ostream& out, const MSLNode& n)
{
  out << n.ID();
  if (n.Parent()) 
    out << " " << n.Parent()->ID();
  else
    out << " -1";
  out << " " << n.State() << " " << n.Input();
  out << "\n";

  return out;
}

ostream& operator<< (ostream& os, const MSLNode* n){
  os << n->ID();
  if (n->Parent()) 
    os << " " << n->Parent()->ID();
  else
    os << " -1";
  os << " " << n->State() << " " << n->Input();
  os << "\n";

  return os;
}

// *********************************************************************
// *********************************************************************
// CLASS:     MSLTree class
// 
// *********************************************************************
// *********************************************************************


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


ostream& operator<< (ostream& os, const MSLTree& n) {
  os << n.Size() << "\n" << n.Nodes();

  return os;
}
