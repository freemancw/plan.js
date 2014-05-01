# Microsoft Developer Studio Project File - Name="win32" - Package Owner=<4>
# Microsoft Developer Studio Generated Build File, Format Version 6.00
# ** DO NOT EDIT **

# TARGTYPE "Win32 (x86) Console Application" 0x0103

CFG=win32 - Win32 Debug
!MESSAGE This is not a valid makefile. To build this project using NMAKE,
!MESSAGE use the Export Makefile command and run
!MESSAGE 
!MESSAGE NMAKE /f "win32.mak".
!MESSAGE 
!MESSAGE You can specify a configuration when running NMAKE
!MESSAGE by defining the macro CFG on the command line. For example:
!MESSAGE 
!MESSAGE NMAKE /f "win32.mak" CFG="win32 - Win32 Debug"
!MESSAGE 
!MESSAGE Possible choices for configuration are:
!MESSAGE 
!MESSAGE "win32 - Win32 Release" (based on "Win32 (x86) Console Application")
!MESSAGE "win32 - Win32 Debug" (based on "Win32 (x86) Console Application")
!MESSAGE 

# Begin Project
# PROP AllowPerConfigDependencies 0
# PROP Scc_ProjName ""
# PROP Scc_LocalPath ""
CPP=cl.exe
RSC=rc.exe

!IF  "$(CFG)" == "win32 - Win32 Release"

# PROP BASE Use_MFC 0
# PROP BASE Use_Debug_Libraries 0
# PROP BASE Output_Dir "Release"
# PROP BASE Intermediate_Dir "Release"
# PROP BASE Target_Dir ""
# PROP Use_MFC 0
# PROP Use_Debug_Libraries 0
# PROP Output_Dir "Release"
# PROP Intermediate_Dir "Release"
# PROP Target_Dir ""
# ADD BASE CPP /nologo /W3 /GX /O2 /D "WIN32" /D "NDEBUG" /D "_CONSOLE" /D "_MBCS" /YX /FD /c
# ADD CPP /nologo /W3 /GX /O2 /D "WIN32" /D "NDEBUG" /D "_CONSOLE" /D "_MBCS" /YX /FD /c
# ADD BASE RSC /l 0x409 /d "NDEBUG"
# ADD RSC /l 0x409 /d "NDEBUG"
BSC32=bscmake.exe
# ADD BASE BSC32 /nologo
# ADD BSC32 /nologo
LINK32=link.exe
# ADD BASE LINK32 kernel32.lib user32.lib gdi32.lib winspool.lib comdlg32.lib advapi32.lib shell32.lib ole32.lib oleaut32.lib uuid.lib odbc32.lib odbccp32.lib kernel32.lib user32.lib gdi32.lib winspool.lib comdlg32.lib advapi32.lib shell32.lib ole32.lib oleaut32.lib uuid.lib odbc32.lib odbccp32.lib /nologo /subsystem:console /machine:I386
# ADD LINK32 kernel32.lib user32.lib gdi32.lib winspool.lib comdlg32.lib advapi32.lib shell32.lib ole32.lib oleaut32.lib uuid.lib odbc32.lib odbccp32.lib kernel32.lib user32.lib gdi32.lib winspool.lib comdlg32.lib advapi32.lib shell32.lib ole32.lib oleaut32.lib uuid.lib odbc32.lib odbccp32.lib /nologo /subsystem:console /machine:I386

!ELSEIF  "$(CFG)" == "win32 - Win32 Debug"

# PROP BASE Use_MFC 0
# PROP BASE Use_Debug_Libraries 1
# PROP BASE Output_Dir "Debug"
# PROP BASE Intermediate_Dir "Debug"
# PROP BASE Target_Dir ""
# PROP Use_MFC 0
# PROP Use_Debug_Libraries 1
# PROP Output_Dir "..\"
# PROP Intermediate_Dir "Debug"
# PROP Ignore_Export_Lib 0
# PROP Target_Dir ""
# ADD BASE CPP /nologo /W3 /Gm /GX /ZI /Od /D "WIN32" /D "_DEBUG" /D "_CONSOLE" /D "_MBCS" /YX /FD /GZ /c
# ADD CPP /nologo /MTd /W3 /Gm /GX /ZI /Od /I "..\include\MSL" /D "WIN32" /D "_DEBUG" /D "_CONCOLE" /D "_MBCS" /YX /FD /GZ /c
# SUBTRACT CPP /Fr
# ADD BASE RSC /l 0x409 /d "_DEBUG"
# ADD RSC /l 0x409 /d "_DEBUG"
BSC32=bscmake.exe
# ADD BASE BSC32 /nologo
# ADD BSC32 /nologo
LINK32=link.exe
# ADD BASE LINK32 kernel32.lib user32.lib gdi32.lib winspool.lib comdlg32.lib advapi32.lib shell32.lib ole32.lib oleaut32.lib uuid.lib odbc32.lib odbccp32.lib kernel32.lib user32.lib gdi32.lib winspool.lib comdlg32.lib advapi32.lib shell32.lib ole32.lib oleaut32.lib uuid.lib odbc32.lib odbccp32.lib /nologo /subsystem:console /debug /machine:I386 /pdbtype:sept
# ADD LINK32 foxd.lib PQP.lib glut32.lib opengl32.lib glu32.lib comctl32.lib wsock32.lib kernel32.lib user32.lib gdi32.lib winspool.lib comdlg32.lib advapi32.lib shell32.lib ole32.lib oleaut32.lib uuid.lib odbc32.lib odbccp32.lib /nologo /entry:"mainCRTStartup" /subsystem:console /debug /machine:I386 /force /out:"..\plangl.exe" /pdbtype:sept
# SUBTRACT LINK32 /pdb:none

!ENDIF 

# Begin Target

# Name "win32 - Win32 Release"
# Name "win32 - Win32 Debug"
# Begin Group "Source Files"

# PROP Default_Filter "cpp;c;cxx;rc;def;r;odl;idl;hpj;bat"
# Begin Source File

SOURCE=..\src\fdp.cpp
# End Source File
# Begin Source File

SOURCE=..\src\geom.cpp
# End Source File
# Begin Source File

SOURCE=..\src\geomPQP.cpp
# End Source File
# Begin Source File

SOURCE=..\src\graph.cpp
# End Source File
# Begin Source File

SOURCE=..\src\gui.cpp
# End Source File
# Begin Source File

SOURCE=..\src\guiplanner.cpp
# End Source File
# Begin Source File

SOURCE=..\src\marray.cpp
# End Source File
# Begin Source File

SOURCE=..\src\matrix.cpp
# End Source File
# Begin Source File

SOURCE=..\src\model.cpp
# End Source File
# Begin Source File

SOURCE=..\src\model2d.cpp
# End Source File
# Begin Source File

SOURCE=..\src\model3d.cpp
# End Source File
# Begin Source File

SOURCE=..\src\modelmisc.cpp
# End Source File
# Begin Source File

SOURCE=..\src\plangl.cpp
# End Source File
# Begin Source File

SOURCE=..\src\planner.cpp
# End Source File
# Begin Source File

SOURCE=..\src\point.cpp
# End Source File
# Begin Source File

SOURCE=..\src\point3d.cpp
# End Source File
# Begin Source File

SOURCE=..\src\polygon.cpp
# End Source File
# Begin Source File

SOURCE=..\src\prm.cpp
# End Source File
# Begin Source File

SOURCE=..\src\problem.cpp
# End Source File
# Begin Source File

SOURCE=..\src\random.cpp
# End Source File
# Begin Source File

SOURCE=..\src\render.cpp
# End Source File
# Begin Source File

SOURCE=..\src\rendergl.cpp
# End Source File
# Begin Source File

SOURCE=..\src\renderglobj.cpp
# End Source File
# Begin Source File

SOURCE=..\src\rrt.cpp
# End Source File
# Begin Source File

SOURCE=..\src\scene.cpp
# End Source File
# Begin Source File

SOURCE=..\src\setup.cpp
# End Source File
# Begin Source File

SOURCE=..\src\solver.cpp
# End Source File
# Begin Source File

SOURCE=..\src\tree.cpp
# End Source File
# Begin Source File

SOURCE=..\src\triangle.cpp
# End Source File
# Begin Source File

SOURCE=..\src\util.cpp
# End Source File
# Begin Source File

SOURCE=..\src\vector.cpp
# End Source File
# End Group
# Begin Group "Header Files"

# PROP Default_Filter "h;hpp;hxx;hm;inl"
# Begin Source File

SOURCE=..\include\MSL\defs.h
# End Source File
# Begin Source File

SOURCE=..\include\MSL\fdp.h
# End Source File
# Begin Source File

SOURCE=..\include\MSL\geom.h
# End Source File
# Begin Source File

SOURCE=..\include\MSL\geomPQP.h
# End Source File
# Begin Source File

SOURCE=..\include\MSL\graph.h
# End Source File
# Begin Source File

SOURCE=..\include\MSL\gui.h
# End Source File
# Begin Source File

SOURCE=..\include\MSL\guiplanner.h
# End Source File
# Begin Source File

SOURCE=..\include\MSL\marray.h
# End Source File
# Begin Source File

SOURCE=..\include\MSL\matrix.h
# End Source File
# Begin Source File

SOURCE=..\include\MSL\model.h
# End Source File
# Begin Source File

SOURCE=..\include\MSL\model2d.h
# End Source File
# Begin Source File

SOURCE=..\include\MSL\model3d.h
# End Source File
# Begin Source File

SOURCE=..\include\MSL\modelmisc.h
# End Source File
# Begin Source File

SOURCE=..\include\MSL\MSL.h
# End Source File
# Begin Source File

SOURCE=..\include\MSL\mslio.h
# End Source File
# Begin Source File

SOURCE=..\include\MSL\planner.h
# End Source File
# Begin Source File

SOURCE=..\include\MSL\point.h
# End Source File
# Begin Source File

SOURCE=..\include\MSL\point3d.h
# End Source File
# Begin Source File

SOURCE=..\include\Msl\polygon.h
# End Source File
# Begin Source File

SOURCE=..\include\MSL\prm.h
# End Source File
# Begin Source File

SOURCE=..\include\MSL\problem.h
# End Source File
# Begin Source File

SOURCE=..\include\MSL\random.h
# End Source File
# Begin Source File

SOURCE=..\include\MSL\render.h
# End Source File
# Begin Source File

SOURCE=..\include\MSL\rendergl.h
# End Source File
# Begin Source File

SOURCE=..\include\MSL\renderglobj.h
# End Source File
# Begin Source File

SOURCE=..\include\MSL\rrt.h
# End Source File
# Begin Source File

SOURCE=..\include\MSL\scene.h
# End Source File
# Begin Source File

SOURCE=..\include\MSL\setup.h
# End Source File
# Begin Source File

SOURCE=..\include\MSL\solver.h
# End Source File
# Begin Source File

SOURCE=..\include\MSL\tree.h
# End Source File
# Begin Source File

SOURCE=..\include\MSL\triangle.h
# End Source File
# Begin Source File

SOURCE=..\include\MSL\util.h
# End Source File
# Begin Source File

SOURCE=..\include\MSL\vector.h
# End Source File
# End Group
# Begin Group "Resource Files"

# PROP Default_Filter "ico;cur;bmp;dlg;rc2;rct;bin;rgs;gif;jpg;jpeg;jpe"
# End Group
# End Target
# End Project
