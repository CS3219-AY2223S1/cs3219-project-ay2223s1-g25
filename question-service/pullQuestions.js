#!/usr/bin/env node

// pull original data
import fetch from 'node-fetch';
import 'dotenv/config';

const LIMIT = 50;

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

var CATEGORIES = ["algorithms", "database", "shell", "concurrency"];

export async function getAllQuestionData() {
  var baseQuestionList = [];
  for (var x in CATEGORIES) {
    baseQuestionList.push(await pullAllQuestions(CATEGORIES[x],LIMIT,0,{ "premiumOnly": false }));
  }  
  var titleSlugList = baseQuestionList.flat(1).map(x => x.titleSlug);
  var questionList = [];
  for (var x in titleSlugList) {
    questionList.push(await pullQuestion(titleSlugList[x]));
  }
  console.log(JSON.stringify(questionList))
}

getAllQuestionData();

// Run shell script
// chmod +x pullQuestions.sh
// ./pullQuestions.sh

// OR
// node pullQuestions.js > seed.json