declare -a difficulty=("hard" "medium" "easy")
for diff in ${difficulty[@]};
do
    title="This is a $diff question"
    desc="This is the content of a $diff question"
    docker exec -ti cs3219-project-ay2223s1-g25_frontend_1 curl --location --request POST 'question-service:6001/createQuestion' --header 'Content-Type: application/x-www-form-urlencoded' --data-urlencode "difficulty=${diff}" --data-urlencode "title=${title}" --data-urlencode "content=${desc}"
    echo
done 

for diff in ${difficulty[@]};
do
    docker exec -ti cs3219-project-ay2223s1-g25_frontend_1 curl question-service:6001/getQuestionByDiff?difficulty=$diff
    echo
done
