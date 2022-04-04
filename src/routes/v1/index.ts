import * as express from 'express';
import {NextFunction, Request, Response} from 'express';
import {APIResponse} from '../../presentation/apiResponse';
import DGFileRoutes from './dgFileRoutes';
import VerifierRoutes from './verifierRoutes';
import * as YAML from 'yaml';
import * as Swagger from 'swagger-ui-express';
import * as fs from 'fs';
import * as path from 'path';

const swaggerFile = fs.readFileSync(path.resolve(__dirname, '../../swagger.yaml'), 'utf8');
const swaggerDocument = YAML.parseDocument(swaggerFile);

const router = express.Router();
router.use('/docs', Swagger.serve, Swagger.setup(swaggerDocument));
router.use('/file', DGFileRoutes);
router.use('/verifier', VerifierRoutes);


router.get('/ping', (req: Request, res: Response, next: NextFunction) => {
    res.status(200);
    res.send(new APIResponse('pong'));
});

export default router;
