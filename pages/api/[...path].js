const app = require('../../server');

export const config = {
  api: {
    bodyParser: true,
    externalResolver: true,
  },
};

export default function handler(req, res) {
  return new Promise((resolve) => {
    if (typeof req.body === 'string' && req.body.trim()) {
      try { req.body = JSON.parse(req.body); } catch (e) {}
    }
    try {
      app(req, res, (err) => {
        if (err) {
          console.error('Express error in pages/api/[...path].js:', err);
          if (!res.headersSent) {
            res.status(500).json({ error: err.message, stack: err.stack });
          }
          return resolve();
        }
        resolve();
      });
    } catch (uncaughtErr) {
      console.error('Uncaught handler error:', uncaughtErr);
      if (!res.headersSent) {
        res.status(500).json({ error: uncaughtErr.message, stack: uncaughtErr.stack });
      }
      resolve();
    }
  });
}
