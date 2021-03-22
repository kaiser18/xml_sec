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
		searchDermLast: "",
		messages: []
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
	     	axios
			.get('/api/notification/findAllMessages',
					{
						params:{
							id: this.admin.id
						},
					headers: {
					    'Authorization': "Bearer " + localStorage.getItem('access_token')
					  }
				
			})
			.then(response => {
				this.messages = response.data
			})
	
	     })
	    
						
		       
	}
})