var app = new Vue({
	el: '#page',
	data: {
		weekdays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
        days: [],
        current: new Date(),
        today: new Date(),
        counts: [],
		pharm: null,
        index: 0,
        startDate: null,
        endDate: null
	},
	methods: {
		getDaysInMonth(month, year) {
            var date = new Date(year, month, 1);
            this.index = date.getDay();
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
        dateDist(date1, date2){
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
            if(this.current.getMonth() == 0){
                this.current = new Date(this.current.getFullYear() - 1, 11, 1);}
            else
                this.current = new Date(this.current.getFullYear(), this.current.getMonth() - 1, 1);
            this.getDaysInMonth(this.current.getMonth(), this.current.getFullYear());
        },
        next(){
            if(this.current.getMonth() == 11){
                this.current = new Date(this.current.getFullYear() + 1, 0, 1);}
            else
                this.current = new Date(this.current.getFullYear(), this.current.getMonth() + 1, 1);
            this.getDaysInMonth(this.current.getMonth(), this.current.getFullYear());
        },
        reset(){
            this.current = new Date();
            this.current = new Date(this.current.getFullYear(), this.current.getMonth(), this.current.getDate());
            this.getDaysInMonth(this.current.getMonth(), this.current.getFullYear());
        },
        setCurrDate(date, ind){
            this.current = date
            this.index = ind;
        },
        getCounts(date){
        	axios
            .get('/api/examination/countAllTerms',{
    			  headers: {
    			    'Authorization': "Bearer " + localStorage.getItem('access_token')
    			  },
    			  params: {
    				  start: date.getTime(),
    				  num: 42
    			  }
            })
            .then(response => {
            	this.counts = response.data
            })
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
		submit(){
			if(!this.startDate || !this.endDate){
				JSAlert.alert("Oba polja moraju biti popunjena!");
				return;
			}
			let now = new Date();
			now = new Date(now.getFullYear(), now.getMonth(), now.getDate());
			let start = new Date(this.startDate)
			start = new Date(start.getFullYear(), start.getMonth(), start.getDate());
			let end = new Date(this.endDate)
			end = new Date(end.getFullYear(), end.getMonth(), end.getDate());
			if(end.getTime() < start.getTime()){
				JSAlert.alert("Neispravni datumi!");
				return;
			}
			if(start.getTime() < now.getTime()){
				JSAlert.alert("Datum iz proslosti...");
				return;
			}
			axios
            .get('/api/pharmHoliday/save',{
    			  headers: {
    			    'Authorization': "Bearer " + localStorage.getItem('access_token')
    			  },
    			  params: {
    				  start: start.getTime(),
    				  end: end.getTime()
    			  }
            })
            .then(response => {
            	JSAlert.alert("Zahtev za odsustvo uspesno kreiran...");
            })
            .catch(error => {
            	if(error.response.status == 400)
            		JSAlert.alert("Zahtev ne moze da se kreira za datume za koje imate preglede!");
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
        	this.pharm = response.data;
        })
	     this.current = new Date(this.current.getFullYear(), this.current.getMonth(), this.current.getDate());
		 this.today = new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate());
		 this.getDaysInMonth(this.current.getMonth(), this.current.getFullYear());
	}
})