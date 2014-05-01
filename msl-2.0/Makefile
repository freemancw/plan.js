################################################################
#
# The main Makefile for the Motion Strategy Library
#
################################################################

all:
	@echo "********** Making the MSL library and executables"
	cd src ; make all
	cd src ; 

	@echo "********** Making some simple example programs"
	cd tests ; make

	@echo "********** Making utilities"
	cd util ; make

	@echo "********** Finished"

clean:
	rm -f planpf plangl planiv
	cd src ; make clean
	cd lib ; rm -f libMSL.a
	cd tests ; make clean
	cd util ; make clean
