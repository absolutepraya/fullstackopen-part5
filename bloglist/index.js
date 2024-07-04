const app = require('./app')
const config = require('./utils/config')
const logger = require('./utils/logger')

const express = require('express')
const cors = require('cors')

app.use(cors())
app.use(express.json())

app.listen(config.PORT, () => {
    logger.info(`Server running on port ${config.PORT}, url: http://localhost:${config.PORT}`);
});