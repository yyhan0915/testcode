const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

let db = [];

function findCandidate(skillsSets, db) {
  let candidateArray = [...db];
  let checkNoMatched = 0;
  let previousResult = [];

  for (let index = 0; index < skillsSets.length; index++) {
    const element = skillsSets[index];

    intermediateResult = candidateArray.filter((candidate) =>
      candidate.skills.includes(element)
    );
    console.log("previousResult : ", previousResult);
    if (intermediateResult.length == 0) {
      // case for one skills is not matched
      checkNoMatched++;
    } else {
      candidateArray = intermediateResult;
    }
  }
  if (checkNoMatched == skillsSets.length) {
    // case of nothing matched
    return [];
  }
  return candidateArray;
}

app.get("/", (req, res) => {
  res.status(200).send("hello world");
});

app.post("/candidates", function (req, res) {
  if (Object.keys(req.body).length === 0) {
    return res.status(400).send("body is empty");
  }
  db.push(req.body);
  res.status(200).end(`candiate saved successfully`);
});

app.get("/candidates/search", function (req, res) {
  const { skills } = req.query;
  if (!skills) {
    return res.status(400).send("no skillSets defined");
  }
  const skillsSets = [...skills.split(",")];
  console.log(skillsSets);
  const result = findCandidate(skillsSets, db);
  // find candidate
  if (result.length == 0) {
    res.status(404).send("no matched candidate found");
  }
  res.setHeader("content-type", "application/json");
  res.status(200).send(result);
});

const port = 4000;
app.listen(port, () => console.log(`server is running at ${port}!`));
