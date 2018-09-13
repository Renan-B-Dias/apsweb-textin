const index = async (request, response) => {
  response.render('chat.html');
};

module.exports = { index }