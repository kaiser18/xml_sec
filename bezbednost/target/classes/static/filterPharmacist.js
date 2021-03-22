var app = new Vue({
	el: '#manageDerm',
	data: {
		derms: [],
		pharmacyId: "",
		user: null,
		changePass: false,
		changeData: false,
		oldPass: "",
		newPass: "",
		newDerms: [],
		dermId: null,
		searchPharmFirst: "",
		searchPharmLast: "",
		minGrade: "",
		maxGrade: "",
		pharmacies: [],
		filterPharmacies: [],
		filterPharmacyId: "",
		index: "",
		filteredPharms: [],
		grades: [],
		indeksi: [],
		role: null,
		allPharmacies: [],
		sendPharmaciesId: []
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
		
		newFilterPharmacy(filterPharmacyId){
			this.index = -1;
			for(let j = 0; j < this.pharmacies.length; j++){
				if(this.pharmacies[j].id == filterPharmacyId){
					this.filterPharmacies.push(this.pharmacies[j]);
					this.index = j;
				}
			}
			
			if(this.index!= -1){
				this.pharmacies.splice(this.index,1);
			}
			
		},
		
		cancelFilterPharmacy(filterPharmacyId){
			this.index = -1;
			for(let j = 0; j < this.filterPharmacies.length; j++){
				if(this.filterPharmacies[j].id == filterPharmacyId){
					this.pharmacies.push(this.filterPharmacies[j]);
					this.index = j;
				}
			}
			
			if(this.index!= -1){
				this.filterPharmacies.splice(this.index,1);
			}
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
		reset(){
			window.location.href = '/filterPharmacist.html';
		},
		search(){
			this.sendPharmaciesId = []
			console.log(this.sendPharmaciesId)
			for(let j = 0; j < this.filterPharmacies.length; j++){
					this.sendPharmaciesId.push(this.filterPharmacies[j].id);
			}
			if(this.sendPharmaciesId.length == 0){
				console.log("lsfladljl")
				for(let j = 0; j < this.allPharmacies.length; j++){
					this.sendPharmaciesId.push(this.allPharmacies[j]);
			}
			}
			axios
			.post('/api/pharmacist/searchPharms',
					{
						pharmacies:this.sendPharmaciesId,
						firstName: this.searchPharmFirst,
						lastName: this.searchPharmLast,
						minGrade: this.minGrade,
						maxGrade: this.maxGrade
					},
					{
					headers: {
					    'Authorization': "Bearer " + localStorage.getItem('access_token')
					  }
					})
			.then(response => {
				this.filteredPharms = response.data
			})
		},
	},
	created() {
		axios
        .get('/auth/getRole',{
			  headers: {
			    'Authorization': "Bearer " + localStorage.getItem('access_token')
			  }
        })
        .then(response => {
        	this.role = response.data
        	if(response.data == "ADMIN" || response.data == "PATIENT"){

        	}else{
        		window.location.href = '/login.html';
        	}
        	
        	if(this.role == "ADMIN"){
    			axios
    			.get('/api/pharmacyAdmin/getLoggedUser',{
    				  headers: {
    					    'Authorization': "Bearer " + localStorage.getItem('access_token')
    				  }
    		     })
    		     .then(response => {
    		     	this.user = response.data
    		     })
    		}else{
    			axios
    			.get('/api/patient/getLoggedUser',{
    				  headers: {
    					    'Authorization': "Bearer " + localStorage.getItem('access_token')
    				  }
    		     })
    		     .then(response => {
    		     	this.user = response.data
    		     })
    		}
        })
        .catch(function() {
        	window.location.href = '/login.html';
	    })
		
		console.log(this.role)
		
		axios
		.get('/api/pharmacy/findAll',
				{
				headers: {
				    'Authorization': "Bearer " + localStorage.getItem('access_token')
				  }
			
		})
		.then(response => {
			this.pharmacies = response.data
					for(let j = 0; j < this.pharmacies.length; j++){
						this.allPharmacies.push(this.pharmacies[j].id);
					}
					
				axios
				.post('/api/pharmacist/searchPharms',
						{
							pharmacies:this.allPharmacies,
							firstName: this.searchPharmFirst,
							lastName: this.searchPharmLast,
							minGrade: this.minGrade,
							maxGrade: this.maxGrade
						},
						{
						headers: {
						    'Authorization': "Bearer " + localStorage.getItem('access_token')
						  }
						})
				.then(response => {
					this.filteredPharms = response.data
				})
			
		})
	}
})