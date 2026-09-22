process.env.IS_SERVERLESS = 'true';
import app from '../server';

export default function handler(req: any, res: any) {
  return app(req, res);
}


