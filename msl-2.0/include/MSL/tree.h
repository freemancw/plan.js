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


#
#ifndef MSL_TREE_H
#define MSL_TREE_H

#include <list>
#include <string>
using namespace std;


#include "vector.h"
#include "mslio.h"

class MSLTree;

class MSLNode {
 private:
  MSLVector state;
  MSLVector input;
  MSLNode* parent;
  list<MSLNode*> children;
  double time;
  double cost;
  int id;

  void* info;

 public:
  //! The state to which this node corresponds
  MSLVector State() const {return state; };

  //! The input vector that leads to this state from the parent
  inline MSLVector Input() const {return input; };

  inline MSLNode* Parent() {return parent; };
  inline list<MSLNode*> const Children() {return children; };
  
  //! The time required to reach this node from the parent
  inline double Time() const {return time; };

  //! A cost value, useful in some algorithms
  inline double Cost() const {return cost; };

  //! A cost value, useful in some algorithms
  inline void SetCost(const double &x) {cost = x; };

  //! Change the node ID
  inline void SetID(const int &i) {id = i; };

  //! Get the node ID
  inline int ID() const {return id; };

  //! Get the information 
  void* GetInfo() {return info; };
  
  //! Set the information
  void SetInfo(void* in) {info = in; };

  //! Clear the memory for the information
  //void ClearInfo() {if (!info) delete (MSLNodeInfo *) info; };
  //NOTE: Above incorrect design - shouldn't type the void* here

  MSLNode();
  MSLNode(void* pninfo);
  MSLNode(MSLNode* pn, const MSLVector &x, const MSLVector &u);
  MSLNode(MSLNode* pn, const MSLVector &x, const MSLVector &u, double t);
  MSLNode(MSLNode* pn, const MSLVector &x, const MSLVector &u, double t, void* pninfo);
  ~MSLNode() { children.clear(); /*ClearInfo();*/ };

  inline void AddChild(MSLNode *cn) { children.push_back(cn); }

  //friend istream& operator>> (istream& is, MSLNode& n);
  friend ostream& operator<< (ostream& os, const MSLNode& n);
  //friend istream& operator>> (istream& is, list<MSLNode*> & nl);
  friend ostream& operator<< (ostream& os, const list<MSLNode*> & nl);

  friend class MSLTree;
};


//! This is a comparison object to be used for STL-based sorting
class MSLNodeLess {
 public:
  bool operator() (MSLNode* p, MSLNode* q) const {
    return p->Cost() < q->Cost();
  }
};


//! This is a comparison object to be used for STL-based sorting
class MSLNodeGreater {
 public:
  bool operator() (MSLNode* p, MSLNode* q) const {
    return p->Cost() > q->Cost();
  }
};


class MSLTree {
 private:
  list<MSLNode*> nodes;
  MSLNode* root;
  int size;
 public:

  MSLTree();
  MSLTree(const MSLVector &x); // Argument is state of root node
  MSLTree(const MSLVector &x, void* nodeinfo);
  ~MSLTree();

  void MakeRoot(const MSLVector &x);
  MSLNode* Extend(MSLNode *parent, const MSLVector &x, const MSLVector &u);
  MSLNode* Extend(MSLNode *parent, const MSLVector &x, const MSLVector &u, 
		  double time);
  MSLNode* Extend(MSLNode *parent, const MSLVector &x, const MSLVector &u, 
		  double time, void* pninfo);

  list<MSLNode*> PathToRoot(MSLNode *n);
  MSLNode* FindNode(int nid);
  inline list<MSLNode*> Nodes() const { return nodes; };
  inline MSLNode* Root() {return root; };
  inline int Size() {return size;}

  void Clear();

  friend istream& operator>> (istream& is, MSLTree& n);
  friend ostream& operator<< (ostream& os, const MSLTree& n);
};

#endif

