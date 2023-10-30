var express = require('express');
var router = express.Router();
const { getAvailableMenus } = require('../service/kitchen')


router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.get('/getAvailableMenus', async function (req, res, next) {
  const data = await getAvailableMenus()
  res.send(JSON.stringify(data));
});


module.exports = router;
