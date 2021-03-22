var app = new Vue({
	el: '#pharmacies',
	data: {
		pharmacies: [],
		columns: ['name', 'city'],
		columns2: ['name', 'manufacturer'],
		tableh: ['Name', 'City'],
		tableh2: ['Name', 'Manufacturer'],
		sortKey: 'price',
		reverse: 1,
		medications: [],
	},
	methods: {
		sortBy(sortKey) {
      		this.reverse = -this.reverse;
      		this.rev = !this.rev;
      		this.sortKey = sortKey;
      		console.log(this.reverse)
      		console.log(this.sortKey)
    	},
    	btnClick(btnId){
    		console.log(btnId)
    		window.location.href = "pharmacy.html?id=" + btnId;
    	},
    	searchMedication(){
			console.log(this.medicationName)
			if(this.medicationName == ""){
				axios
					.get('/api/medicine/getAll',{
					headers: {
						    			'Authorization': "Bearer " + localStorage.getItem('access_token')
					  			},
					}).then(response => {
						this.medications = response.data
						console.log(this.medications)
				})
			}
			else{
				axios
				.get('/api/medicine/searchMedicinesByName',{
					headers: {
					    'Authorization': "Bearer " + localStorage.getItem('access_token')
				  	},
				  	params: {
				  		name: this.medicationName,
				  	}
				})
				.then(response => {
					this.medications = response.data
					console.log(response.data)
				})
			}
		},
		searchPharmacies(){
			console.log(this.pharmacyName)
			if(this.pharmacyName == ""){
				axios
					.get('/api/pharmacy/findAll',{
						headers: {
							    			'Authorization': "Bearer " + localStorage.getItem('access_token')
						  			},
						}).then(response => {
							this.pharmacies = response.data
					})
			}
			else{
				axios
				.get('/api/pharmacy/findPharmacyByName',{
					headers: {
					    'Authorization': "Bearer " + localStorage.getItem('access_token')
				  	},
				  	params: {
				  		name: this.pharmacyName,
				  	}
				})
				.then(response => {
					this.pharmacies = response.data
					console.log(response.data)
				})
			}
		}
	},
	created() {
		axios
			.get('/api/pharmacy/findAll',{
			headers: {
				    			'Authorization': "Bearer " + localStorage.getItem('access_token')
			  			},
			}).then(response => {
				this.pharmacies = response.data
			})
			
		axios
			.get('/api/medicine/getAll',{
			headers: {
				    			'Authorization': "Bearer " + localStorage.getItem('access_token')
			  			},
			}).then(response => {
				this.medications = response.data
				console.log(this.medications)
			})

	}
})