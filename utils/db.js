import { MongoClient } from 'mongodb';

class DBClient {
    constructor() {
        this.host = process.env.DB_HOST || 'localhost';
        this.port = process.env.DB_PORT || 27017;
        this.database = process.env.DB_DATABASE || 'files_manager';

        this.url = `mongodb://${this.host}:${this.port}`;

        this.client = new MongoClient(this.url, { useUnifiedTopology: true, useNewUrlParser: true });
        this.client.connect()
            .then(() => {
                this.db = this.client.db(`${this.database}`);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    isAlive() {
        return this.client.isConnected();
    }

    async nbUsers() {
        const users = this.db.collection('users');
        const nb = await users.countDocuments();
        return nb
    }

    async nbFiles() {
        const files = this.db.collection('files');
        const nb = await files.countDocuments();
        return nb;
    }
}

const dbClient = new DBClient();
module.exports = dbClient;
