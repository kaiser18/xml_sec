/*var app = new Vue({
	el: '#profile',
	data: {
		patients: null,
		oldpass: "",
		newpass: "",
		name: "",
		surname: "",
		reservedMedications: [],
	},
	methods: {
		changepass() {
		axios.get('/api/patient/updatePassword',{
		headers: {
				    'Authorization': "Bearer " + localStorage.getItem('access_token')
			  },
		params:{
			oldpass: this.oldpass,
			newpass: this.newpass,
			id: this.patients.id,
			}
		}).then(response => {
					alert('Lozinka je uspesno promenjena.')
			})
		},
		changedata(){
		axios.get('/api/patient/updatePatient',{
		headers: {
				    'Authorization': "Bearer " + localStorage.getItem('access_token')
			  },
		params:{
			name: this.name,
			surname: this.surname,
			id: this.patients.id,
			}
		}).then(response => {
					alert('Novo ime: ' + this.name + '\nNovo prezime: ' + this.surname)
			})
		}
	},
	created() {
		axios
		.get('/api/patient/getLoggedUser',{
			  headers: {
				    'Authorization': "Bearer " + localStorage.getItem('access_token')
			  }
	     }).then(response => {
					this.patients = response.data
					this.name = this.patients.firstName
					this.surname = this.patients.lastName
			})
		
	}
})*/

var app = new Vue({
	el: '#patientProfile',
	data: {
		patient: null,
		changePass: false,
		changeData: false,
		oldPass: "",
		newPass: "",
		repeatPass: "",
		name: "",
		surname: "",
		email: "",
		countries: null,
		cities: null,
		addresses: null,
		idCountry: 0,
		idCity: 0,
		idAddress: 0,
		reservedMedications: [],
		examinations: [],
		columns: ['name', 'manufacturer'],
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
				this.changePass = false;
				//axios za izmenu passworda
				axios.get('/api/patient/updatePassword',{
					headers: {
				    	'Authorization': "Bearer " + localStorage.getItem('access_token')
			  		},
					params:{
						oldPass: this.oldPass,
						newPass: this.newPass,
						id: this.patient.id,
					}
				}).then(response => {
					alert('Lozinka je uspesno promenjena.')
				})
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
			console.log('CHDATA SC: ' + this.selectedAddress)
			if(this.changeData == true){
				this.changeData = false;
				//axios za izmenu podataka
				axios.get('/api/patient/updatePatient',{
		headers: {
				    'Authorization': "Bearer " + localStorage.getItem('access_token')
			  },
		params:{
			name: this.name,
			surname: this.surname,
			email: this.email,
			id: this.patient.id,
			}
		}).then(response => {
					alert('Novo ime: ' + this.name + '\nNovo prezime: ' + this.surname + '\nNov email: ' + this.email)
			})
				}
			else{
				this.changeData = true;
			}
				
		},
		discardDataCh(){
			this.changeData = false;
			axios
			.get('/api/patient/getLoggedUser',{
				  headers: {
					    'Authorization': "Bearer " + localStorage.getItem('access_token')
				  }
		     })
		     .then(response => {
		     	this.patient = response.data
		     })
		},
		setAddress(){
			console.log('Selektovana adresa: ' + this.selectedAddress)
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
	     	
	     	axios
			.get('/api/address/getAllAddressesForCity',{
				headers: {
				 'Authorization': "Bearer " + localStorage.getItem('access_token')
				},
				params:{
					id: 0,
				}
	     })
	     .then(response => {
	     	console.log('Radipromenu' + response.data)
	     	this.addresses = response.data	
	     })
	     })
		},
		findAddresses(){
			
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
        	if(response.data != "PATIENT"){
        		window.location.href = '/login.html';
        	}
        })
        .catch(function() {
        	window.location.href = '/login.html';
	    })
		axios
		.get('/api/patient/getLoggedUser',{
			  headers: {
				    'Authorization': "Bearer " + localStorage.getItem('access_token')
			  }
	     })
	     .then(response => {
	     	this.patient = response.data
	     	console.log(response.data)
	     	this.name = this.patient.firstName
	     	this.surname = this.patient.lastName
	     	this.email = this.patient.email
	     	this.idCountry = this.patient.address.city.country
	     	this.selectedCountry = this.patient.address.city.country.id
	     	this.selectedCity = this.patient.address.city.id
	     	this.selectedAddress = this.patient.address.id
	     	//console.log('Selected Address pri kreiranju str: ' + this.selectedAddress)
	     	
	     		     axios
		.get('/api/patient/findAllReservedMedicine',{
			  headers: {
				    'Authorization': "Bearer " + localStorage.getItem('access_token')
			  },
			  params:{
			  	id: this.patient.id,
			  }
	     })
	     .then(response => {
	     	this.reservedMedications = response.data
	     	console.log(this.reservedMedications)
	     })
	     
	     axios
		.get('/api/examination/getExaminationsForPatient',{
			  headers: {
				    'Authorization': "Bearer " + localStorage.getItem('access_token')
			  },
	     })
	     .then(response => {
	     	this.examinations = response.data
	     	console.log('AAAAAAA' + this.examinations)
	     })
	     	
	     })
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
					id: this.selectedCountry,
				}
	     })
	     .then(response => {
	     	this.cities = response.data	
	     	axios
			.get('/api/address/getAllAddressesForCity',{
				headers: {
				 'Authorization': "Bearer " + localStorage.getItem('access_token')
				},
				params:{
					id: this.selectedCity,
				}
	     })
	     .then(response => {
	     	this.addresses = response.data	
	     })
	     })
	     })
	}
})