import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import httpStatus from 'http-status';
import { errorConverter, errorHandler } from './middlewares/error';
import ApiError from './utils/ApiError';
import routes from './routes';
import { createServer } from 'http';

const app = express();

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

// cors を有効
app.use(cors());
app.options('*', cors());

app.use(express.static('public'));

const httpSever = createServer(app);

app.use('/api', routes);

app.use('/', (req, res) => {
  res.send('Server is working');
});

import { adminController } from './controllers/admin.controller';
adminController.createAdmin();

// import { adminService } from './services/admin.service';
// adminService.deleteAdmin()

// 不明なAPIリクエストに対して404エラーを返す
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});

// 必要に応じてエラーを ApiError に変換する
app.use(errorConverter);

// エラーを処理
app.use(errorHandler);

export default httpSever;