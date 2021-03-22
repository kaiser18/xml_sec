var app = new Vue({
	el: '#patientList',
	data: {
		patients: [],
		searchPharmFirst: "",
		searchPharmLast: "",
		role: "",
		user: null,
		patientId: null
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
		search(){
			axios
			.get('/api/patient/findAllByName',
					{
						params:{
							firstName: this.searchPharmFirst,
							lastName: this.searchPharmLast
						},
					headers: {
					    'Authorization': "Bearer " + localStorage.getItem('access_token')
					  }
				
			})
			.then(response => {
				this.patients = response.data
			})
		},
		redirect(){
			if(this.role == "DERM")
				window.location.href = "/dermatologist/dermatologistReport.html";
			else if(this.role == "PHARM")
				window.location.href = "/pharmacist/pharmacistReport.html";
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
    		     	this.user = response.data
    		     })
    		     axios
    			.get('/api/counseling/getPatientForNearestCounseling',{
    				params:{
    					start: (new Date).getTime(),
    					finished: true
					},
    				  headers: {
    					    'Authorization': "Bearer " + localStorage.getItem('access_token')
    				  }
    		     })
    		     .then(response => {
    		     	this.patientId = response.data
    		     })
    		     axios
    			 .get('/api/dermatologist/findAllExaminedPatients',{
    				  headers: {
    					    'Authorization': "Bearer " + localStorage.getItem('access_token')
    				  }
    		     })
    		     .then(response => {
    		    	 this.patients = response.data
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
    		     	this.user = response.data
    		     })
    		     axios
    			.get('/api/examination/getPatientForNearestExamination',{
    				params:{
    					start: (new Date).getTime(),
    					finished: true
					},
    				  headers: {
    					    'Authorization': "Bearer " + localStorage.getItem('access_token')
    				  }
    		     })
    		     .then(response => {
    		     	this.patientId = response.data
    		     })
    		     axios
    			.get('/api/pharmacist/findAllExaminedPatients',{
    				  headers: {
    					    'Authorization': "Bearer " + localStorage.getItem('access_token')
    				  }
    		     })
    		     .then(response => {
    		    	 this.patients = response.data
    		     })
    		}
        })
        .catch(function() {
        	window.location.href = '/login.html';
	    })
	}
})