var app = new Vue({
	el: '#promotion',
	data: {
		title: "",
		startOfPromotion: null,
		endOfPromotion: null,
		content: "",
		admin: null,
		pharmacyId: null
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
		submit: function (){
			console.log(new Date());
			
			if((this.startOfPromotion > this.endOfPromotion) || this.startOfPromotion < new Date() || this.endOfPromotion <= new Date){
				JSAlert.alert("Publishing is incorrect! Start date is is after end date.");
			}else{
			axios
			.get('/api/pharmacyAdmin/getPharmacy',{
				  headers: {
					    'Authorization': "Bearer " + localStorage.getItem('access_token')
			            }
		     })
		     .then(response => {
		     	this.pharmacyId = response.data
		     	axios
		        .post('/api/promotion/save',
		        	
		        	{
		                title: this.title,
		                startOfPromotion: this.startOfPromotion,
		                endOfPromotion: this.endOfPromotion,
		                content: this.content,
		                pharmacyId: this.pharmacyId
		            },{
		        	
		    		headers: {
						'Authorization': "Bearer " + localStorage.getItem('access_token'),
					    "Content-Type": "application/json"
					  }
					  
		        })
		        .then(response => {
	        		JSAlert.alert("You have successfully published a new promotion!");
	        		setTimeout(function () {
						if (window.location.hash != '#r') {
							window.location.hash = 'r';
							window.location.reload(1);
						}
					}, 3000);
		            
		        })
		        .catch(error => {
		            if (error.response.status == 401 || error.response.status == 400 || error.response.status == 500) {
		                JSAlert.alert(error.response.data.errors[0].defaultMessage);
		            }		            
		        })
		     })
			}
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
	}
})