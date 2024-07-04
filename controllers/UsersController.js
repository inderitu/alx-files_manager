import dbClient from '../utils/db';
import sha1 from 'sha1';

class UsersController {
    static async postNew(req, res) {
        const { email, password } = req.body;

        if (!email) {
            res.status(400).json({ error: 'Missing email' });
            return;
        }
        if (!password) {
            res.status(400).json({ error: 'Missing password' });
            return;
        }
        const users = dbClient.db.collection('users');
        await users.findOne({ email }, async (err, user) => {
            if (user) {
                res.status(400).json({ error: 'Already exists' });
            } else {
                try {
                    await users.insertOne({
                        email: email,
                        password: sha1(password)
                    }).then((response) => {
                        res.status(200).json({ id: response.insertedId, email });
                    })
                } catch (err) {
                    console.log(err);
                }
            }
        })
    }
}

module.exports = UsersController;
