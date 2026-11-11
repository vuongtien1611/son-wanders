@echo off
chcp 65001 >nul
title May chu Web Son WANDERS
echo ================================================================
echo   Dang khoi dong may chu Web Son WANDERS...
echo   Trang chu:               http://localhost:3000
echo   Trang Bang mau:          http://localhost:3000/bang-mau/
echo   Trang Cam hung mau sac:  http://localhost:3000/cam-hung-mau-sac/
echo   Trang San pham:          http://localhost:3000/san-pham/
echo ================================================================
start http://localhost:3000/bang-mau/
node server.js
pause
