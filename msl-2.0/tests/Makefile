### Makefile for GL-based RRT Planner

.SUFFIXES: .C .o

# General configurable part of the library
include ../Makefile.config

######### MSL Configuration
MSLINC = -I../include
MSLLIB = -L../lib -lMSL
MSLFLAGS = 

######## INC configuration

#INC = $(XINC) $(MSLINC) $(PQPINC) $(FOXINC) $(OTHERINC)
INC = $(CPPFLAGS) $(XINC) $(MSLINC) $(OTHERINC)

######## LIB configuration

#LIB = $(XLIB) $(MSLLIB) $(PQPLIB) $(FOXLIB) $(OTHERLIB)
LIB = $(LDFLAGS) $(MSLLIB) $(FOXLIB) $(XLIB) $(PQPLIB) $(OTHERLIB)

######## Flags

FLAGS = $(C++FLAGS) $(FOXFLAGS)


####### How to make things

.C.o:
	$(C++) $(FLAGS) -c $< $(INC)

all: helical nogui slide

helical: helical.C modelnew.o
	$(C++) $(FLAGS) helical.C modelnew.o -o helical $(INC) $(LIB) $(GLINC) $(GLLIB)

nogui: nogui.C 
	$(C++) $(C++FLAGS) nogui.C -o nogui $(MSLINC) $(LIB) $(INC) $(PQPLIB)

slide: slide.C rrtslide.o
	$(C++) $(FLAGS) slide.C rrtslide.o -o slide $(INC) $(LIB) $(GLINC) $(GLLIB)

clean:
	rm -f *.o helical slide nogui
