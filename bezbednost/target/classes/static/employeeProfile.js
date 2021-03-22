var app = new Vue({
	el: '#employeeProfile',
	data: {
		role: "",
		user: null,
		changePass: false,
		changeData: false,
		oldPass: "",
		newPass: "",
		repeatPass: "",
		info: null,
		countries: null,
		cities: null,
		selC: null
	},
	methods: {
		logout(){
			axios
	        .post('/auth/logout', null, {
				  headers: {
					    'Authorization': "Bearer " + localStorage.getItem('access_token')
					  }
		        })
	        .then(function() {
	        	localStorage.clear();
	        	window.location.href = '/login.html';
	        })
		},
		changeState(){
			if(this.changePass == true){
				if(this.newPass.length < 6){
					JSAlert.alert("Password min length is 6 characters.");
					return;
				}
				if(this.newPass == this.repeatPass){
					if(this.user.username == this.newPass){
						JSAlert.alert("Password must not be the same as the username!");
						return;
					}
					axios
			        .post('/auth/change-password',
			            {
							oldPassword: this.oldPass,
							newPassword: this.newPass
			        	},{
			    		headers: {
							'Authorization': "Bearer " + localStorage.getItem('access_token'),
							"Content-Type": "application/json"
						  }
							
			        }).then(response => {
			        	this.info = response.data;
			        	if(this.info.result == 'success'){
			        		this.changePass = false;
			        		JSAlert.alert("You have successfully updated your password!");
			        		setTimeout(function () {
								window.location.href = '/login.html';
							}, 3000);
			        	}
			            
			        })
			        .catch(error => {
			            if (error.response.status == 401 || error.response.status == 400) {
			                JSAlert.alert("You haven't entered the correct old password!");
			            } 
			            
			        })
				}else{
					JSAlert.alert("New password and confirmed password are not the same!");
				}
			}
			else
				this.changePass = true;
		},
		discardPassCh(){
			this.changePass = false;
			this.oldPass = "";
			this.newPass = "";
			this.repeatPass = "";
			
			
		},
		chData(){
			if(this.changeData == true){
				if(this.user.firstName != "" && this.user.lastName != "" && this.user.address.street != "" && this.selectedCity != null){
					if(this.role == "DERM"){
						axios
				        .post('/api/dermatologist/update',
				        	{
				        		firstName: this.user.firstName,
				        		lastName: this.user.lastName,
				        		street: this.user.address.street,
				        		cityId: this.selectedCity.id
				            },{
				        	
				    		headers: {
								'Authorization': "Bearer " + localStorage.getItem('access_token'),
							    "Content-Type": "application/json"
							  }
							  
				        })
				        .then(response =>  {
				        	this.changeData = false;
			        		JSAlert.alert("You have successfully updated your profile!");
			        		this.getLoogedUser();
				            
				        })
				        .catch(error => {
				            if (error.response.status == 401 || error.response.status == 400 || error.response.status == 500) {
				                JSAlert.alert("Fields cannot be empty. Please try again.");
				                this.changeData = false;
				        		this.getLoogedUser();
				            }
				        })
					}
					else{
						axios
				        .post('/api/pharmacist/update',
				        	
				        	{
				        		firstName: this.user.firstName,
				        		lastName: this.user.lastName,
				        		street: this.user.address.street,
				        		cityId: this.selectedCity.id
				            },{
				        	
				    		headers: {
								'Authorization': "Bearer " + localStorage.getItem('access_token'),
							    "Content-Type": "application/json"
							  }
							  
				        })
				        .then(response => {
				        	this.changeData = false;
			        		JSAlert.alert("You have successfully updated your profile!");
			        		this.getLoogedUser();
				            
				        })
				        .catch(error => {
				            if (error.response.status == 401 || error.response.status == 400 || error.response.status == 500) {
				                JSAlert.alert("Fields cannot be empty. Please try again.");
				                this.changeData = false;
				        		this.getLoogedUser();
				            } 
				            
				        })
					}
				}
				else
				{
					JSAlert.alert("Fields cannot be empty. Please try again.");
				}
			}
			else{
				this.changeData = true;
			}
				
		},
		discardDataCh(){
			this.changeData = false;
			this.getLoogedUser();
		},
		findCity(){
			axios
			.get('/api/city/getAllCitiesForCountry',{
				headers: {
				 'Authorization': "Bearer " + localStorage.getItem('access_token')
				},
				params:{
					id: this.selectedCountry.id,
				}
	     })
	     .then(response => {
	     	this.cities = response.data
	     	this.selectedCity = null
	     })
		},
		getLoogedUser(){
			if(this.role == "DERM"){
    			axios
    			.get('/api/dermatologist/getLoggedUser',{
    				  headers: {
    					    'Authorization': "Bearer " + localStorage.getItem('access_token')
    				  }
    		     })
    		     .then(response => {
    		     	this.user = response.data;
    		     	this.selC = this.user.address.city.country.country;
    		     	this.selectedCity = this.user.address.city.id;
    		     })
    		}
    		else{
    			axios
    			.get('/api/pharmacist/getLoggedUser',{
    				  headers: {
    					    'Authorization': "Bearer " + localStorage.getItem('access_token')
    				  }
    		     })
    		     .then(response => {
    		     	this.user = response.data;
    		     	this.selC = this.user.address.city.country.country;
    		     	this.selectedCity = this.user.address.city.id;
    		     })
    		}
		},
		findAllCountriesAndCities(){
			axios
			.get('/api/country/getAllCountries',{
				headers: {
					 'Authorization': "Bearer " + localStorage.getItem('access_token')
				}
		     })
		     .then(response => {
		     	this.countries = response.data
					axios
					.get('/api/city/getAllCitiesForCountry',{
						headers: {
						 'Authorization': "Bearer " + localStorage.getItem('access_token')
						},
						params:{
							id: this.user.address.city.country.id,
						}
			     })
			     .then(response => {
			     	this.cities = response.data	
			     })
		     })
		}
	},
	created() {
		axios
        .get('/auth/getRole',{
			  headers: {
			    'Authorization': "Bearer " + localStorage.getItem('access_token')
			  }
        })
        .then(response => {
        	this.role = response.data;
        	if(response.data != "DERM" && response.data != "PHARM"){
        		window.location.href = '/login.html';
        	}
        	if(this.role == "DERM"){
    			axios
    			.get('/api/dermatologist/getLoggedUser',{
    				  headers: {
    					    'Authorization': "Bearer " + localStorage.getItem('access_token')
    				  }
    		     })
    		     .then(response => {
    		     	this.user = response.data;
    		     	this.selC = this.user.address.city.country.country;
    		     	this.selectedCity = this.user.address.city.id;
    		     	this.findAllCountriesAndCities();
    		     })
    		}
    		else{
    			axios
    			.get('/api/pharmacist/getLoggedUser',{
    				  headers: {
    					    'Authorization': "Bearer " + localStorage.getItem('access_token')
    				  }
    		     })
    		     .then(response => {
    		     	this.user = response.data;
    		     	this.selC = this.user.address.city.country.country;
    		     	this.findAllCountriesAndCities();
    		     })
    		}
        })
        .catch(function() {
        	window.location.href = '/login.html';
	    })
	}
})