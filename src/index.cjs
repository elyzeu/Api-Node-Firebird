const express = require("express");
const cors = require("cors");
const { executeQuery, firebird, dbOptions, executeQueryTrx } = require("./config/database.js");
const helmet = require('helmet');
const jwt = require('jsonwebtoken');
require('dotenv').config();



const app = express();


app.use(express.json());

app.use(cors());
app.use(helmet());
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
        },
    })
);



function authenticateToken(req, res, next) {
    const token = req.header('token');

    if (!token || token !== 'Bearer tokenacess') {
        return res.status(401).send('Access denied. Invalid token.');
    }

    next();
}





app.get("/produtos", authenticateToken, function (req, res) {
    let filtro = [];
    let ssql = 'select codpro, nompro, pvenda from produtos where id > 0 ';
    const itemsPerPage = 10;
    const page = req.query.page || 1;
    const offset = (page - 1) * itemsPerPage;
    const limit = itemsPerPage;

   
    executeQuery(ssql, [offset + 1, offset + limit], function (err, result) {
        if (err) {
            
            return res.status(500).json(err); 
        } else {
         
          
        }

    
        if (req.query.nompro || req.query.valor) {
            if (req.query.nompro) {
                ssql += " and nompro like ?";
                filtro.push("%" + req.query.nompro + "%");
            }

            if (req.query.valor) {
                ssql += " and valor >= ?";
                filtro.push(req.query.valor);
            }

        

      
            executeQuery(ssql, filtro, function (err, result) {
                if (err) {
                
                    return res.status(500).json(err); 
                } else {
                   
                    res.status(200).json(result);
                }
            });
        } else {
            
            res.status(200).json(result);
        }
    });
});



app.get("/clientes", function (req, res) {
    let filtro = [];
    let ssql = 'select nomcli, cpf_cnpj, logradouro from clientes where id > 0 ';
    const itemsPerPage = 10;
    const page = req.query.page || 1;
    const offset = (page - 1) * itemsPerPage;
    const limit = itemsPerPage;

   
    executeQuery(ssql, [offset + 1, offset + limit], function (err, result) {
        if (err) {
            
            return res.status(500).json(err); 
        } else {
         
        }

   
        if (req.query.nomcli || req.query.valor) {
            if (req.query.nomcli) {
                ssql += " and nomcli like ?";
                filtro.push("%" + req.query.nomcli + "%");
            }
        
            if (req.query.valor) {
                ssql += " and valor >= ?";
                filtro.push(req.query.valor);
            }
        
     
            executeQuery(ssql, filtro, function (err, result) {
                if (err) {
                    return res.status(500).json(err); 
                } else {
                    res.status(200).json(result); 
                }
            });
        } else {
        
            res.status(200).json(result);
        }
        
    });
});




app.post("/login", function (req, res) {
    const { usuario, senha } = req.body;

    if (!usuario || !senha) {
        return res.status(400).json({ error: "Username and password are required" });
    }

    
    const loginQuery = "SELECT * FROM USUARIO WHERE usuario = ? AND senha = ?";
    executeQuery(loginQuery, [usuario, senha], function (err, result) {
        if (err) {
            return res.status(500).json(err);
        }

       
        if (result.length > 0) {
          
            const user = { userId: result[0].id_usuario, username: result[0].usuario };
            const token = jwt.sign(user, 'tokenacess', { expiresIn: '1h' });

           
            res.status(200).json({ status: "success", message: "Login successful", token });
        } else {
            res.status(401).json({ status: "error", message: "Invalid username or password" });
        }
    });
});



app.listen(80, function(){
    console.log("Servidor no ar");
});
