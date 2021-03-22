var app = new Vue({
	el: '#pharmacies',
	data: {
		pharmacies: [],
		medication: null,
		patient: null,
		date: new Date().toISOString().slice(0,10),
		
		
	},
	methods: {
		changePharmacy(){
			console.log(this.selectedButtonValue)
			axios
			.get('/api/pharmacy/searchMedicineInPharmacy',{
				headers: {
				    'Authorization': "Bearer " + localStorage.getItem('access_token')
			  	},
			  	params: {
			  		id: this.selectedButtonValue,
			  		name: this.medicationName,
			  	}
			})
			.then(response => {
				this.medication = response.data
			})

		},
		
		searchMedication(){
		
			axios
			.get('/api/pharmacy/searchMedicineInPharmacy',{
				headers: {
				    'Authorization': "Bearer " + localStorage.getItem('access_token')
			  	},
			  	params: {
			  		id: this.selectedButtonValue,
			  		name: this.medicationName,
			  	}
			})
			.then(response => {
				this.medication = response.data
			})
			
		},
		
		reserveMedication(){
			console.log(this.date)
			
			axios
			.get('/api/pharmacy/updateMedicineInPharmacy',{
				headers: {
				    'Authorization': "Bearer " + localStorage.getItem('access_token')
			  	},
			  	params: {
			  		pharmId: this.selectedButtonValue,
			  		medId: this.medication.id,
			  		quantity: 1,
			  	}
			})
			.then(response => {
				
				axios
			.get('/api/patient/updateReservedMedicine',{
				headers: {
				    'Authorization': "Bearer " + localStorage.getItem('access_token')
			  	},
			  	params: {
			  		patId: this.patient.id,
			  		medId: this.medication.id,
			  		quantity: 1,
			  		date : this.date,
			  	}
			})
			.then(response => {
				alert('Rezervisan je lek: ' + this.medication.name)
			})
				
			})
			
		}
	},
	created() {
		
		axios
		.get('/api/patient/getLoggedUser',{
			  headers: {
				    'Authorization': "Bearer " + localStorage.getItem('access_token')
			  }
	     })
	     .then(response => {
	     	this.patient = response.data
	     })
	
		axios
			.get('/api/pharmacy/findAll',{
				headers: {
				    'Authorization': "Bearer " + localStorage.getItem('access_token')
			  }
			})
			.then(response => {
				this.pharmacies = response.data
			})

	}
})