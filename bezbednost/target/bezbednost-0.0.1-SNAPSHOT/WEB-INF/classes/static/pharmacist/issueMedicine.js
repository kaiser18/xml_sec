var app = new Vue({
	el: '#pharmacist',
	data: {
		pharm: null,
		uid: "",
		reservation: null
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
		redirect(p){
			window.location.href = p;
		},
		search(){
			axios
            .get('/api/medicineReservation/findReservation',{
    			  headers: {
    			    'Authorization': "Bearer " + localStorage.getItem('access_token')
    			  },
    			  params: {
    				  uid: this.uid
    			  }
            })
            .then(response => {
            	if(!response.data){
            		this.reservation = null;
            		JSAlert.alert("Broj rezervacije nije ispravan!");
            	}
            	else{
            		this.reservation = response.data;
            	}
            })
		},
		formatDate(date){
			date = new Date(date);
			let ret = date.getDate() + "." + date.getMonth()+1 + "." + date.getFullYear() + ". " + this.getStartTime(date);
			return ret;
		},
		getStartTime(date){
        	let h = date.getHours();
        	if(h < 10)
        		h = "0" + h;
        	let m =  date.getMinutes();
        	if(m < 10)
        		m = "0" + m;
        	return h + ":" + m;
        },
        approve(){
        	axios
	     	.post('/api/medicineReservation/approveReservation',
	     	{
	     		uid: this.reservation.uid
	     	},{
	     		headers: {
	     			'Authorization': "Bearer " + localStorage.getItem('access_token')
	 	     	}
		    })
			.then(response => {
				this.reservation.approved = true
				JSAlert.alert("Uspesno!");
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
        	if(response.data != "PHARM"){
        		window.location.href = '/login.html';
        	}
        })
        .catch(function() {
        	window.location.href = '/login.html';
	    })
		axios
		.get('/api/pharmacist/getLoggedUser',{
			  headers: {
				    'Authorization': "Bearer " + localStorage.getItem('access_token')
			  }
	     })
	     .then(response => {
	     	this.pharm = response.data
	     })
	}
})