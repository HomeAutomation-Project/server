echo "*********************** GIT PUSH *****************************\n"
git status
git add -A
echo "******************* Enter Commit Msg *************************\n"
read msg
git commit -m "$msg"
git push origin master