import express from 'express';
import userService from '../services/users.service';
import debug from 'debug';
import  session  from 'express-session';

const log: debug.IDebugger = debug('app:users-controller');
const app = express();
app.use(session({ secret: 'test_secret', saveUninitialized: true, resave: true }));
class UsersMiddleware {

    async validateRequiredUserBodyFields(req: express.Request, res: express.Response, next: express.NextFunction) {
        if (req.body && req.body.email && req.body.password) {
            next();
        } else {
            res.status(400).send({error: `Missing required fields email and password`});
        }
    }

    async validateSameEmailDoesntExist(req: express.Request, res: express.Response, next: express.NextFunction) {
        const user = await userService.getUserByEmail(req.body.email);
        if (user) {
            res.status(400).send({error: `User email already exists`});
        } else {
            next();
        }
    }

    async setSession(req: express.Request, res: express.Response, next: express.NextFunction) {
        let userSession = req.session;
        if (userSession) {
            return res.redirect('/api/');
        }
        res.sendFile('index.html');
    }


    async extractUserId(req: express.Request, res: express.Response, next: express.NextFunction) {
        req.body.id = req.params.userId;
        next();
    }
}

export default new UsersMiddleware();