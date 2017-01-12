@echo off
git add .
git status
set /p message=Enter name/message of commit: 
git commit -m "%message%"
git push
cmd /k git status