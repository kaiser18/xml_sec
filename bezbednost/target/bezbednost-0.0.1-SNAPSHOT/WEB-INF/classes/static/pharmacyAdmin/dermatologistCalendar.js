var app = new Vue({
	el: '#dermatologist',
	data: {
        weekdays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
        days: [],
        current: new Date(),
        today: new Date(),
        startTime: null,
        endTime: null,
        startDate: null,
        endDate: null,
        dermWC: null,
        periods: [],
        admin: null,
        dermId: null,
        derm:null,
        addNewTerm: false,
        counselings: [],
        examPrice: null,
        examTime: null,
        examDuration: null
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
        getDaysInMonth(month, year) {
            var date = new Date(year, month, 1);
            date.setDate(date.getDate() - date.getDay());
            var days = [];
            i = 0;
            while (i != 42) {
                days.push(new Date(date));
                date.setDate(date.getDate() + 1);
                i++;
            }
            this.days = days
            return days;
        },
        dateDistance(date1, date2){
            let d = " day"
            let distance = Math.round((date1-date2)/(1000*60*60*24))
            if(distance > 1 || distance < -1)
                d = " days"
            if(distance == 0)
                return "Today";
            else if(distance > 0)
                return "in " + distance.toString() + d;
            else{
                distance = -distance;
                return distance.toString() + d + " ago";
            }
        },
        nth(d) {
            if (d > 3 && d < 21) return 'th';
            switch (d % 10) {
              case 1:  return "st";
              case 2:  return "nd";
              case 3:  return "rd";
              default: return "th";
            }
        },
        async prev(){
            if(this.current.getMonth() == 0){
                this.current = new Date(this.current.getFullYear() - 1, 11, 1);}
            else
                this.current = new Date(this.current.getFullYear(), this.current.getMonth() - 1, 1);
            this.getTerms(this.current)
            await this.getDaysInMonth(this.current.getMonth(), this.current.getFullYear());
            this.periods = [];
        	this.reloadData();
        },
        async next(){
            if(this.current.getMonth() == 11){
                this.current = new Date(this.current.getFullYear() + 1, 0, 1);}
            else
                this.current = new Date(this.current.getFullYear(), this.current.getMonth() + 1, 1);
            this.getTerms(this.current)
            await this.getDaysInMonth(this.current.getMonth(), this.current.getFullYear());
            this.periods = [];
        	this.reloadData();
        },
        reset(){
            this.current = new Date();
            this.current = new Date(this.current.getFullYear(), this.current.getMonth(), this.current.getDate());
            this.getTerms(this.current)
            this.getDaysInMonth(this.current.getMonth(), this.current.getFullYear());
        },
        setCurrDate(date){
        	if((date.getFullYear()*12 + date.getMonth()) > (this.days[20].getFullYear()*12 + this.days[20].getMonth())){
        		this.next();
        	}
        	else if((date.getFullYear()*12 +date.getMonth()) < (this.days[20].getFullYear()*12 +this.days[20].getMonth())){
        		this.prev();
        	}
            this.current = date
            this.getTerms(this.current)
        },
        addNew(){
        	let hours = parseInt(this.startTime.split(":")[0]);
		    let minutes = parseInt(this.startTime.split(":")[1]);
		    this.startDate = new Date(this.current.getFullYear(), this.current.getMonth(), this.current.getDate(), hours, minutes, 0);
		    let hours1 = parseInt(this.endTime.split(":")[0]);
		    let minutes1 = parseInt(this.endTime.split(":")[1]);
		    this.endDate = new Date(this.current.getFullYear(), this.current.getMonth(), this.current.getDate(), hours1, minutes1, 0);
		    if((hours*60 + minutes) >= (hours1*60 + minutes1)){
		    	this.endDate = this.endDate.setDate(this.endDate.getDate() + 1);
		    }
		    this.endDate = new Date(this.endDate)
		    console.log(this.startDate)
        	axios
	        .post('/api/dermWP/save',
	            {
	        		dermatologistId: this.dermId,
	        		startDate: this.startDate.getTime(),
	        		endDate: this.endDate.getTime()
	            },
	            {
		  			  headers: {
						    'Authorization': "Bearer " + localStorage.getItem('access_token')
		  			  }
		        })
	        .then(response => {
	        	console.log(response.data)
	        	if(response.data == false){
	        		JSAlert.alert("Dermatologist is unavailable in that period.");
	        	}
	        	this.dermWC = response.data
	        	this.periods = []
	        	this.reloadData()
	        })
        },
        reloadPeriods(){
        	for(let j = 0; j < this.days.length; j++){
        		let added = false;
	        	for(let i = 0; i < this.dermWC.length; i++){
	        		let da = new Date(this.dermWC[i].startDate)
	        		let da1 = new Date(this.dermWC[i].endDate)
	        		if(da.getFullYear() == this.days[j].getFullYear() && da.getMonth() == this.days[j].getMonth() && da.getDate() == this.days[j].getDate()){
	        			let startHour = ""
	        			if(da.getHours() < 10)
	        				startHour = "0" + da.getHours();
	        			else
	        				startHour = da.getHours();
	        			let startMin = ""
		        			if(da.getMinutes() < 10)
		        				startMin = "0" + da.getMinutes();
		        			else
		        				startMin = da.getMinutes();
	        			let endHour = ""
		        			if(da1.getHours() < 10)
		        				endHour = "0" + da1.getHours();
		        			else
		        				endHour = da1.getHours();
		        		let endMin = ""
			        		if(da1.getMinutes() < 10)
			        			endMin = "0" + da1.getMinutes();
			        		else
			        			endMin = da1.getMinutes();
	        			this.periods.push(startHour + ":" + startMin + "-" + endHour + ":" + endMin);
	        			added = true;
	        			break;
	        		}
	        	}
	        	if(added == false)
	        		this.periods.push("")
        	}
        },
        reloadData(){
        	axios
            .get('/api/dermWP/findAllDermWorkCalendarByDermIdAndPeriod',{
        		headers: {
    			    'Authorization': "Bearer " + localStorage.getItem('access_token')
    		  },
    		params:{
    			dermatologistId: this.dermId,
    			startDate: this.days[0].getTime(),
        		endDate: this.days[41].getTime()
    			}
    		})
            .then(response => {
            	this.dermWC = response.data
            	this.reloadPeriods()
            })
        },
        getWorkingPeriod(index){
        	let period = this.periods[index];
        	if(period == "")
        		return null
        	return period
        },
        getWorkingPeriodByDate(date){
        	let ind = 0;
        	for(let j = 0; j < this.days.length; j++){
        		if(date.getFullYear() == this.days[j].getFullYear() && date.getMonth() == this.days[j].getMonth() && date.getDate() == this.days[j].getDate()){
        			ind = j;
        			break;
        		}
        	}
        	return this.getWorkingPeriod(ind);
        },
        deleteWP(current){
        	axios
	        .post('/api/dermWP/deleteDermWorkCalendarByDate',
	            {
	        		dermatologistId: this.dermId,
	        		startDate: current.getTime()
	            },
	            {
		  			  headers: {
						    'Authorization': "Bearer " + localStorage.getItem('access_token')
		  			  }
		        })
	        .then(response => {
	        	this.periods = []
	        	this.reloadData();
	        }) .catch(error => {
	            console.log(error)
	            if (error.response.status == 401 || error.response.status == 400 || error.response.status == 500) {
	                JSAlert.alert("Dermatologist has appointments that day. You can't change the work schedule.");
	            }   	
	            
	        })
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
        addExam(){
        	if(!this.examTime || !this.examDuration){
        		JSAlert.alert("Nisu dozvoljena prazna polja!");
        		return;
        	}
        	let parts = this.examTime.split(':');
        	var d = new Date(this.current.getFullYear(),this.current.getMonth(),this.current.getDate(),parseInt(parts[0]),parseInt(parts[1]),0);
            axios
	 	    .post('/api/counseling/scheduleCounseling',
	 	    		{
	 	     			start: d.getTime(),
	 	     		  	duration: this.examDuration,
	 	     		  	price: this.examPrice,
	 	     		  	dermId: this.dermId
		     		},{
		     			 headers: {
		     			 'Authorization': "Bearer " + localStorage.getItem('access_token')
		 	     	}
			 })
			 .then(response => {
				 if(response.data == -1)
			    		JSAlert.alert("Lekar ne radi u ovom terminu u ovoj apoteci!");
			    	else if(response.data == -2){
			    		JSAlert.alert("Ima vec termin!");
			    	}
			    	else if(response.data == -3){
			    		this.getTerms(this.current);
			    		JSAlert.alert("Greska, molimo pokusajte kasnije!");
			    		this.addNewTerm = false;
			    	}
			    	else if(response.data == 1){
			    		this.getTerms(this.current);
			    		JSAlert.alert("Uspesno!");
			    		this.addNewTerm = false;
			    	}
			    	else{
			    		JSAlert.alert("Neuspesno!");
			    	}
			})
        	
        },
        getTerms(date){
        	axios
            .get('/api/counseling/findAllTerms',{
    			  headers: {
    			    'Authorization': "Bearer " + localStorage.getItem('access_token')
    			  },
    			  params: {
    				  dermatologistId: this.dermId,
    				  start: date.getTime()
    			  }
            })
            .then(response => {
            	this.counselings = response.data
            })
        }
    },
    created(){
        this.current = new Date(this.current.getFullYear(), this.current.getMonth(), this.current.getDate());
        this.today = new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate());
        this.getDaysInMonth(this.current.getMonth(), this.current.getFullYear());
        this.dermId = localStorage.getItem('dermId');
        this.getTerms(this.today);
        //localStorage.removeItem('dermId');
        axios
        .get('/api/dermatologist/derm',{
			  headers: {
				    'Authorization': "Bearer " + localStorage.getItem('access_token')
			  },
			  params:{
				  dermId: this.dermId
			  }
	     })
	     .then(response => {
	     	this.derm = response.data
	     })
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
	            .get('/api/dermWP/findAllDermWorkCalendarByDermIdAndPeriod',{
	        		headers: {
	    			    'Authorization': "Bearer " + localStorage.getItem('access_token')
	    		  },
	    		params:{
	    			dermatologistId: this.dermId,
	    			startDate: this.days[0].getTime(),
	        		endDate: this.days[41].getTime()
	    			}
	    		})
	            .then(response => {
	            	this.dermWC = response.data
	            	this.reloadPeriods()
	            })
	        
	     })
    }
})