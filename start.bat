@echo off
echo Starting SunoGov...
echo.

echo [1/2] Starting backend on :8000
start "SunoGov Backend" cmd /k "cd /d %~dp0backend && pip install -q -r requirements.txt && python -m uvicorn main:app --reload --port 8000"

echo [2/2] Starting frontend on :3000
start "SunoGov Frontend" cmd /k "cd /d %~dp0frontend && npm start"

echo.
echo Both servers starting in separate windows.
echo   Backend:  http://localhost:8000
echo   Frontend: http://localhost:3000
echo.
echo Close those windows to stop the servers.
