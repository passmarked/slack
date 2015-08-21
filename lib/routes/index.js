
import express   from 'express';
import install   from './install';

const routes = express.Router();

routes
  .get('/install', install);

export default routes;
