var app = new Vue({
	el: '#manageDerm',
	data: {
		orders: [],
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
		orderedMed: [],
		requests: [],
		start: null,
		end: null
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
		showMedicine(medicines){
			this.orderedMed = medicines;
			console.log(this.orderedMed)
			if(this.changePass == true){
				this.changePass = false;				
			}
			else
				this.changePass = true;
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
		
		reject(r){
			JSAlert.confirm("Are you sure that you want to reject this request?").then(function(result) {
     		    if (!result)
     		        return;

					axios
					.get('/api/dermHoliday/reject',
							{
								params:{
									holidayId: r.holidayId
								},
							headers: {
							    'Authorization': "Bearer " + localStorage.getItem('access_token')
							  }
						
					})
					.then(response => {
						if(response.data == true){
							window.location.href = '/systemAdmin/dermatologistHoliday.html';
						}
					})
			
			});
		},
		approve(r){
			this.start = r.start,
			this.end = r.end
			JSAlert.confirm("Are you sure that you want to approve this request?").then(function(result) {
     		    if (!result)
     		        return;
					axios
					.get('/api/dermHoliday/approve',
							{
								params:{
									holidayId: r.holidayId,
									dermId: r.dermId,
									start: new Date(r.start).getTime(),
									end: new Date(r.end).getTime()
								},
							headers: {
							    'Authorization': "Bearer " + localStorage.getItem('access_token')
							  }
						
					})
					.then(response => {
						if(response.data == true){
							window.location.href ='/systemAdmin/dermatologistHoliday.html';
						}
					}).catch(error => {
			            if (error.response.status == 401 || error.response.status == 400 || error.response.status == 500) {
			                JSAlert.alert("Dermatologist has appointments. Holiday can't be approved.");
			            }		            
			        })
					
			
			});
		},
		formatDate(d){
			let date = new Date(d)
			return (date.getDate()) + "." + (date.getMonth() + 1) + "." + date.getFullYear() + ".";
		},
		calc(d){
			let date = new Date(d);
			let now = new Date();
			if(now.getTime() > date.getTime()){
				return false;
			}
			return true;
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
        	if(response.data != "SYS_ADMIN"){
        		window.location.href = '/login.html';
        	}
        })
        .catch(function() {
        	window.location.href = '/login.html';
	    })

	     
		    	 axios
					.get('/api/dermHoliday/findAll',
							{
							headers: {
							    'Authorization': "Bearer " + localStorage.getItem('access_token')
							  }
						
					})
					.then(response => {
						this.requests = response.data
	
					})
		       
	}
})