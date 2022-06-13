const express = require('express');
const app = express();
const connectToMongo = require('./db');
require('dotenv').config();
const cors = require('cors');
connectToMongo();

app.use(express.json());
app.use(cors());
app.use('/api/v1/auth', require('./routes/auth'));
app.use('/api/v1/notes', require('./routes/notes'));

app.listen(process.env.PORT, () => {
    console.log(`Example app listening on port ${process.env.PORT}!`);
}
);