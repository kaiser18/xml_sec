var app = new Vue({
	el: '#workCalendar',
	data: {
        weekdays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
        days: [],
        current: new Date(),
        today: new Date(),
        calendarMode: "month",
        counselings: [],
        sun: [],
        mon: [],
        tue: [],
        wed: [],
        thu: [],
        fri: [],
        sat: [],
        counts: [],
        pharmacies: [],
        pharm: null,
        derm: null,
        nearest: null
        
	},
	methods: {
        getDaysInMonth(month, year) {
            var date = new Date(year, month, 1);
            date.setDate(date.getDate() - date.getDay());
            this.getCounts(date)
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
        getDaysInWeek(current) {
            var date = new Date(current.getFullYear(), current.getMonth(), current.getDate());
            date.setDate(date.getDate() - date.getDay());
            this.returnTerms(new Date(date.getTime()))
            var days = [];
            i = 0;
            while (i != 7) {
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
        prev(){
            if(this.calendarMode == 'week'){
                this.prevWeek();
            }
            else if(this.calendarMode == 'month'){
                this.prevMonth();
            }
            else{
                this.prevYear();
            }
        },
        prevWeek(){
            this.current.setDate(this.current.getDate() - 7);
            this.current = new Date(this.current.getFullYear(), this.current.getMonth(), this.current.getDate())
            this.getTerms(this.current)
            this.getDaysInWeek(this.current);
        },
        prevMonth(){
            if(this.current.getMonth() == 0){
                this.current = new Date(this.current.getFullYear() - 1, 11, 1);}
            else
                this.current = new Date(this.current.getFullYear(), this.current.getMonth() - 1, 1);
            this.getTerms(this.current)
            this.getDaysInMonth(this.current.getMonth(), this.current.getFullYear());
        },
        prevYear(){
            if(this.current.getMonth() == 1 && this.current.getDate == 29)
                this.current = new Date(this.current.getFullYear() - 1, this.current.getMonth(), 28);
            else
                this.current = new Date(this.current.getFullYear() - 1, this.current.getMonth(), this.current.getDate());
            this.getCountsByMonths(this.current);
            this.getTerms(this.current);
        },
        next(){
            if(this.calendarMode == 'week'){
                this.nextWeek();
            }
            else if(this.calendarMode == 'month'){
                this.nextMonth();
            }
            else{
                this.nextYear();
            }
        },
        nextWeek(){
            this.current.setDate(this.current.getDate() + 7);
            this.current = new Date(this.current.getFullYear(), this.current.getMonth(), this.current.getDate());
            this.getTerms(this.current)
            this.getDaysInWeek(this.current);
        },
        nextMonth(){
            if(this.current.getMonth() == 11){
                this.current = new Date(this.current.getFullYear() + 1, 0, 1);}
            else
                this.current = new Date(this.current.getFullYear(), this.current.getMonth() + 1, 1);
            this.getTerms(this.current)
            this.getDaysInMonth(this.current.getMonth(), this.current.getFullYear());
        },
        nextYear(){
            if(this.current.getMonth() == 1 && this.current.getDate == 29)
                this.current = new Date(this.current.getFullYear() + 1, this.current.getMonth(), 28);
            else
                this.current = new Date(this.current.getFullYear() + 1, this.current.getMonth(), this.current.getDate());
            this.getCountsByMonths(this.current);
            this.getTerms(this.current)
        },
        reset(){
            if(this.calendarMode == 'week'){
                this.resetWeek();
            }
            else if(this.calendarMode == 'month'){
                this.resetMonth();
            }
            else{
                this.resetYear();
            }
        },
        resetWeek(){
            this.current = new Date();
            this.current = new Date(this.current.getFullYear(), this.current.getMonth(), this.current.getDate());
            this.getTerms(this.current)
            this.getDaysInWeek(this.current);
        },
        resetMonth(){
            this.current = new Date();
            this.current = new Date(this.current.getFullYear(), this.current.getMonth(), this.current.getDate());
            this.getTerms(this.current)
            this.getDaysInMonth(this.current.getMonth(), this.current.getFullYear());
        },
        resetYear(){
            this.current = new Date();
            this.current = new Date(this.current.getFullYear(), this.current.getMonth(), this.current.getDate());
            this.getCountsByMonths(this.current);
            this.getTerms(this.current);
        },
        setCalendarMode(mode){
            if(mode == 'week'){
                this.getDaysInWeek(this.current)
            }
            else if(mode == 'month'){
                this.getDaysInMonth(this.current.getMonth(), this.current.getFullYear());
            }
            else{
            	this.getCountsByMonths(this.current);
            }
            this.calendarMode = mode
        },
        setCurrDate(date){
            this.current = date
            this.getTerms(this.current);
        },
        chooseMonth(index){
            this.current = new Date(this.current.getFullYear(), index, 1);
            this.getDaysInMonth(this.current.getMonth(), this.current.getFullYear());
            this.calendarMode = 'month'
        },
        getTerms(date){
        	axios
            .get('/api/counseling/findAllTermsByDay',{
    			  headers: {
    			    'Authorization': "Bearer " + localStorage.getItem('access_token')
    			  },
    			  params: {
    				  pharmacyId: this.pharm,
    				  start: date.getTime()
    			  }
            })
            .then(response => {
            	this.counselings = response.data
            })
        },
        returnTerms(date){
        	for(let index = 0; index < 7; index++){
	        	axios
	            .get('/api/counseling/findAllTermsByDay',{
	    			  headers: {
	    			    'Authorization': "Bearer " + localStorage.getItem('access_token')
	    			  },
	    			  params: {
	    				  pharmacyId: this.pharm,
	    				  start: date.getTime()
	    			  }
	            })
	            .then(response => {
	            	if(index == 0)
	            		this.sun = response.data;
	            	else if(index == 1)
	            		this.mon = response.data;
	            	else if(index == 2)
	            		this.tue = response.data;
	            	else if(index == 3)
	            		this.wed = response.data;
	            	else if(index == 4)
	            		this.thu = response.data;
	            	else if(index == 5)
	            		this.fri = response.data;
	            	else if(index == 6)
	            		this.sat = response.data;
	            })
	            date.setDate(date.getDate() + 1);
        	}
        },
        getStartTime(date){
        	date = new Date(date)
        	let h = date.getHours();
        	if(h < 10)
        		h = "0" + h;
        	let m =  date.getMinutes();
        	if(m < 10)
        		m = "0" + m;
        	return h + ":" + m;
        },
        getCounts(date){
        	axios
            .get('/api/counseling/countTerms',{
    			  headers: {
    			    'Authorization': "Bearer " + localStorage.getItem('access_token')
    			  },
    			  params: {
    				  pharmacyId: this.pharm,
    				  start: date.getTime(),
    				  num: 42
    			  }
            })
            .then(response => {
            	this.counts = response.data
            })
        },
        getCountsByMonths(date){
        	axios
            .get('/api/counseling/countTermsByMonths',{
    			  headers: {
    			    'Authorization': "Bearer " + localStorage.getItem('access_token')
    			  },
    			  params: {
    				  pharmacyId: this.pharm,
    				  start: date.getTime()
    			  }
            })
            .then(response => {
            	this.counts = response.data
            })
        },
        pharmChanged(){
        	this.getTerms(this.current);
        	if(this.calendarMode == 'week'){
                this.getDaysInWeek(this.current);
            }
            else if(this.calendarMode == 'month'){
                this.getDaysInMonth(this.current.getMonth(), this.current.getFullYear());
            }
            else{
                this.getCountsByMonths(this.current);
            }
        },
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
		sumY(){
			let ret = 0;
			for(let i = 0; i < this.counts.length; i++){
				ret += this.counts[i];
			}
			return ret;
		},
		redirect(p){
			window.location.href = p;
		}

    },
    created(){
    	axios
        .get('/auth/getRole',{
			  headers: {
			    'Authorization': "Bearer " + localStorage.getItem('access_token')
			  }
        })
        .then(response => {
        	if(response.data != "DERM"){
        		window.location.href = '/login.html';
        	}
        })
        .catch(function() {
        	window.location.href = '/login.html';
	    })
    	axios
		.get('/api/counseling/getNearestCounseling',{
			headers: {
			 'Authorization': "Bearer " + localStorage.getItem('access_token')
			},
			params:{
				start: (new Date).getTime(),
				finished: true
			}
	     })
	     .then(response => {
	    	 this.nearest = response.data
	    	 axios
	         .get('/api/dermatologist/getDermPharmacies',{
	 			  headers: {
	 			    'Authorization': "Bearer " + localStorage.getItem('access_token')
	 			  }
	         })
	         .then(response => {
	         	this.pharmacies = response.data
	         	this.pharm = this.pharmacies[0].id
	         	if(this.nearest){
	         		for(let ind = 0; ind < this.pharmacies.length; ind++){
	         			if(this.pharmacies[ind].name == this.nearest.pharmacyName){
	         				this.pharm = this.pharmacies[ind].id
	         				break;
	         			}
	         		}
	         	}
	         	axios
	     		.get('/api/dermatologist/getLoggedUser',{
	     			  headers: {
	     				    'Authorization': "Bearer " + localStorage.getItem('access_token')
	     			  }
	     	     })
	     	     .then(response => {
	     	     	this.derm = response.data
	     	        this.current = new Date(this.current.getFullYear(), this.current.getMonth(), this.current.getDate());
	     	        this.today = new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate());
	     	        this.getTerms(this.today);
	     	        this.getDaysInMonth(this.current.getMonth(), this.current.getFullYear());
	     	     })
	         })
	    	 
	     })
    }
})