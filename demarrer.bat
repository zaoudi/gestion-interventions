@echo off
cd /d "%~dp0"
start "" http://localhost:3000/login.html
node back_end/server.js