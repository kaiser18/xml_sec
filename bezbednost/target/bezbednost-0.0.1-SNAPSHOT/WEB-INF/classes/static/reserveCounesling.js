var app = new Vue({
	el: '#examinations',
	data: {
		counselings: [],
		patient: null,
		columns: [ 'id'],
		sortKey: 'id',
		reverse: 1,
		btnId: 0,
		patCounselings: [],
		//datee: new Date().toISOString().slice(0,10),
		
	},
	methods: {
    	dateChanged(){
    		//console.log(datee)
    		alert('btnClick')
    	}
	},
	created() {
		.axios
		.get('/api/patient/getLoggedUser',{
			  headers: {
				    'Authorization': "Bearer " + localStorage.getItem('access_token')
			  }
	     }).then(response => {
					this.patient = response.data
					console.log(this.patient.id)
		})
	}
})