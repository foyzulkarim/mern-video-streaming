const { Queue } = require("bullmq");

const queueName = "video";
const redisConnection = { host: "localhost", port: 6379 };
const myQueue = new Queue(queueName, { connection: redisConnection });

async function addJobs() {
  await myQueue.add("myJobName", { foo: "bar", date: new Date() });
  await myQueue.add("myJobName", { qux: "baz", date: new Date() });
}

const addQueueItem = async (item) => {
  await myQueue.add("video.uploaded", item, {
    removeOnComplete: true,
    removeOnFail: false,
  });
};

module.exports = { addQueueItem };
