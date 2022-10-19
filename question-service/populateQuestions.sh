declare -a difficulty=("hard" "medium" "easy")
for diff in ${difficulty[@]};
do
    title="This is a $diff question"
    desc="This is the description of a $diff question"
    docker exec -ti cs3219-project-frontend-1 curl --location --request POST 'question-service:6001/createQuestion' --header 'Content-Type: application/x-www-form-urlencoded' --data-urlencode "difficulty=${diff}" --data-urlencode "title=${title}" --data-urlencode "description=${desc}"
    echo
done 

for diff in ${difficulty[@]};
do
    docker exec -ti cs3219-project-frontend-1 curl question-service:6001/getQuestionByDiff?difficulty=$diff
    echo
done
