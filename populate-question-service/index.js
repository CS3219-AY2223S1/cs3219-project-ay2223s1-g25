import axios from 'axios';
import fetch from 'node-fetch';
import 'dotenv/config';
import { existsSync, readFileSync } from 'fs';
const configPath = "./config.json";
let config;
if (existsSync(configPath)) {
    config = JSON.parse(readFileSync(configPath));
} else {
  console.log("No configuration found! Authentication will not work.");
}


const CATEGORIES = ["algorithms", "database", "shell", "concurrency"];
const LIMIT = 60;

const getAccessToken = async () => {
  
  const data = JSON.stringify({
    "client_id": config.clientId,
    "audience": config.audience,
    "client_secret": process.env.CLIENT_SECRET,
    "grant_type": "password",
    "username": process.env.USER_NAME,
    "password": process.env.PASSWORD
  });

  const request = {
    method: 'post',
    url: `https://${config.domain}/oauth/token`,
    headers: { 
      'Content-Type': 'application/json', 
    },
    data : data
  };
  
  const response = await axios(request);
  return response.data.access_token;
}

async function getAvailableQuestions(accessToken) {  
  const request = {
    method: 'GET',
    url: config.API_URL + "/api/question/getAllQuestions",
    headers: { 
      'Authorization': 'Bearer ' + accessToken, 
    },
  };
  const response = await axios(request);
  return response.data;
}

async function createQuestions(accessToken, questions) {
  for (const question of questions) {
    const request = {
      method: 'POST',
      url: config.API_URL + "/api/question/createQuestion",
      headers: { 
        'Authorization': 'Bearer ' + accessToken,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: {
        questionId: question.questionId,
        title: question.title,
        content: question.content,
        difficulty: question.difficulty,
        categoryTitle: question.categoryTitle
      }
    };
    await axios(request);
  }
}

async function pullAllQuestions(categorySlug, limit, skip, filters) {
    const data = JSON.stringify({
      query: `query problemsetQuestionList($categorySlug: String, $limit: Int, $skip: Int, $filters: QuestionListFilterInput) {
        questionList(
        categorySlug: $categorySlug
        limit: $limit
        skip: $skip
        filters: $filters
      ) {
        questions: data {
          difficulty
          title
          titleSlug
          topicTags {
            name
          }
        }
      }
    }`,
      variables: `{
        "categorySlug": "${categorySlug}",
        "limit": ${limit},
        "skip": ${skip},
        "filters": {}
      }`,
    });

    const response = await fetch(
      'https://leetcode.com/graphql',
      {
        method: 'post',
        body: data,
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': data.length,
          'User-Agent': 'Node',
        },
      }
    );

    const json = await response.json();
    return json.data.questionList.questions;
}

async function pullQuestion(titleSlug) {
  const data = JSON.stringify({
    query: `query questionData($titleSlug: String!) {
        question(titleSlug: $titleSlug) {
            questionId
            title
            titleSlug
            content
            difficulty
            categoryTitle
            topicTags {
                name
                slug
            }
            hints       
        }
    }`,
    variables: `{
        "titleSlug": "${titleSlug}"
      }`,
  });

  const response = await fetch(
    'https://leetcode.com/graphql',
    {
      method: 'post',
      body: data,
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length,
        'User-Agent': 'Node',
      },
    }
  );
  const json = await response.json();
  return json.data.question;
}


async function scrapeQuestion() {
  let baseQuestionList = [];
  for (let x in CATEGORIES) {
    baseQuestionList.push(await pullAllQuestions(CATEGORIES[x],LIMIT,0,{ "premiumOnly": false }));
  }  
  let titleSlugList = baseQuestionList.flat(1).map(x => x.titleSlug);
  let questionList = [];
  for (let x in titleSlugList) {
    questionList.push(await pullQuestion(titleSlugList[x]));
  }
  return questionList;
}

export async function handler(event) {
  try {
    const accessToken = await getAccessToken();
    let questionBank = await getAvailableQuestions(accessToken);
    let questionList = await scrapeQuestion();
    console.log("Received " + questionList.length + " unfiltered.");
    questionList = questionList.filter(x => x.content);
    console.log("Received " + questionList.length + " filtered.");
    questionBank = questionBank.body.map(x => x.questionId);
    let questionToCreate = questionList.filter(x => !questionBank.includes(x.questionId));
    console.log("Adding " + questionToCreate.length + "...");

    if (questionToCreate.length != 0) {
      await createQuestions(accessToken, questionToCreate);
      console.log("Added " + questionToCreate.length + " new questions!");
    } else {
      console.log("There is no question to create!");
    }
    
  } catch(error) {
    console.log(error.message);
  }
}
