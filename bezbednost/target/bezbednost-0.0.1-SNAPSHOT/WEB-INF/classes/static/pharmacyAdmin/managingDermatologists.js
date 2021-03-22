var app = new Vue({
	el: '#manageDerm',
	data: {
		derms: [],
		pharmacyId: "",
		admin: null,
		changePass: false,
		changeData: false,
		oldPass: "",
		newPass: "",
		newDerms: [],
		dermId: null,
		searchDermFirst: "",
		searchDermLast: ""
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
		
		newDerm(dermId){
			window.localStorage.setItem('dermId', dermId);
			axios
	        .post('/api/dermatologist/hire',
	        	
	        	{
	        		dermId: window.localStorage.getItem('dermId')
	            },{
	        	
	    		headers: {
					'Authorization': "Bearer " + localStorage.getItem('access_token'),
				    "Content-Type": "application/json"
				  }
				  
	        })
	        .then(response => {
	            
	        })
		},
		
		fireDerm(dermId){
			window.localStorage.setItem('dermId', dermId);
			this.dermId = window.localStorage.getItem('dermId');
			axios
	        .delete('/api/dermatologist/fire/' + dermId,{

	    		headers: {
					'Authorization': "Bearer " + localStorage.getItem('access_token'),
				    "Content-Type": "application/json"
				  }
				  
	        })
	        .then(response => {
	        	window.location.href = '/pharmacyAdmin/managingDermatologists.html';
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
		
		search(){
			axios
			.get('/api/pharmacy/searchDermsInPharmacy',
					{
						params:{
							id: this.pharmacyId,
							firstName: this.searchDermFirst,
							lastName: this.searchDermLast
						},
					headers: {
					    'Authorization': "Bearer " + localStorage.getItem('access_token')
					  }
				
			})
			.then(response => {
				this.derms = response.data
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
					.get('/api/pharmacy/findAllDermsInPharmacy',
							{
								params:{
									id: this.pharmacyId
								},
							headers: {
							    'Authorization': "Bearer " + localStorage.getItem('access_token')
							  }
						
					})
					.then(response => {
						this.derms = response.data
						axios
						.get('/api/pharmacy/findAllDermsNotInPharmacy',
								{
									params:{
										id: this.pharmacyId
									},
								headers: {
								    'Authorization': "Bearer " + localStorage.getItem('access_token')
								  }
							
						})
						.then(response => {
							this.newDerms = response.data
						})
					})
		     })	    
	}
})