//servidor de express
const express = require('express');
const http = require('http');
const path = require('path');
const Routes = require('../routes')


class Server {
    constructor() {
        this.app = express();
        this.port = 8080;

        //http server
        this.server = http.createServer(this.app)

        this.app.use(function(req, res, next) {
            res.header("Access-Control-Allow-Origin", '*'); 
            res.setHeader("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, PATCH");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, token");
            next();
        });

        this.app.use(express.urlencoded({extended: true}));
        this.app.use(express.json())
          
    }

    middlewares () {
        //desplegar directorio publico
        /* this.app.use( express.static( path.resolve( __dirname, '../public' ) )) */
    }

    routesConfig () {
        new Routes(this.app);
    }

    execute () {

        //init middlewares
        this.middlewares();

        //init sockets
        this.routesConfig();

        //init server
        this.server.listen(this.port, () => {
            console.log('server corriendo en ', this.port);
        });

    }

}

module.exports = Server;