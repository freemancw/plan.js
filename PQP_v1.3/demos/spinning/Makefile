# Must set these gl and glut locations to build 'spinning'

CC = em++

.SUFFIXES: .cpp

CC = em++
CFLAGS  = -g -O2 -I. -I../../include -s LEGACY_GL_EMULATION=1
LDFLAGS = -L. -L../../lib
LDLIBS  = -lPQP

OBJS   = main.o model.o
TARGET = spinning.html

.cpp.o:
	$(CC) ${CFLAGS} -c $<

$(TARGET): $(OBJS)
	$(CC) $(CFLAGS) $(OBJS) -o $(TARGET) $(LDFLAGS) $(LDLIBS) --preload-file bunny.tris --preload-file torus.tris

run: $(TARGET)
	$(TARGET)

clean: 
	rm -f *~ $(OBJS) $(TARGET) 







