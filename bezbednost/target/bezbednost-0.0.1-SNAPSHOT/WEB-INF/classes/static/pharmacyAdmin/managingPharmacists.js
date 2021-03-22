var app = new Vue({
	el: '#managePharm',
	data: {
		pharms: [],
		pharmacyId: "",
		admin: null,
		changePass: false,
		changeData: false,
		oldPass: "",
		newPass: "",
		newDerms: [],
		pharmId: null,
		newPharm: null,
		countries: [],
		cities: [],
		searchPharmFirst: "",
		searchPharmLast: "",
		selectedCity: "",
		selectedCountry: ""
		
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
		
		pharmCal(pharmId){
			window.localStorage.setItem('pharmId', pharmId);
		},
		
		
		
		firePharm(pharmId){
			window.localStorage.setItem('pharmId', pharmId);
			this.pharmId = window.localStorage.getItem('pharmId');
			axios
	        .delete('/api/pharmacist/fire/' + pharmId,{

	    		headers: {
					'Authorization': "Bearer " + localStorage.getItem('access_token'),
				    "Content-Type": "application/json"
				  }
				  
	        })
	        .then(response => {
	        	window.location.href = '/pharmacyAdmin/managingPharmacists.html';
	        })
	        .catch(error => {
		            console.log(error)
		            if (error.response.status == 401 || error.response.status == 400 || error.response.status == 500) {
		                JSAlert.alert("Pharmacist has appointments scheduled. He cannot be deleted.");
		                setTimeout(function () {
							window.location.href = '/pharmacyAdmin/managingPharmacists.html';
						}, 3000);
		            }
		            
		    })
		},
		
		changeState(){
			if(this.changePass == true){
				if(this.newPharm.password != null){
					if(this.newPharm.password.length < 6){
						JSAlert.alert("Password min length is 6 characters.");
						return;
					}
				}
				axios
		        .post('/api/pharmacist/save',
		        	
		        	{
		        		firstName: this.newPharm.firstName,
		        		lastName: this.newPharm.lastName,
		        		email: this.newPharm.email,
		        		address: this.newPharm.street,
		        		cityId: this.selectedCity.id,
		        		username: this.newPharm.password,
		        		gender: this.newPharm.gender
		            },{
		        	
		    		headers: {
						'Authorization': "Bearer " + localStorage.getItem('access_token'),
					    "Content-Type": "application/json"
					  }
					  
		        })
		        .then(response => {
	        		JSAlert.alert("You have successfully registered a new pharmacist!");
					this.changePass = false;
					this.newPharm = null;
					this.selectedCity = "";
					this.selectedCountry = "";
					this.cities = []
	        		axios
					.get('/api/pharmacy/findAllPharmsInPharmacy',
							{
								params:{
									id: this.pharmacyId
								},
							headers: {
							    'Authorization': "Bearer " + localStorage.getItem('access_token')
							  }
						
					})
					.then(response => {
						this.pharms = response.data
					})
		            
		        })
		        .catch(error => {
		            if (error.response.status == 401 || error.response.status == 400 || error.response.status == 500) {
		                JSAlert.alert(error.response.data.errors[0].defaultMessage);
		                this.changePass = true;
		            }else if(error.response.status == 406){
		            	JSAlert.alert("This username is already in use. Please try another one!");
						this.changePass = true;
		            }
		            
		        })
			}
			else
				this.changePass = true;
		},
		discardPassCh(){
			this.changePass = false;
		},
		findCity(){
			this.selectedCity = ""
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
		},
		
		search(){
			axios
			.get('/api/pharmacy/searchPharmsInPharmacy',
					{
						params:{
							id: this.pharmacyId,
							firstName: this.searchPharmFirst,
							lastName: this.searchPharmLast
						},
					headers: {
					    'Authorization': "Bearer " + localStorage.getItem('access_token')
					  }
				
			})
			.then(response => {
				this.pharms = response.data
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
	     	this.admin = response.data
	     })
	     axios
			.get('/api/pharmacyAdmin/getPharmacy',{
				  headers: {
					    'Authorization': "Bearer " + localStorage.getItem('access_token')
				  }
		     })
		     .then(response => {
		    	 this.pharmacyId = response.data
		    	 axios
					.get('/api/pharmacy/findAllPharmsInPharmacy',
							{
								params:{
									id: this.pharmacyId
								},
							headers: {
							    'Authorization': "Bearer " + localStorage.getItem('access_token')
							  }
						
					})
					.then(response => {
						this.pharms = response.data
					})
		     }),
		     axios
				.get('/api/country/getAllCountries',{
					headers: {
						 'Authorization': "Bearer " + localStorage.getItem('access_token')
					}
			     })
			     .then(response => {
			     	console.log(response.data)
			     	this.countries = response.data
				
			     })
	}
})