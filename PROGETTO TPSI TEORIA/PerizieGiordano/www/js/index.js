
let newPerizia;
document.addEventListener('deviceready', function(){
	console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);
	let wrapper = $("#wrapperMacchina")	
	// console.log(navigator.Camera);
	
	let cameraOptions = {
		quality: 50,
		// destinationType: Camera.DestinationType.FILE_URI,
		destinationType: Camera.DestinationType.DATA_URL, 
	}
	


	$("#btnScatta").on("click", acquisisciFoto)
	$("#btnCerca").on("click", acquisisciFoto)
	
	function acquisisciFoto(){
		if($(this).prop("id")=="btnScatta")
			cameraOptions.sourceType=Camera.PictureSourceType.CAMERA
		else
			cameraOptions.sourceType=Camera.PictureSourceType.PHOTOLIBRARY 

		cameraOptions.destinationType = Camera.DestinationType.DATA_URL
		let request = navigator.camera.getPicture(onSuccess, onError, cameraOptions)
		/*  le promise NON sembrano funzionare !
			let request = ...
			request.then(onSuccess)
			request.catch(onError)    */
	}
	
	

	function onSuccess(imageData) {
		console.log(imageData)
		
		$("<input [type=text] class='inp'>").appendTo(wrapper)

		let request = inviaRichiesta("POST", "/api/sendImageToCloudinary",{"img": "data:image4/jpeg;base64,"  + imageData}  );
			request.done(function(imageUrl){
				let photo = {
					"desc": "Lorem",
					"imgName": imageUrl.src
				}
				//console.log(imageUrl)
				newPerizia["photos"].push(photo);
				$("<img>").appendTo(wrapper)
				.css({"height":80})  // width si adatta automaticamente
				.prop("src", imageUrl.src);

			})
			request.fail(function(){
				alert("Qualcosa è andato storto, riptova")
			})

		


	}
	

	function onError(err) {
		//se l'utente usa il pulsante BACK senza scegliere nessuna foto,
		//viene richiamato onError, passandogli però code = undefined 
		if (err.code)
			notifica("Errore: " + err.code + " - " + err.message);
	}
})

$(document).ready(function() {
	
	let _username = $("#usr")
		let _password = $("#pwd")
		let _lblErrore = $("#lblErrore");
		let _divwrapperMacchina = $("#wrapperMacchina");
		let _divlogin = $("#login");
		let _id;
		_divwrapperMacchina.hide();

		$("#table").hide()
		_lblErrore.hide();


		$("#btnLogin").on("click", controllaLogin)
		
		// il submit deve partire anche senza click 
		// con il solo tasto INVIO
		$(document).on('keydown', function(event) {	
		if (event.keyCode == 13)  
			controllaLogin();
		});
		
		
		function controllaLogin(){
			_username.removeClass("is-invalid");
			_username.prev().removeClass("icona-rossa");  				
			_password.removeClass("is-invalid");
			_password.prev().removeClass("icona-rossa"); 

			_lblErrore.hide();		
			
			if (_username.val() == "") {
				_username.addClass("is-invalid");  
				_username.prev().addClass("icona-rossa");  
			} 
			else if (_password.val() == "") {
				_password.addClass("is-invalid"); 
				_password.prev().addClass("icona-rossa"); 
			}		
			else {
				let request = inviaRichiesta('POST', '/api/login',  
					{ 
						"username": _username.val(),
						"password": _password.val() 
					}
				);
				request.fail(function(jqXHR, test_status, str_error) {
					if (jqXHR.status == 401) {  // unauthorized
						_lblErrore.show();
					} else
						errore(jqXHR, test_status, str_error);
				});
				request.done(function(data, textstatus, req) {				
					//alert(req.getResponseHeader("authorization"));
					_divlogin.hide();
					_id = data.ris;
					console.log(data);

					let request1 = inviaRichiesta('get', '/api/elencoPerizie/' + _id);
					request1.done(function(data){
						$("#table").show();
						for (const item of data) {
							let tr = $("<tr>");
							tr.prop("perizia", item)
							let td = $("<td>");
							td.text(item.Luogo);
							tr.append(td);

							td = $("<td>");
							td.text(item.date);
							tr.append(td);

							td = $("<td>");
							td.text(item.desc);
							tr.append(td);
							$("#perizie").append(tr);

							tr.on("click", function(){
								console.log($(this).prop("perizia"))
							})
						}
					})
					request1.fail(function(err){
						alert("Errore nella richiesta delle perizie" + err.message)
					})
				})			
			}
		}
		
		
		_lblErrore.children("button").on("click", function(){
			_lblErrore.hide();
		})
		
		$("#new").on("click", function(){
			_divwrapperMacchina.show();
			newPerizia= {
				"photos":[]
			};
		})

		$("#SendPerizia").on("click", function(){
			newPerizia["codOp"] = _id;
				newPerizia["Luogo"] = $("#Place").val();
				newPerizia["coodrdinateGeo"] = $("#cords").val();
				newPerizia["date"] = $("#date").val();
				newPerizia["desc"] = $("#desc").val();
				let i=0;
				for (const item of $(".inp")) {
					newPerizia["photos"][i++]["desc"] = $(item).val()
				}
				let req = inviaRichiesta("post", "/api/sendnewPerizia", newPerizia);

				req.done(function(){
					alert("Perizia inviata correttamente")
				})

				req.fail(function(){
					alert("Qualcosa è andato storto");
				})

			
		})
		

	
})