@echo off
echo =========================================================
echo  Compiling Java DSA-3 Fuzzy Search Project...
echo =========================================================

if not exist bin mkdir bin

javac -d bin -encoding UTF-8 src\com\fuzzysearch\core\*.java src\com\fuzzysearch\tree\*.java src\com\fuzzysearch\search\*.java src\com\fuzzysearch\data\*.java src\com\fuzzysearch\benchmark\*.java src\com\fuzzysearch\server\*.java src\com\fuzzysearch\cli\*.java src\com\fuzzysearch\gui\*.java src\com\fuzzysearch\Main.java

if %ERRORLEVEL% EQU 0 (
    echo.
    echo [SUCCESS] Compilation finished with 0 errors!
    echo Class files placed in bin\ directory.
    echo.
    echo To run:
    echo   run.bat          (Launches Desktop GUI)
    echo   run.bat --cli    (Launches Terminal CLI)
    echo   run.bat --server (Launches REST API on port 8080)
    echo   run.bat --benchmark (Runs Big-O Benchmark suite)
) else (
    echo.
    echo [ERROR] Compilation failed!
)
