.SUFFIXES: .C .o

C++ = g++

C++FLAGS = 

INC = -I/usr/local/lib/ -lm

OBJ = 

.C.o:
	$(C++) $(C++FLAGS) -c $< $(INC) 

all: torus cylinder sphere rectangle cone pyramid3 pyramid4 spring_square

torus: torus.C
	$(C++) $(C++FLAGS) torus.C -o torus $(INC) $(LIBS)

cylinder: cylinder.C
	$(C++) $(C++FLAGS) cylinder.C -o cylinder $(INC) $(LIBS)

sphere: sphere.C
	$(C++) $(C++FLAGS) sphere.C -o sphere $(INC) $(LIBS)

rectangle: rectangle.C
	$(C++) $(C++FLAGS) rectangle.C -o rectangle $(INC) $(LIBS)

cone: cone.C
	$(C++) $(C++FLAGS) cone.C -o cone $(INC) $(LIBS)

pyramid3: pyramid3.C
	$(C++) $(C++FLAGS) pyramid3.C -o pyramid3 $(INC) $(LIBS)

pyramid4: pyramid4.C
	$(C++) $(C++FLAGS) pyramid4.C -o pyramid4 $(INC) $(LIBS)

spring_square: spring_square.C
	$(C++) $(C++FLAGS) spring_square.C -o spring_square $(INC) $(LIBS)

clean:
	rm -f torus cylinder sphere rectangle cone pyramid3 pyramid4 spring_square
