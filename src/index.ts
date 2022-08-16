import dotenv from 'dotenv';
import path from 'path';

if (process.env.NODE_ENV === 'dev') {
  dotenv.config({
    path: path.resolve(process.cwd(), '.env.dev'),
  });
}

const TOKEN = process.env.TOKEN ?? "";
