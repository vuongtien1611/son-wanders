@echo off
chcp 65001 >nul
title May chu Web Son MY HOUR
echo ================================================================
echo   Dang khoi dong may chu Web Son MY HOUR...
echo   Dia chi truy cap: http://localhost:3000
echo ================================================================
start http://localhost:3000
node server.js
pause
