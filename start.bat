@echo off
setlocal
cd /d "%~dp0"

echo === CausalForge launcher ===
echo.

REM Backend
if not exist "apps\api\.venv\Scripts\python.exe" (
  echo Creating Python venv...
  python -m venv "apps\api\.venv"
)
call "apps\api\.venv\Scripts\activate.bat"
python -m pip install -q -r "apps\api\requirements.txt"
start "CausalForge API" cmd /k "cd /d %~dp0apps\api && .venv\Scripts\uvicorn app.main:app --reload --port 8000"

REM Frontend
cd apps\web
if not exist "node_modules" (
  echo Installing frontend dependencies...
  call npm install
)
start "CausalForge Web" cmd /k "cd /d %~dp0apps\web && npm run dev"

timeout /t 4 >nul
start "" "http://localhost:3000"
echo.
echo API: http://127.0.0.1:8000/docs
echo Web: http://localhost:3000
endlocal
