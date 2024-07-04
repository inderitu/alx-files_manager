import dbClient from '../utils/db';
import sha1 from 'sha1';

class UsersController {
    static async postNew(req, res) {
        const { email } = req.body;
        const { password } = req.body;

        if (!email) {
            res.status(400).json({ error: 'Missing email' });
            return;
        }
        if (!password) {
            res.status(400).json({ error: 'Missing password' });
            return;
        }
        const users = dbClient.db.collection('users');
        await users.findOne({ email }, (err, user) => {
            if (err) throw err;
            if (user) {
                res.status(400).json({ error: 'Already exists' });
            } else {
                try {
                    (async () => {
                        const hashedPassword = sha1(password);
                        await users.insertOne({
                            email: email,
                            password: hashedPassword
                        }).then((response) => {
                            res.status(201).json({ id: response.insertedId, email });
                        })
                    })()
                } catch (err) {
                    console.log(err);
                }
            }
        }).catch((err) => {
            console.log(err)
        })
    }
}

module.exports = UsersController;
