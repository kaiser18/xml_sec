var app = new Vue({
	el: '#manageDerm',
	data: {
		medicine: [],
		pharmacyId: "",
		admin: null,
		changePass: false,
		changePrice: false,
		changeData: false,
		oldPass: "",
		newPass: "",
		newMedication: [],
		medId: null,
		searchMedicine: "",
		priceMedId: null,
		newPrice: "",
		startOfPrice: null,
		endPfPrice: null
		
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
		
		dermCal(dermId){
			window.localStorage.setItem('dermId', dermId);
		},
		
		addNewMedication(id){
			window.localStorage.setItem('medId', id);
			axios
	        .post('/api/medicineInPharmacy/addMedicine',
	        	
	        	{
	        		id: window.localStorage.getItem('medId')
	            },{
	        	
	    		headers: {
					'Authorization': "Bearer " + localStorage.getItem('access_token'),
				    "Content-Type": "application/json"
				  }
				  
	        })
	        .then(response => {
	            
	        })
		},
		
		deleteMedication(id){
			window.localStorage.setItem('medId', id);
			this.medId = window.localStorage.getItem('medId');
			axios
	        .delete('/api/medicineInPharmacy/delete/' + this.medId,{

	    		headers: {
					'Authorization': "Bearer " + localStorage.getItem('access_token'),
				    "Content-Type": "application/json"
				  }
				  
	        })
	        .then(response => {
	        	if(response.data = false){
	        		 JSAlert.alert("Medication is reserved. It cannot be deleted!");
	        	}
	        	window.location.href = '/pharmacyAdmin/managingMedication.html';
	        }).catch(error => {
	            console.log(error)
	            if (error.response.status == 401 || error.response.status == 400 || error.response.status == 500) {
	                JSAlert.alert("Dermatologist has appointments scheduled. He cannot be deleted.");
	            }
	            
	    })
		},
		
		changeState(){
			if(this.changePass == true){
				this.changePass = false;
				
			}
			else
				this.changePass = true;
		},
		discardPassCh(){
			this.changePass = false;
		},
		changePriceState(id){
			this.priceMedId = id;
			if(this.changePrice == true){
				this.changePrice = false;
				
			}
			else
				this.changePrice = true;
		},
		discardPriceCh(){
			this.changePrice = false;
		},
		defNewPrice(){
			axios
			.post('/api/medicinePrice/changePrice',
					{
						medicineId:this.priceMedId,
						newPrice: this.newPrice,
						startOfPrice: this.startOfPrice,
						endOfPrice: this.endOfPrice,
					},
					{
					headers: {
					    'Authorization': "Bearer " + localStorage.getItem('access_token')
					  }
					})
			.then(response => {
				window.location.href = '/pharmacyAdmin/managingMedication.html';
			})
			.catch(error => {
		            if (error.response.status == 401 || error.response.status == 400 || error.response.status == 500) {
		                JSAlert.alert(error.response.data.errors[0].defaultMessage);
		            }		            
		        })
		},
		search(){
			axios
			.get('/api/medicine/searchMedicineInPharmacy',
					{
						params:{
							name: this.searchMedicine
						},
					headers: {
					    'Authorization': "Bearer " + localStorage.getItem('access_token')
					  }
				
			})
			.then(response => {
				this.medicine = response.data
			})
		},
		formatDate(d){
			let date = new Date(d)
			return date.getDate() + "." + (date.getMonth() + 1) + "." + date.getFullYear() + ".";
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
					.get('/api/medicine/findAllMedicineInPharmacy',
							{
							headers: {
							    'Authorization': "Bearer " + localStorage.getItem('access_token')
							  }
						
					})
					.then(response => {
						this.medicine = response.data
						axios
						.get('/api/medicine/findAllMedicineNotInPharmacy',
								{
								headers: {
								    'Authorization': "Bearer " + localStorage.getItem('access_token')
								  }
							
						})
						.then(response => {
							this.newMedication = response.data
						})
					})
		     })	    
	}
})