const multer = require('multer');
const multerS3 = require('multer-s3');
const { S3Client } = require('@aws-sdk/client-s3');

const {
  insert,
  search,
  update,
  updateViewCount,
  deleteById,
  count,
} = require('./service');
const { validate } = require('./request');

const { VIDEO_STATUS } = require('../../db/constant');

const logger = require('../../../logger');

const BASE_URL = `/api/videos`;

const setupRoutes = (app) => {
  logger.info(`Setting up routes for ${BASE_URL}`);

  // return empty response with success message for the base route
  app.get(`${BASE_URL}/`, async (req, res) => {
    logger.info(`GET`, req.params);
    const data = await search({});
    res.send({
      status: 'success',
      message: 'OK',
      timestamp: new Date(),
      data,
    });
  });

  app.get(`${BASE_URL}/detail/:id`, async (req, res) => {
    logger.info(`GET`, req.params);
    const video = await updateViewCount(req.params.id);
    if (video instanceof Error) {
      return res.status(400).json({ error: video.toString() });
    }
    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }

    return res.status(200).json(video);
  });

  // TODO: Proper searching with paging and ordering
  app.post(`${BASE_URL}/search`, async (req, res) => {
    logger.info('POST search', req.body);
    const result = await search(req.body);
    res.send(result);
  });

  app.post(`${BASE_URL}/count`, async (req, res) => {
    logger.info('POST count', req.body);
    const result = await count(req.body);
    res.send({ count: result });
  });

  app.put(`${BASE_URL}/update/:id`, async (req, res) => {
    const validationResult = validate(req.body);
    if (req.params.id && !validationResult.error) {
      const result = await update({
        _id: req.params.id,
        ...validationResult.value,
      });
      if (result instanceof Error) {
        return res.status(400).json(JSON.parse(result.message));
      }
      return res.json(result);
    }
    return res
      .status(400)
      .json({ status: 'error', message: validationResult.error });
  });

  app.delete(`${BASE_URL}/delete/:id`, async (req, res) => {
    logger.info('DELETE', req.params.id);
    if (req.params.id) {
      const result = await deleteById(req.params.id);
      if (result instanceof Error) {
        res.status(400).json(JSON.parse(result.message));
        return;
      }
      return res.json(result);
    }
    return res.status(400).json({ status: 'error', message: 'Id required' });
  });

  // upload videos handler using multer package routes below.

  const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'video/mp4' || file.mimetype === 'video/webm') {
      logger.info('file type supported', file);
      cb(null, true);
    } else {
      logger.info('file type not supported', file);
      cb(new multer.MulterError('File type not supported'), false);
    }
  };

  const s3Client = new S3Client({
    endpoint: process.env.ENDPOINT, // Find your endpoint in the control panel, under Settings. Prepend "https://".
    forcePathStyle: false, // Configures to use subdomain/virtual calling format.
    region: process.env.REGION, // Must be "us-east-1" when creating new Spaces. Otherwise, use the region in your endpoint (e.g. nyc3).
    credentials: {
      accessKeyId: process.env.ACCESS_KEY, // Access key pair. You can create access key pairs using the control panel or API.
      secretAccessKey: process.env.ACCESS_TOKEN, // Secret access key defined through an environment variable.
    },
  });

  const s3Storage = multerS3({
    s3: s3Client, // s3 instance
    bucket: process.env.BUCKET_NAME, // change it as per your project requirement
    acl: 'private', // storage access type
    // metadata: (req, file, cb) => {
    //   cb(null, { fieldname: file.fieldname });
    // },
    // key: (req, file, cb) => {
    //   const fileName =
    //     Date.now() + '_' + file.fieldname + '_' + file.originalname;
    //   cb(null, fileName);
    // },
  });

  const upload = multer({
    // dest: 'uploads/videos',
    fileFilter: fileFilter,
    limits: { fileSize: 50000000 },
    storage: s3Storage,
  }).single('video');

  const uploadProcessor = (req, res, next) => {
    upload(req, res, (err) => {
      if (err) {
        //console.error(err);
        res.status(400).json({ status: 'error', error: err });
        return;
      } else {
        logger.info('upload success', req.file);
        // res.status(200).json({ status: "success", message: "upload success" });
        next();
      }
    });
  };

  app.post(`${BASE_URL}/upload`, uploadProcessor, async (req, res) => {
    try {
      // const { videoDuration } = await getVideoDurationAndResolution(
      //   `./${req.file.path}`
      // );
      // console.log('videoDuration', videoDuration);

      const dbPayload = {
        ...req.body,
        fileName: req.file.originalname,
        originalName: req.file.originalname,
        recordingDate: new Date(),
        videoLink: req.file.location,
        viewCount: 0,
        duration: 0,
        status: VIDEO_STATUS.PUBLISHED,
      };
      logger.info('dbPayload', { dbPayload });
      // TODO: save the file info and get the id from the database
      const result = await insert(dbPayload);
      logger.info('result', result);
      // await addQueueItem(QUEUE_EVENTS.VIDEO_UPLOADED, {
      //   id: result.insertedId.toString(),
      //   ...req.body,
      //   ...req.file,
      // });
      res.status(200).json({
        status: 'success',
        message: 'Upload success',
        ...req.file,
        ...result,
      });
      return;
    } catch (error) {
      logger.error(error);
      res.send(error);
    }
  });
};

const setup = (app) => {
  setupRoutes(app);
};

module.exports = { setup };
