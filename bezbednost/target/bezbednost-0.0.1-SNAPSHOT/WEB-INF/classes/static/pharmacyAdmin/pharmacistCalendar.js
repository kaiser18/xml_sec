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
        pharmWC: null,
        periods: [],
        admin: null,
        pharmId: null,
        pharm:null
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
            await this.getDaysInMonth(this.current.getMonth(), this.current.getFullYear());
            this.periods = [];
        	this.reloadData();
        },
        async next(){
            if(this.current.getMonth() == 11){
                this.current = new Date(this.current.getFullYear() + 1, 0, 1);}
            else
                this.current = new Date(this.current.getFullYear(), this.current.getMonth() + 1, 1);
            await this.getDaysInMonth(this.current.getMonth(), this.current.getFullYear());
            this.periods = [];
        	this.reloadData();
        },
        reset(){
            this.current = new Date();
            this.current = new Date(this.current.getFullYear(), this.current.getMonth(), this.current.getDate());
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
	        .post('/api/pharmWP/save',
	            {
	        		pharmacistId: this.pharmId,
	        		startDate: this.startDate.getTime(),
	        		endDate: this.endDate.getTime()
	            },
	            {
		  			  headers: {
						    'Authorization': "Bearer " + localStorage.getItem('access_token')
		  			  }
		        })
	        .then(response => {
	        	if(response.data == false){
	        		JSAlert.alert("Greska. Molimo vas pokusajte kasnije");
	        	}
	        	this.pharmWC = response.data
	        	this.periods = []
	        	this.reloadData()
	        })
        },
        reloadPeriods(){
        	for(let j = 0; j < this.days.length; j++){
        		let added = false;
	        	for(let i = 0; i < this.pharmWC.length; i++){
	        		let da = new Date(this.pharmWC[i].startDate)
	        		let da1 = new Date(this.pharmWC[i].endDate)
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
            .get('/api/pharmWP/findAllPharmWorkCalendarByPharmIdAndPeriod',{
        		headers: {
    			    'Authorization': "Bearer " + localStorage.getItem('access_token')
    		  },
    		params:{
    			pharmacistId: this.pharmId,
    			startDate: this.days[0].getTime(),
        		endDate: this.days[41].getTime()
    			}
    		})
            .then(response => {
            	this.pharmWC = response.data
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
	        .post('/api/pharmWP/deletePharmWorkCalendarByDate',
	            {
	        		pharmacistId: this.pharmId,
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
	                JSAlert.alert("Pharmacist has appointments that day. You can't change the work schedule.");
	            }   	
	            
	        })
        }
    },
    created(){
        this.current = new Date(this.current.getFullYear(), this.current.getMonth(), this.current.getDate());
        this.today = new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate());
        this.getDaysInMonth(this.current.getMonth(), this.current.getFullYear());
        this.pharmId = localStorage.getItem('pharmId');
        localStorage.removeItem('pharmId');
        axios
        .get('/api/pharmacist/pharm',{
			  headers: {
				    'Authorization': "Bearer " + localStorage.getItem('access_token')
			  },
			  params:{
				  pharmId: this.pharmId
			  }
	     })
	     .then(response => {
	     	this.pharm = response.data
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
	            .get('/api/pharmWP/findAllPharmWorkCalendarByPharmIdAndPeriod',{
	        		headers: {
	    			    'Authorization': "Bearer " + localStorage.getItem('access_token')
	    		  },
	    		params:{
	    			pharmacistId: this.pharmId,
	    			startDate: this.days[0].getTime(),
	        		endDate: this.days[41].getTime()
	    			}
	    		})
	            .then(response => {
	            	this.pharmWC = response.data
	            	this.reloadPeriods()
	            })
	        
	     })
    }
})