const express = require('express');
const cors = require('cors');
const cassandra = require('cassandra-driver');

const app = express();
const authRouter = express.Router();

app.use(cors());
app.use(express.json());

const client = new cassandra.Client({
    contactPoints: ['localhost:9042'],
    localDataCenter: 'datacenter1',
    keyspace: 'auth',
});

const convertRowToObject = function (row) {
    return row ? row.toObject() : null;
}

authRouter.get('/test/:id', async (req, res) => {
    try {
        const result = await client.execute('SELECT * FROM users WHERE id = ?', [req.params.id], { prepare: true });
        const user = convertRowToObject(result.first());
        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to get user' });
    }
});

authRouter.post('/createUser', async (req, res) => {
    try {
        console.log(req.body);
        const { id, email, name, image } = req.body.profile;
        const result = await client.execute('INSERT INTO users (id, email, name, image) VALUES (?, ?, ?, ?)', [id, email, name, image]);
        const user = convertRowToObject(result.first());
        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to create user' });
    }
});

authRouter.get('/getUser/:id', async (req, res) => {
    try {
        const result = await client.execute(
            'SELECT * FROM users WHERE id = ?',
            [req.params.id],
            { prepare: true }
        );
        const user = convertRowToObject(result.first());
        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to get user' });
    }
});

authRouter.get('/getUserByEmail/:email', async (req, res) => {
    try {
        const result = await client.execute(
            'SELECT * FROM users WHERE email = ?',
            [req.params.email],
            { prepare: true }
        );
        const user = convertRowToObject(result.first());
        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to get user by email' });
    }
});

authRouter.get('/getUserByAccount/:providerId/:providerAccountId', async (req, res) => {
    try {
        const result = await client.execute(
            'SELECT * FROM accounts WHERE id = ? AND provider_account_id = ?',
            [req.params.providerId, req.params.providerAccountId],
            { prepare: true }
        );

        const account = convertRowToObject(result.first());

        if (account) {
            const userResult = await client.execute(
                'SELECT * FROM users WHERE id = ?',
                [account.user_id],
                { prepare: true }
            );
            const user = convertRowToObject(userResult.first());
            res.json(user);
        } else {
            res.json(null);
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to get user by account' });
    }
});

authRouter.post('/linkAccount', async (req, res) => {
    try {
        const { userId, providerId, providerType, providerAccountId, refreshToken, accessToken, accessTokenExpires } = req.body;
        const result = await client.execute(
            'INSERT INTO accounts (user_id, id, provider_type, provider_account_id, refresh_token, access_token, access_token_expires) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [userId, providerId, providerType, providerAccountId, refreshToken, accessToken, accessTokenExpires],
            { prepare: true }
        );
        const account = convertRowToObject(result.first());
        res.json(account);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to link account' });
    }
});

authRouter.post('/createSession', async (req, res) => {
    try {
        const { id, sessionToken, userId, expires, data } = req.body.session;
        const result = await client.execute(
            'INSERT INTO sessions (id, session_token, user_id, expires) VALUES (?, ?, ?, ?)',
            [id, sessionToken, userId, expires],
            { prepare: true }
        );
        const session = convertRowToObject(result.first());
        res.json(session);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to create session' });
    }
});

authRouter.get('/getSession', async (req, res) => {
    try {
        const { sessionToken } = req.query;
        const result = await client.execute(
            'SELECT * FROM sessions WHERE session_token = ? ALLOW FILTERING',
            [sessionToken],
            { prepare: true }
        );
        const session = convertRowToObject(result.first());

        if (session) {
            const userResult = await client.execute(
                'SELECT * FROM users WHERE id = ?',
                [session.user_id],
                { prepare: true }
            );
            const user = convertRowToObject(userResult.first());
            return res.json({ session, user });
        }

        res.json(null);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to get session' });
    }
});

authRouter.post('/updateSession', async (req, res) => {
    try {
        const { session, force } = req.body;
        const result = await client.execute(
            'UPDATE sessions SET expires = ? WHERE session_token = ?',
            [session.expires, session.sessionToken],
            { prepare: true }
        );
        const session_updated = convertRowToObject(result.first());
        res.json(session_updated);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to update session' });
    }
});

authRouter.delete('/deleteSession/:sessionToken', async (req, res) => {
    try {
        const result = await client.execute(
            'DELETE FROM sessions WHERE session_token = ?',
            [req.params.sessionToken],
            { prepare: true }
        );
        const session = convertRowToObject(result.first());
        res.json(session);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to delete session' });
    }
});

authRouter.post('/updateUser', async (req, res) => {
    try {
        const { email, name, image, id } = req.body.user;
        const result = await client.execute(
            'UPDATE users SET email = ?, name = ?, image = ? WHERE id = ?',
            [email, name, image, id],
            { prepare: true }
        );
        const user = convertRowToObject(result.first());
        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to update user' });
    }
});

authRouter.post('/createVerificationToken', async (req, res) => {
    try {
        const { identifier, url, verification_token, secret, provider } = req.body;
        const result = await client.execute(
            'INSERT INTO verification_tokens (identifier, url, verification_token, secret, provider) VALUES (?, ?, ?, ?, ?)',
            [identifier, url, verification_token, secret, provider],
            { prepare: true }
        );
        const verification = convertRowToObject(result.first());
        res.json(verification);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to create verification token' });
    }
});

authRouter.delete('/useVerificationToken/:identifier/:verification_token/:secret', async (req, res) => {
    try {
        const query = 'DELETE FROM verification_tokens WHERE identifier = ? AND verification_token = ? AND secret = ?';
        const result = await client.execute(
            'DELETE FROM verification_tokens WHERE identifier = ? AND verification_token = ? AND secret = ?',
            [req.params.identifier, req.params.verification_token, req.params.secret],
            { prepare: true }
        );
        const verification = convertRowToObject(result.first());
        res.json(verification);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to use verification token' });
    }
});

app.use('/api/auth', authRouter);

app.listen(3000, () => {
    console.log(`Server is running on http://localhost:3000`);
});

// app.get('/api/auth', async (req, res) => {
//     const result = await client.execute(req.params.sql, req.params.values, { prepare: true });
//     res.json(result.rows);
// });



// app.get('/api/user', async (req, res) => {
//     try {
//         const result = await client.execute('SELECT * FROM users', [], { prepare: true });
//         const users = result.rows;
//         res.json(users);
//         console.log(`Users: ${JSON.stringify(result.rows)}`);
//     } catch (error) {
//         console.error('Error fetching users:', error);
//         res.status(500).json({ error: 'An error occurred while fetching users' });
//     }
// });


