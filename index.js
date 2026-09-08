import jsonfile from "jsonfile";
import moment from "moment";
import simpleGit from "simple-git";

const path = "./data.json";
const git = simpleGit();

const DAYS = 365;
const PER_DAY = 5;
const HOURS = [9, 10, 13, 15, 17];

const makeCommit = async (date) => {
  const data = { date };
  jsonfile.writeFileSync(path, data);
  await git.add([path]);
  await git.commit(date, { "--date": date });
};

const fill = async () => {
  let count = 0;
  for (let d = 0; d < DAYS; d++) {
    const day = moment().subtract(DAYS, "d").add(d, "d");
    for (const h of HOURS) {
      const date = day.clone().hour(h).minute(0).second(0).format();
      await makeCommit(date);
      count++;
    }
    if (d % 25 === 0) console.log(`day ${d}/${DAYS} (${count} commits so far)`);
  }
  console.log(`done: ${count} commits`);
};

fill().catch((e) => {
  console.error(e);
  process.exit(1);
});