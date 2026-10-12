@echo off
if not exist bin\com\fuzzysearch\Main.class (
    echo bin directory not found or uncompiled. Compiling now...
    call compile.bat
)

java -cp bin com.fuzzysearch.Main %*
