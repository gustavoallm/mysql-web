const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// MySQL
var con = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "root",
	database: "gagel",
});

//Get MySQL Response
app.get("/execute", (req, res) => {
	con.connect(function (err) {
		if (err) throw err;

		var sql = req._parsedUrl.query.replaceAll("%20", " ").replaceAll("%22", '"').replaceAll("%27", "'").trim();

		con.query(sql, (err, result) => {
			if (err) res.send(err);

			userResponse = getResponse(sql, result);
			console;
			res.send(userResponse);
		});
	});
});

function getResponse(query, result) {
	const firstWord = query.split(" ")[0].toLowerCase();

	if (firstWord == "select") {
		return result;
	}

	const linha = result.affectedRows > 1 ? "Linhas foram afetadas." : "Linha foi afetada.";

	return {
		message: `Query executada com sucesso! \n\n${query} \n\n${result.affectedRows} ${linha}`,
	};
}

//Listen on port 5000
app.listen(port, () => console.log("Backend Iniciado!"));
