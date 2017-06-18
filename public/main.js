const api = {
	url: 'http://pokeapi.co/api/v2/pokedex/1/',
 	url2 : 'http://pokeapi.co/api/v2/pokemon-species/',
 	urllocal:'pokeuni.json'
 }

const getJSON = (url, cb) => {
	const xhr = new XMLHttpRequest();
		  xhr.addEventListener('load', () => {
			if (xhr.status !== 200) {
     	 		return cb(new Error('Error loading JSON from ' + url + '(' + xhr.status + ')'));
     			}
			cb(null, xhr.response);
 		});
		
	xhr.open('GET',url);
  	xhr.responseType = 'json';
  	xhr.send();
};

const Pokemon = {
  pokemon: null
 };


$( _ => {
	//Variables globales	
		const $grilla = $('section.grilla');
		const arrTipo = [];	

    //Modal
		const $titulo = $('h2');
		const $descripcion = $('p#description');
		const $caracteristicas = $('div#caracteristicas');	
		const $tipo = $('div#tipo');
		const $debilidad = $('div#debilidad');
		const divImg = $('div.foto-modal');
		 	  divImg.append('<img class="pokemon-modal"></img>')
			        .append('<img src="icon/fondo.png" class="fondo-modal"></img>')
			   		.append('<div class="iconos-modal"></div>');
		$('div.iconos-modal').append('<img src="icon/pokeball_gray.png"></img>')
		 					  .append('<img src="icon/valentines-heart.png"></img>')
		 					  .append('<img src="icon/data.png"></img>');
		 	
	
	//Lectura de Archivos Json		
		getJSON(api.urllocal, (err, json) => {
			if (err) { return alert(err.message);}
			Pokemon.pokemon = json.pokemon_entries;
   			console.log(Pokemon.pokemon);
  			pintarPokemon(Pokemon.pokemon);

   		});

	//Función para la busqueda en input		
		$('input#pokesearh').on("keyup",function(e){
			$grilla.empty();
			var $inputVal = $('input#pokesearh').val();
			var filtro =Pokemon.pokemon.filter(function(val,i){
					var nombre = val.pokemon_species.name.toLowerCase();	
						if(nombre.indexOf($inputVal.toLowerCase()) != -1){
							return true;
						}	
				})
			pintarPokemon(filtro);	

		})

		//Función para ordernar la grilla Alfabeticamente	
		$('button#sort').on('click',function(){
			var $pokeGrilla = $('div.row.pokeGrill');
			var $pokeFoto = $pokeGrilla.children('div.foto')
				$pokeFoto.sort(function(a, b) {
				   var compA = $(a).text().toUpperCase();
				   var compB = $(b).text().toUpperCase();
				   return (compA < compB) ? -1 : (compA > compB) ? 1 : 0;
				})
			
				jQuery.each($pokeFoto, function(i, val) 
					{ $pokeGrilla.append(val); 
					});		
				

				}) 			
			
	

		
		function pintarPokemon(object) {
		    const $wrapper = $('<div id="wrapper" class="container"></div>');
    		const $row = $('<div class="row pokeGrill"></div>');
    		$wrapper.append($row);
    	   	$grilla.append($wrapper);

    	   	for(var i in object){
					$row.append('<div class="foto"></div>')
				}
		
			const $arrPoke = $('div.foto');

		
			jQuery.each(object,function(i,val){
				$arrPoke.eq(i).append('<img class="pokemon"></img>');
				$arrPoke.eq(i).attr('id',val.pokemon_species.name);
				$('img.pokemon').eq(i).attr('src','http://serebii.net/art/th/'+val.entry_number+'.png');
				$arrPoke.eq(i).append('<img src="icon/fondo.png" class="fondo"></img>');
				$arrPoke.eq(i).append('<div class="iconos"></div>');
				$arrPoke.eq(i).append('<h4 class="nombre"></h4>');
				$('h4.nombre').eq(i).text(val.pokemon_species.name);
				$('div.iconos').eq(i).append('<img src="icon/pokeball_gray.png"></img>');
				$('div.iconos').eq(i).append('<img src="icon/valentines-heart.png"></img>');
				$('div.iconos').eq(i).append('<img src="icon/data.png"></img>');
				$('div.iconos').eq(i).children().wrap('<a href="#" class="btn btn-default" data-toggle="modal" data-target="#myModal"></a>');
				$('div.iconos').eq(i).children().first().attr('data-id',val.entry_number).on('click',function(){
				
					getJSON('podetalle'+val.entry_number+'.json', (err, json) => {
						if (err) { return alert(err.message);}
						const src = "http://serebii.net/art/th/"+val.entry_number+".png";
						const nombre = json.name;
						const descripcion =  json.flavor_text_entries[11].flavor_text;
						const categoria = json.genera[2].genus 

						getJSON('pokcaract'+val.entry_number+'.json', (err, json) => {
							if (err) { return alert(err.message);}
							const altura = json.height;
							const peso = json.weight;
							const habilidad = json.abilities;
							const tipo = json.types;
								mostrarModal(src,nombre,descripcion,categoria,altura,peso,habilidad,tipo);
						});
					
					});

					function mostrarModal(src,nombre,descripcion,categoria,altura,peso,habilidad,tipo){
						const pesoKg = (parseFloat(peso/10)).toString()+'kg.';
						$('img.pokemon-modal').attr('src',src);
						$titulo.text(nombre);
						$descripcion.text(descripcion);
						$caracteristicas.children().first().find("span").text(altura);
						$caracteristicas.children().first().next().find("span").text(categoria);
						$caracteristicas.children().first().next().next().find("span").text(pesoKg);
						jQuery.each(habilidad,function(i,val){
								$caracteristicas.children().first().next().next().next().find("span").eq(i).text(val.ability.name);
							});
						$tipo.append('<h4>Tipo:</h4>');
						$tipo.append('<div class="containerBotones"></div>')
						$debilidad.append('<h4>Debilidad:</h4>')
						$debilidad.append('<div class="detalle-debilidad">Presiona el tipo para ver la debilidad correspondiente</div>');
						jQuery.each(tipo,function(i,val){
							$('div.containerBotones').append('<button type="button" class="tipo"></button>');
								var id = val.type.url.slice(val.type.url.length-2).substring(0,1);
									getJSON('tipo'+id+'.json', (err, json) => {
										if (err) { return alert(err.message);}
										$('button.tipo').eq(i).text(json.names[4].name);
										$('button.tipo').eq(i).attr('id',json.names[4].name);
										$('button.tipo').eq(i).on('click',function(e){
											var arrDebilidades = [];		
											$('div.detalle-debilidad').attr('id',$(this).attr('id'));
											$('div.detalle-debilidad').empty();
											jQuery.each(json.damage_relations.double_damage_from,function(i,val){
													arrDebilidades.push(val.name);
												});
											jQuery.each(json.damage_relations.double_damage_to,function(i,val){
													arrDebilidades.push(val.name);
												});
											jQuery.each(arrDebilidades,function(i,val){
													$('div.detalle-debilidad').append('<div class="poke-damage"></div>');	
													$('div.poke-damage').eq(i).attr('id',val);
													$('div.poke-damage').eq(i).text(val);
												})	
										})
									});
						})

					}
					//Funcion para el boton que cierra el modal	
					$('button.close').on('click',function(){
						$('img.pokemon-modal').attr('src',"");
						$titulo.text("");
						$descripcion.text("");
						$caracteristicas.children().first().find("span").text("");
						$caracteristicas.children().first().next().find("span").text("");
						$caracteristicas.children().first().next().next().find("span").text("");
						$caracteristicas.children().first().next().next().next().find("span").text("");
						$tipo.empty();
						$debilidad.empty();
					})

					//Funcion de tecladoo para cerrar el modal	
					$(document).on('keydown',function(e){
						switch(e.which){
							case 27:
							$('button.close').trigger('click');
							$('div#myModal').css( "display", "none" );			
						}
					})


	



					})
				})	

		}


});

		