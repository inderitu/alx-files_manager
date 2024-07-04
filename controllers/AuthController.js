import dbClient from '../utils/db';
import sha1 from 'sha1';
import { v4 as uuidv4 } from 'uuid';
import redisClient from '../utils/redis';

class Authcontroller {
    static async getConnect(req, res) {
        const loginData = req.header('Authorization');
        let userData = loginData.split()[1];
        const buffer = Buffer.from(userData, 'base64');
        userData = buffer.toString('ascii');

        const data = userData.split(':');
        if (data.length !== 2) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        const email = data[0];
        const password = data[1];
        const users = dbClient.db.collection('users');
        try {
            await users.findOne({ email, password: sha1(password) }, (err, user) => {
                if (err) throw err;
                if (user) {
                    const token = uuidv4();
                    const key = `auth_${token}`;
                    (async () => {
                        await redisClient.set(key, user._id.toString(), 60 * 60 * 24);
                    })()
                    res.status(200).json({ token });
                } else {
                    res.status(401).json({ error: 'Unauthorized' });
                }
            })

        } catch (e) {
            console.log(e);
        }
    }

    static async getDisconnect(req, res) {
        const token = req.header('X-Token');
        const key = `auth_${token}`;

        try {
            const id = await redisClient.get(key);
            if (id) {
                await redisClient.del(key);
                res.status(204).json({});
            } else {
                res.status(401).json({ error: 'Unauthorized' });
            }
        } catch (e) {
            console.log(e);
        }
    }
}

module.exports = Authcontroller;
