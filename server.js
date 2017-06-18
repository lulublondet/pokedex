const express = require("express");
const app = express();
const puerto = process.env.PORT || 3000;
const server = app.listen(puerto,listening);

	 function listening(){
		console.log('El servidor está corriendo en el puerto '+ puerto);
	}

//app.get("/", inicio);
app.get("/icon", icon);
app.get("/Flexo", flexo);

app.use(express.static("public"));
/*app.use("/static", express.static("public"));*/

function icon (peticion, resultado)
{
   resultado.sendFile(__dirname + "/icon");
}

function flexo (peticion, resultado)
{
   resultado.sendFile(__dirname + "/Flexo");
}



//https://platzi.com/programacion-basica/tutoriales/como-agregar-html-a-tu-servidor-web-con-express/
//https://www.youtube.com/watch?v=e4qKBkwwkNg
//https://www.youtube.com/watch?v=oMhAd864bBc
