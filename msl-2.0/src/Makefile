################################################################
#
# Makefile for the Motion Strategy Library
#
# This is the non-configurable part of the Makefile.
# See the file 'Makefile.config' for configuration switches.
#
#
################################################################

.SUFFIXES: .C .o

# configurable part of the Makefile
include ../Makefile.config

######## INC configuration

#INC = $(FOXINC) $(XINC) $(PQPINC) $(OTHERINC)
INC = $(PQPINC) $(OTHERINC)

######## LIB configuration

#LIB = $(FOXLIB) $(XLIB) $(PQPLIB) $(OTHERLIB)
LIB = $(PQPLIB) $(OTHERLIB)

DEPINC = $(STDCCINC)

######## Flags

#DEPFLAGS = $(FOXFLAGS) $(PQPFLAGS)
DEPFLAGS = $(PQPFLAGS)
FLAGS = $(C++FLAGS) $(DEPFLAGS)

DEPSRC = *.C

####### How to make things

renderglobj.o:
	$(C++) $(C++FLAGS) $(GLFLAGS) -c renderglobj.C $(INC)

renderpf.o:
	$(C++) $(C++FLAGS) $(PFFLAGS) -c renderpf.C $(INC)

renderiv.o:
	$(C++) $(C++FLAGS) $(IVFLAGS) -c renderiv.C $(INC)

.C.o:
	$(C++) $(FLAGS) -c $< $(INC)


######## All executables

ifdef RENDER_GL
  PLANGL = plangl
  GLOBJ = renderglobj.o rendergl.o
endif

ifdef RENDER_PF
  PLANPF = planpf
  PFOBJ = renderglobj.o renderpf.o
endif

ifdef RENDER_IV
  PLANIV = planiv
  IVOBJ = renderglobj.o renderiv.o
endif


all: $(PLANGL) $(PLANPF) $(PLANIV) msl.a

######## Base objects

BASEOBJ = model.o modelmisc.o model2d.o model3d.o model3ddyn.o modelcar.o geom.o geomPQP.o problem.o solver.o rcrrtnodeinfo.o tree.o polygon.o graph.o MTRand.o random.o point3d.o point.o triangle.o vector.o matrix.o util.o

######## PLANNER Code

PLANOBJ = $(BASEOBJ) planner.o fdp.o rrt.o rcrrt.o prm.o setup.o
GUIOBJ = $(PLANOBJ) scene.o gui.o guiplanner.o render.o 

plangl: $(GUIOBJ) $(GLOBJ)
	$(C++) $(FLAGS) plangl.C $(GUIOBJ) $(GLOBJ) -o ../plangl $(INC) $(LIB) $(GLINC) $(GLLIB)

planpf: $(GUIOBJ) $(PFOBJ)
	$(C++) $(FLAGS) planpf.C $(GUIOBJ) $(PFOBJ) -o ../planpf $(INC) $(LIB) $(PFINC) $(PFLIB)

planiv: $(GUIOBJ) $(IVOBJ)
	$(C++) $(FLAGS) planiv.C $(GUIOBJ) $(IVOBJ) -o ../planiv $(INC) $(LIB) $(IVINC) $(IVLIB)

msl.a: $(GLOBJ) $(PFOBJ) $(IVOBJ)
	em++ $(GLOBJ) $(PFOBJ) $(IVOBJ) -o ../lib/msl.so

test: tree.o vector.o 
	$(C++) $(FLAGS) test.C tree.o vector.o -o test $(INC) $(LIB) $(IVINC) $(IVLIB)

######## other commands

clean:
	rm -f *.o planpf plangl planiv

depend:
	-touch Makefile.depend
	makedepend $(DEPFLAGS) $(DEPINC) -fMakefile.depend $(DEPSRC)
	rm Makefile.depend.bak

count:
	@wc *.[Ch]

backup:
	@echo "Creating tar archive..."
	@echo "-----------------------"
	tar -cvf backup_src.tar *.[Ch] Makefile* README 
	gzip backup_src.tar 
	@echo "DONE!"

# DO NOT DELETE

