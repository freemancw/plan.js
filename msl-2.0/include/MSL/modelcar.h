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



#ifndef MSL_MODELCAR_H
#define MSL_MODELCAR_H

#include <list>
#include <string>

#include "model2d.h"
#include "vector.h"
#include "matrix.h"


//! The same model as Model2DRigidCar
class ModelCar: public Model2DRigidCar {
 public:
  double Speed;

  ModelCar(string path);
  virtual ~ModelCar() {};
  virtual MSLVector StateToConfiguration(const MSLVector &x);
  virtual bool Satisfied(const MSLVector &state); 
};


//! The same model as Model2DRigidCarSmooth
class ModelCarSmooth: public Model2DRigidCarSmooth {
 public:
  ModelCarSmooth(string path);
  virtual ~ModelCarSmooth() {};
  virtual MSLVector StateToConfiguration(const MSLVector &x);
};


//! The same model as Model2DRigidDyncar
class ModelCarDyn: public Model2DRigidDyncar {
 public:
  ModelCarDyn(string path);
  virtual ~ModelCarDyn() {};
  virtual MSLVector StateToConfiguration(const MSLVector &x);
  virtual double Metric(const MSLVector &x1, const MSLVector &x2);
};

//! The same model as Model2DRigidDyncarNtire 
class ModelCarDynNtire: public Model2DRigidDyncarNtire {
 public:
  ModelCarDynNtire(string path);
  virtual ~ModelCarDynNtire() {};
  virtual MSLVector StateToConfiguration(const MSLVector &x);
  virtual double Metric(const MSLVector &x1, const MSLVector &x2);
};


//! A car model considering the rolling effect and the pressure on
//! different tires of the car is different. If the pressure on one tire
//! is 0, the car is considered rolling over.  
//! The pressure model of the tire is rigid such that pressure can
//! change at instant time, which means: 
//! (1) It might be the reason that only forward RRT tree works. 
//! (2) In the SelectInput function, pressure has to be restored when to
//! test new inputs.
class ModelCarDynRollover: public ModelCarDynNtire{  
 public:
  double K, c, Ixx;
  double T;
  double H, H2;
  double Ms;
  double Wn;
  double Fai;
  double x; 
  
  bool IsRollOver;

  ModelCarDynRollover(string path);
  virtual ~ModelCarDynRollover() {};

  int sgn(double x);

  virtual MSLVector StateTransitionEquation(const MSLVector &x1, const MSLVector &u);

  virtual MSLVector StateToConfiguration(const MSLVector &x);
  
  virtual MSLVector Integrate(const MSLVector &x, const MSLVector &u, const double &h);   

  virtual double Metric(const MSLVector &x1, const MSLVector &x2);

  bool RollOverFree(const MSLVector &x);

  bool Satisfied(const MSLVector &x);
};


//! One more dimension than ModelCarDynRollover considering the
//! steering angle can only change continuously.
class ModelCarDynSmoothRollover: public ModelCarDynRollover {
 public:
 
  ModelCarDynSmoothRollover(string path);
  virtual ~ModelCarDynSmoothRollover() {};

  virtual MSLVector StateTransitionEquation(const MSLVector &x1, const MSLVector &u);

  virtual MSLVector StateToConfiguration(const MSLVector &x);

  virtual double Metric(const MSLVector &x1, const MSLVector &x2);
  
  virtual MSLVector LinearInterpolate(const MSLVector &x1, 
				      const MSLVector &x2, 
				      const double &a);
  
};

#endif








