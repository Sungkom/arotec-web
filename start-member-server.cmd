@echo off
setlocal

cd /d "%~dp0"
set "PYTHON_EXE=C:\Users\user\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe"
set "MEMBER_URL=http://127.0.0.1:8000/pages/members.html"

if not exist "%PYTHON_EXE%" (
  echo Python runtime was not found:
  echo %PYTHON_EXE%
  echo.
  echo Please open this project in Codex again, or install Python and run server.py.
  pause
  exit /b 1
)

echo Starting Arotec member database server...
echo.
echo Keep the server window open while using the member form.
echo URL: %MEMBER_URL%
echo.

start "Arotec Member Server" /D "%~dp0" "%PYTHON_EXE%" "%~dp0server.py"
timeout /t 2 /nobreak >nul
start "" "%MEMBER_URL%"

echo If the browser did not open, copy this URL:
echo %MEMBER_URL%
echo.
pause
