const OAuth = require('oauth').OAuth;
const axios = require('axios');
const sgMail = require('@sendgrid/mail')
var url = require('url');
var fs = require("fs");

class Routes {

    constructor(express) {
        this.app = express;
        this.endPoints();
    }

    endPoints(){
        const requestURL = "https://trello.com/1/OAuthGetRequestToken";
        const accessURL = "https://trello.com/1/OAuthGetAccessToken";
        const authorizeURL = "https://trello.com/1/OAuthAuthorizeToken";
        const appName = "Opath1";
        const loginCallback = `http://localhost:3000`;
        const key = '186c0616a8f95125a8de07282602a84b';
        const secret = 'c2520c29c00468a86cd36e59faebb88c16c29b63df8ffa9ce9b5839a38477d57';
        const emailKey = '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'
        const scope = 'read,write';
        const expiration = '1hour';
        const oauth = new OAuth(requestURL, accessURL, key, secret, "1.0A", loginCallback, "HMAC-SHA1")
        const oauth_secrets = {};
        const token = 'e83b0354a7cc589f3e9ac6ef443641b69d1b7f31ff6e69f94ae97ed8b7c7e66c'
        const defaultList = '5ddae1970066ff51e1291e00'
        
        this.app.get("/login", (req, res) => {
            oauth.getOAuthRequestToken(function(error, token, tokenSecret, results){
                oauth_secrets[token] = tokenSecret;
                /* res.redirect(`${authorizeURL}?oauth_token=${token}&name=${appName}&scope=${scope}&expiration=${expiration}`); */
                return res.json({
                    ok: true,
                    resp: `${authorizeURL}?oauth_token=${token}&name=${appName}&scope=${scope}&expiration=${expiration}`
                });
            });
        });

        this.app.get("/workspaces", async(req, resp) => {
            const workspace = await axios.get(`https://api.trello.com/1/members/me/organizations?key=${key}&token=${token}`);
            return resp.json({
                ok: true,
                resp: workspace.data
            });
        });

        this.app.post("/board",  async(req, resp) => {
            const idWorkspace = req.body.workspace
            const boards = await axios.get(`https://api.trello.com/1/organizations/${idWorkspace}/boards?key=${key}&token=${token}`);
            return resp.json({
                ok: true,
                resp: boards.data
            });
        });

        this.app.post("/members",  async(req, resp) => {
            const idWorkspace = req.body.workspace
            const members = await axios.get(`https://api.trello.com/1/organizations/${idWorkspace}/members?key=${key}&token=${token}`);
            return resp.json({
                ok: true,
                resp: members.data
            });
        });

        this.app.post("/allcards",  async(req, resp) => {
            const board = req.body.idBoard
            console.log(board)
            const cards = await axios.get(`https://api.trello.com/1/boards/${board}/cards?key=${key}&token=${token}`);
            return resp.json({
                ok: true,
                resp: cards.data
            });
        });

        this.app.post("/card", async(req, resp) => {
            const name = req.body.name;
            const desc = req.body.desc;
            const due = req.body.due;
            const idMembers = req.body.idMembers;
            console.log(req.body)
            const cardCreate = await axios.post(`https://api.trello.com/1/cards?key=${key}&token=${token}&idList=${defaultList}&name=${name}&desc=${desc}&due=${due}&idMembers=${idMembers}`)
            return resp.json({
                ok: true,
                resp: cardCreate.data
            });
        });

        this.app.put("/card", async(req, resp) => {
            const cardId = req.body.cardId;
            const name = req.body.names;
            const desc = req.body.desc;
            const due = req.body.due;
            const dueComplete = req.body.dueComplete;
            const idMembers = req.body.idMembers;
            const cardUpdate = await axios.put(`https://api.trello.com/1/cards/${cardId}?key=${key}&token=${token}&name=${name}&desc=${desc}&due=${due}&idMembers=${idMembers}&dueComplete=${dueComplete}`)
            return resp.json({
                ok: true,
                resp: cardUpdate.data
            });
        });

        this.app.post("/delcard", (req, resp) => {
            const idCard = req.body.idCard;
            const name = req.body.name;
            const desc = req.body.desc;
            axios.delete(`https://api.trello.com/1/cards/${idCard}?key=${key}&token=${token}`).then((res) => {
                sgMail.setApiKey(emailKey)
                const msg = {
                    to: 'panduro.sergio@outlook.es', 
                    from: 'panduro.sergio1@gmail.com', 
                    subject: 'Card deleted!',
                    text: `Information about the deleted card: `,
                    html: `<ul>
                        <li>type: Card </li>
                        <li>Desc: ${desc} </li>
                        <li>Member who deleted: ${name} </li>
                    </ul>`
                }
                sgMail.send(msg).then(() => {
                    console.log('Email sent')
                }).catch((error) => {
                    console.error(error)
                    console.log('error enviar correo')
                })
                return resp.sendStatus(200); 
            }).catch(function (error) {
                if (error.response) {
                  // Request made and server responded
                  console.log(error.response.data);
                  console.log(error.response.status);
                  console.log(error.response.headers);

                } else if (error.request) {
                  // The request was made but no response was received
                  console.log(error.request);
                } else {
                  // Something happened in setting up the request that triggered an Error
                  console.log('Error', error.message);
                }
              })
        });

        var callback = (req, res) => {
            const query = url.parse(req.url, true).query;
            const token = query.oauth_token;
            const tokenSecret = oauth_secrets[token];
            const verifier = query.oauth_verifier;

            oauth.getOAuthAccessToken(token, tokenSecret, verifier, function(error, accessToken, accessTokenSecret, results){
                console.log(error)
                oauth.getProtectedResource("https://api.trello.com/1/members/me", "GET", accessToken, accessTokenSecret, function(error, data, response){
                    console.log(error)
                    console.log(data)
                    fs.writeFileSync("./userData.json", data, 'utf8');
                    fs.readFile("./userData.json", 'utf8',  function(err,data) {
                        if(err){
                            console.log('error')
                          return console.log(err)
                        }
                        if(data){
                            console.log('entra a data')
                            console.log(data)
                            return res.json({
                                ok: true,
                                resp: data,
                                exp: 3600
                            });
                        }
                    });
                });
            });
        };

        this.app.post("/callback",  (req, resp) => {
            callback(req, resp)
        });

    }

}

module.exports = Routes;
