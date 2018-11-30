const home = async (request, response) => {
  response.render('home.html');
};

const chat = async (request, response) => {
  response.render('chat.html');
};

module.exports = { home, chat }