var app = new Vue({
	el: '#adminProfile',
	data: {
		admin: null,
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
			        	console.log(this.info)
			        	if(this.info.result == 'success'){
			        		this.changePass = false;
			        		JSAlert.alert("You have successfully updated your password!");
			        		setTimeout(function () {
								window.location.href = '/login.html';
							}, 3000);
			        	}
			            
			        })
			        .catch(error => {
			            console.log(error)
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
				this.changeData = false;
				if(this.admin.firstName != "" && this.admin.lastName != "" && this.admin.address != ""){
		     	axios
		        .post('/api/pharmacyAdmin/save',
		        	
		        	{
		        		firstName: this.admin.firstName,
		        		lastName: this.admin.lastName,
		        		street: this.admin.address.street,
		        		cityId: this.selectedCity.id
		            },{
		        	
		    		headers: {
						'Authorization': "Bearer " + localStorage.getItem('access_token'),
					    "Content-Type": "application/json"
					  }
					  
		        })
		        .then(response => {
	        		JSAlert.alert("You have successfully updated your profile!");
	        		axios
	        		.get('/api/pharmacyAdmin/getLoggedUser',{
	        			  headers: {
	        				    'Authorization': "Bearer " + localStorage.getItem('access_token')
	        			  }
	        	     })
	        	     .then(response => {
	        	     	this.admin = response.data
	        	     })
		            
		        })
		        .catch(error => {
		            console.log(error)
		            if (error.response.status == 401 || error.response.status == 400 || error.response.status == 500) {
		                JSAlert.alert("Fields cannot be empty. Please try again.");
		                axios
		        		.get('/api/pharmacyAdmin/getLoggedUser',{
		        			  headers: {
		        				    'Authorization': "Bearer " + localStorage.getItem('access_token')
		        			  }
		        	     })
		        	     .then(response => {
		        	     	this.admin = response.data
		        	     })
		            } 
		            
		        })
				}else{
					JSAlert.alert("Fields cannot be empty. Please try again.");
					 axios
		        		.get('/api/pharmacyAdmin/getLoggedUser',{
		        			  headers: {
		        				    'Authorization': "Bearer " + localStorage.getItem('access_token')
		        			  }
		        	     })
		        	     .then(response => {
		        	     	this.admin = response.data
		        	     })
				}
				}
			else{
				this.changeData = true;
			}
				
		},
		discardDataCh(){
			this.changeData = false;
			axios
			.get('/api/pharmacyAdmin/getLoggedUser',{
				  headers: {
					    'Authorization': "Bearer " + localStorage.getItem('access_token')
				  }
		     })
		     .then(response => {
		     	this.admin = response.data
		     })
		},
		findCity(){
			console.log
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
	     	console.log(response.data)
	     	this.cities = response.data	
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
        	if(response.data != "ADMIN"){
        		window.location.href = '/login.html';
        	}
        })
        .catch(function() {
        	window.location.href = '/login.html';
	    })
		axios
		.get('/api/pharmacyAdmin/getLoggedUser',{
			  headers: {
				    'Authorization': "Bearer " + localStorage.getItem('access_token')
			  }
	     })
	     .then(response => {
	     	this.admin = response.data;
	     	this.selC = this.admin.address.city.country.country;
	     })
	     axios
		.get('/api/country/getAllCountries',{
			headers: {
				 'Authorization': "Bearer " + localStorage.getItem('access_token')
			}
	     })
	     .then(response => {
	     	console.log(response.data)
	     	this.countries = response.data
				console.log
				axios
				.get('/api/city/getAllCitiesForCountry',{
					headers: {
					 'Authorization': "Bearer " + localStorage.getItem('access_token')
					},
					params:{
						id: this.admin.address.city.id,
					}
		     })
		     .then(response => {
		     	console.log(response.data)
		     	this.cities = response.data	
		     	console.log(this.cities)
		     })
	     })
	}
})