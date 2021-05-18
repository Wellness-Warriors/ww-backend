const superagent = require('superagent');

function getZen(req,res){
  const url = 'https://zenquotes.io/api/random/';
  const query = {
    key : process.env.REACT_APP_ZEN
  };

  superagent
    .get(url)
    .query(query)
    .then( dataObject => {

      res.status(200).send(dataObject.text);

    })
    .catch( (error)=> {
      res.status(500).send(error);
    });

}

module.exports = getZen;
