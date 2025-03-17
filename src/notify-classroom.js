const core = require("@actions/core");
const fs = require('fs');

exports.NotifyClassroom = async function NotifyClassroom(runnerResults) {
  // combine max score and total score from each {runner, results} pair
  // if max_score is greater than 0 run the rest of this code
  const { totalPoints, maxPoints } = runnerResults.reduce(
    (acc, { results }) => {
      if (!results.max_score) return acc;

      acc.maxPoints += results.max_score;
      results.tests.forEach(({ score }) => {
        acc.totalPoints += score;
      });

      return acc;
    },
    { totalPoints: 0, maxPoints: 0 }
  );
  if (!maxPoints) return;

  const text = `Points ${totalPoints}/${maxPoints}`;
  const summary = JSON.stringify({ totalPoints, maxPoints })

  console.log("Logging score to comment.md");

  try {
    fs.writeFileSync('comment.md', `Your score is ${totalPoints.toFixed(2)}/${maxPoints}`);
    console.log("Markdown file created successfully!");
  } catch (err) {
    console.error("Error writing file:", err);
  }

  // create notice annotations with the final result and summary
  core.notice(text, {
    title: "Autograding complete",
  })

  core.notice(summary, {
    title: "Autograding report",
  })
};
