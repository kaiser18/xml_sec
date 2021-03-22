var app = new Vue({
	el: '#examinations',
	data: {
		counselings: [],
		patient: null,
		columns: ['name', 'address', 'grade', 'counselingprice'],
		columns2: ['firstName', 'lastName', 'grade'],
		sortKey: 'id',
		reverse: 1,
		btnId: 0,
		patCounselings: [],
		datee: new Date().toISOString().slice(0,14),
		pharmacists: [],
		
	},
	methods: {
		sortBy(sortKey) {
      		this.reverse = -this.reverse;
      		this.rev = !this.rev;
      		this.sortKey = sortKey;
      		console.log(this.reverse)
      		console.log(this.sortKey)
    	},
    	dateChanged(){
    		console.log(this.datee)
    				axios
						.get('/api/examination/findAllPharmsByDate',{
							  headers: {
								    'Authorization': "Bearer " + localStorage.getItem('access_token')
							  },
							  params: {
							  	date: this.datee,
							  }
							  
					     }).then(response => {
									this.counselings = response.data
									console.log('BBBB' + response.data)
						})
    	},
    	btnClick(btnId){
    		axios
						.get('/api/examination/getAvailablePharmacistsByPharmIdAndDate',{
							  headers: {
								    'Authorization': "Bearer " + localStorage.getItem('access_token')
							  },
							  params: {
							  	pharmId: btnId,
							  	date: this.datee,
							  }
							  
					     }).then(response => {
									this.pharmacists = response.data
									console.log('farmaceuti' + response.data)
						})
    	},
    	btnClick2(btnId2){
    		axios
						.get('/api/examination/scheduleExaminationPatient',{
							  headers: {
								    'Authorization': "Bearer " + localStorage.getItem('access_token')
							  },
							  params: {
							  	date: this.datee,
								duration: 1,
								pharmacistId: btnId2,
							  }
							  
					     }).then(response => {
									if(response.data == 1)
										alert('Uspesno zakazan pregled')
									else
										alert('Neuspesno zakazan pregled, farmaceut nije slobodan u datom trenutku')
						})
    	}
	},
	created() {
		axios
		.get('/api/patient/getLoggedUser',{
			  headers: {
				    'Authorization': "Bearer " + localStorage.getItem('access_token')
			  }
	     }).then(response => {
					this.patient = response.data
					
					/*axios
						.get('/api/examination/findAllPharmsByDate',{
							  headers: {
								    'Authorization': "Bearer " + localStorage.getItem('access_token')
							  },
							  params: {
							  	date: this.datee,
							  }
							  
					     }).then(response => {
									this.counselings = response.data
									console.log('AAAA' + response.data)
						})*/
		})
	}
})