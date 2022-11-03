import Question from '../model/question-model.js';
import { createClient } from 'redis';

let redisClient;
(async () => { 
    redisClient = createClient({
        socket: {
            host: process.env.REDIS_REMOTE_HOST,
            port: process.env.REDIS_REMOTE_PORT,
        },
        password: process.env.REDIS_REMOTE_PASSWORD
    });
    
    await redisClient.connect(); 
})

// Dev dependencies
import chai from "chai";
import chaiHttp from "chai-http";
import app from "../index.js";

// Configure chai
chai.use(chaiHttp);
chai.should();

describe("Question", () => {
    beforeEach((done) => { // Before each test we empty the database
        Question.deleteMany({}, (err) => { 
            done();           
        });        
    });

    /*
    * Test the /POST route
    */
    describe("POST /createQuestion", () => {
        // Test to create a question
        it("should create a question", (done) => {
            chai.request(app)
                .post('/createQuestion')
                .set('content-type', 'application/x-www-form-urlencoded')
                .send({
                    questionId: "1",
                    title: "This is a very difficult question",
                    content: "This is a very difficulty question's content...",
                    difficulty: "Hard",
                    categoryTitle: "Shell"
                })
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.a('object');
                    res.body.body.should.have.property('questionId');
                    res.body.body.should.have.property('title');
                    res.body.body.should.have.property('content');
                    res.body.body.should.have.property('difficulty');
                    res.body.body.should.have.property('categoryTitle');
                done();
                });
        });

        // Test to create a question
        it("should not create a contact with missing title and/or content", (done) => {
            chai.request(app)
                .post('/api/contacts')
                .set('content-type', 'application/x-www-form-urlencoded')
                .send({
                    questionId: "1",
                    difficulty: "Hard",
                    categoryTitle: "Algorithms"
                })
                .end((err, res) => {
                    res.should.have.status(404);
                    res.body.should.be.a('object');
                done();
                });
        });
    });

    /* 
    * Test Redis retrieval of data
    */ 
    describe("REDIS Testing GET {room ID} returns question", () => {
        before(async () => {
            redisClient = createClient({
                socket: {
                    host: process.env.REDIS_REMOTE_HOST,
                    port: process.env.REDIS_REMOTE_PORT,
                },
                password: process.env.REDIS_REMOTE_PASSWORD
            });
            await redisClient.connect(); 
          });
        
          after(async () => {
            redisClient && (await redisClient.quit());
          });
        
          it("should set and retrieve values from Redis", async () => {
            let val = '{ \
                "questionId": "1", \
                "title": "testttt", \
                "content": "<p>Given an array of integers <code>nums</code>&nbsp;and an integer <code>target</code>, return <em>indices of the two numbers such that they add up to <code>target</code></em>.</p>\\n\\n<p>You may assume that each input would have <strong><em>exactly</em> one solution</strong>, and you may not use the <em>same</em> element twice.</p>\\n\\n<p>You can return the answer in any order.</p>\\n\\n<p>&nbsp;</p>\\n<p><strong class=\\\"example\\\">Example 1:</strong></p>\\n\\n<pre>\\n<strong>Input:</strong> nums = [2,7,11,15], target = 9\\n<strong>Output:</strong> [0,1]\\n<strong>Explanation:</strong> Because nums[0] + nums[1] == 9, we return [0, 1].\\n</pre>\\n\\n<p><strong class=\\\"example\\\">Example 2:</strong></p>\\n\\n<pre>\\n<strong>Input:</strong> nums = [3,2,4], target = 6\\n<strong>Output:</strong> [1,2]\\n</pre>\\n\\n<p><strong class=\\\"example\\\">Example 3:</strong></p>\\n\\n<pre>\\n<strong>Input:</strong> nums = [3,3], target = 6\\n<strong>Output:</strong> [0,1]\\n</pre>\\n\\n<p>&nbsp;</p>\\n<p><strong>Constraints:</strong></p>\\n\\n<ul>\\n\\t<li><code>2 &lt;= nums.length &lt;= 10<sup>4</sup></code></li>\\n\\t<li><code>-10<sup>9</sup> &lt;= nums[i] &lt;= 10<sup>9</sup></code></li>\\n\\t<li><code>-10<sup>9</sup> &lt;= target &lt;= 10<sup>9</sup></code></li>\\n\\t<li><strong>Only one valid answer exists.</strong></li>\\n</ul>\\n\\n<p>&nbsp;</p>\\n<strong>Follow-up:&nbsp;</strong>Can you come up with an algorithm that is less than&nbsp;<code>O(n<sup>2</sup>)&nbsp;</code>time complexity?", \
                "difficulty": "easy", \
                "categoryTitle": "Algorithms", \
                "_id": "6363b3264efbe0ea8042081b" \
            }'
            await redisClient.set("room_id", val);
            chai.expect(await redisClient.get("room_id")).to.equal(val);
          });
    })

    /*
    * Test the /GET route
    */
    describe("GET /getQuestionByRoom", () => {
        // Test to get all contacts
        it ("should get a question by room ID", (done) => {
            chai.request(app)
                .get('/getQuestionByRoom?roomId=room_id')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                done();
                });
        });
    });
});