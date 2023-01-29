const { Worker, QueueEvents } = require("bullmq");
const { QUEUES } = require("./common");

const redisConnection = { host: "localhost", port: 6379 };

Object.values(QUEUES).map((queueName) => {
  const queueEvents = new QueueEvents(queueName, {
    connection: redisConnection,
  });

  queueEvents.on("waiting", ({ jobId }) => {
    console.log(`A job with ID ${jobId} is waiting`);
  });

  queueEvents.on("active", ({ jobId, prev, ...others }) => {
    console.log(
      `Job ${jobId} is now active; previous status was ${prev}`,
      others
    );
  });

  queueEvents.on("completed", ({ jobId, returnvalue }) => {
    console.log(`${jobId} has completed and returned ${returnvalue}`);
  });

  queueEvents.on("failed", ({ jobId, failedReason }) => {
    console.log(`${jobId} has failed with reason ${failedReason}`);
  });

  const worker = new Worker(
    queueName,
    async (job) => {
      console.log("i am the worker!", job.data);
    },
    { connection: redisConnection }
  );

  worker.on("completed", (job) => {
    console.log(`${job.id} has completed!`);
  });

  worker.on("failed", (job, err) => {
    console.log(`${job.id} has failed with ${err.message}`);
  });

  console.log(queueName, " worker started", new Date().toTimeString());
});
