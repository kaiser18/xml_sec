var app = new Vue({
	el: '#page',
	data: {
		weekdays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
        days: [],
        current: new Date(),
        today: new Date(),
        counselings: [],
        counts: [],
        currentStep: "START",
		derm: null,
        examination: null,
        monthNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
        report: "",
        medicines: null,
        buff: null,
        drugInfo: false,
        selectedDrug: null,
        sname: "",
        showSubs: false,
        subDrug: null,
        therapies: [],
        showTherapies: false,
        canStart: false,
        currentExam: null,
        waitingTime: "",
        pharmId: null,
        schedule: false,
        addNewTerm: false,
        examTime: "",
        examDuration: null,
        wp: "/"
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
            this.getTerms(this.current)
            this.getDaysInMonth(this.current.getMonth(), this.current.getFullYear());
        },
        next(){
            if(this.current.getMonth() == 11){
                this.current = new Date(this.current.getFullYear() + 1, 0, 1);}
            else
                this.current = new Date(this.current.getFullYear(), this.current.getMonth() + 1, 1);
            this.getTerms(this.current)
            this.getDaysInMonth(this.current.getMonth(), this.current.getFullYear());
        },
        reset(){
            this.current = new Date();
            this.current = new Date(this.current.getFullYear(), this.current.getMonth(), this.current.getDate());
            this.getTerms(this.current)
            this.getDaysInMonth(this.current.getMonth(), this.current.getFullYear());
        },
        setCurrDate(date){
            this.current = date
            this.getTerms(this.current);
            this.getWorkingPeriod(this.current);
        },
        getTerms(date){
        	axios
            .get('/api/examination/findAllTermsByDay',{
    			  headers: {
    			    'Authorization': "Bearer " + localStorage.getItem('access_token')
    			  },
    			  params: {
    				  start: date.getTime()
    			  }
            })
            .then(response => {
            	this.counselings = response.data
            })
        },
        getWorkingPeriod(date){
        	axios
            .get('/api/pharmWP/findPharmWorkCalendarByPharmIdAndDate',{
    			  headers: {
    			    'Authorization': "Bearer " + localStorage.getItem('access_token')
    			  },
    			  params: {
    				  start: date.getTime()
    			  }
            })
            .then(response => {
            	if(response.data == []){
            		this.wp = "/"
            	}
            	else{
	            	this.wpStart = response.data.startDate;
	            	this.wpEnd = response.data.endDate;
	            	this.wpStart = new Date(this.wpStart);
	            	this.wpEnd = new Date(this.wpEnd);
	            	let wpS = this.getStartTime(this.wpStart);
	            	let wpE = this.getStartTime(this.wpEnd);
	            	this.wp = wpS + " - " + wpE;
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
        getCounts(date){
        	axios
            .get('/api/examination/countTerms',{
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
        formatDate(date){
        	return this.monthNames[date.getMonth()] + " " + date.getDate() + " " + date.getFullYear() + ", " + date.toLocaleTimeString('it-IT');
        },
        startButton(){
        	if(this.schedule){
        		this.currentStep = "SCHEDULE"
        	}
        	else{
        		this.currentStep = 'REPORT'
        	}
        },
        goLeft(){
        	if(this.schedule){
        		this.currentStep = "START";
        	}
        	else{
        		if(this.currentStep == "REPORT")
            		this.currentStep = "START";
            	else if(this.currentStep == "PRESCRIPT")
            		this.currentStep = "REPORT";
            	else if(this.currentStep == "SCHEDULE")
            		this.currentStep = "PRESCRIPT";
        	}
        },
        goRight(){
        	if(this.currentStep == "START")
        		this.currentStep = "REPORT";
        	else if(this.currentStep == "REPORT")
        		this.currentStep = "PRESCRIPT";
        	else if(this.currentStep == "PRESCRIPT")
        		this.currentStep = "SCHEDULE";
        },
        selectDrug(drug){
        	this.selectedDrug = drug;
        	this.drugInfo = true;
        },
        prescribeDrug(d){
        	this.selectedDrug = d;
        	axios
    		.get('/api/medicine/isPatientAllergic',{
    			headers: {
    			 'Authorization': "Bearer " + localStorage.getItem('access_token')
    			},
    			params:{
    				medicineId: d.id,
    				counselingId: this.examination.id
    			}
    	     })
    	     .then(response => {
    	    	 let th = this
    	     	if(response.data == true){
    	     		JSAlert.confirm("Pacijent je alergican na ovaj lek, prikazi zamene?").then(function(result) {
    	     		    if (!result)
    	     		        return;
    	     		   th.subDrug = d
    	     		   th.getSubstitutes(d);
    	     		});
    	     		
    	     	}
    	     	else if(response.data == false){
    	     		this.isMedicineAvailable();
    	     	} 	
    	     	else
    	     		JSAlert.alert("Greska!");
    	     })
        },
        getSubstitutes(d){
        	this.selectedDrug = d;
        	axios
    		.get('/api/medicine/getSubstitutesOfMedicine',{
    			headers: {
    			 'Authorization': "Bearer " + localStorage.getItem('access_token')
    			},
    			params:{
    				id: d.id,
    			}
    	     })
    	     .then(response => {
    	    	 if(this.showSubs == false)
    	    		 this.buff = this.medicines;
    	    	 this.medicines = response.data;
    	    	 this.showSubs = true;
    	     })
        },
        search(){
        	axios
    		.get('/api/medicine/searchMedicinesByName',{
    			headers: {
    			 'Authorization': "Bearer " + localStorage.getItem('access_token')
    			},
    			params:{
    				name: this.sname,
    			}
    	     })
    	     .then(response => {
    	     	this.medicines = response.data
    	     })
        },
        goBack(){
        	this.showSubs = false;
    	    this.medicines = this.buff;
        },
        isMedicineAvailable(){
        	axios
    		.get('/api/medicine/isMedicineAvailableInPharmacy',{
    			headers: {
    			 'Authorization': "Bearer " + localStorage.getItem('access_token')
    			},
    			params:{
    				medicineId: this.selectedDrug.id,
    				counselingId: this.examination.id 
    			}
    	     })
    	     .then(response => {
    	    	 let th = this;
    	    	 if(response.data == false){
    	    		 axios
		 	     	  .post('/api/notification/noMedicineInStock',
		 	     			 {
		 	     		  		date: (new Date()).getTime(),
		 	     		  		pharmacyId: th.pharmId,
		 	     		  		message: "Lek " + th.selectedDrug.name + " (id: " + th.selectedDrug.id + ") vise nije dostupan!"
			     			  },{
			     				 headers: {
			     					 'Authorization': "Bearer " + localStorage.getItem('access_token')
			 	     			 }
				    	   })
    	    		 JSAlert.confirm("Lek nije dostupan u apoteci, prikazi zamene?").then(function(av) {
     	     		    if (!av)
     	     		        return;
     	     		   th.subDrug = th.selectedDrug
     	     		   th.getSubstitutes(th.selectedDrug);
     	     		   return;
     	     		});
    	    	 }
    	    	 else{
    	    		 JSAlert.prompt("Unesite trajanje terapije u danima?").then(function(result) {
	 	     		    if (!result)
	 	     		        return;
	 	     		  if(isNaN(parseInt(result))){
	 	     			JSAlert.alert("Neispravan unos!");
	 	     			return;
	 	     		  }
		 	     	  axios
		 	     	  .post('/api/therapy/save',
		 	     			  {
		 	     			  	duration: parseInt(result),
		 	     			  	medicineId: th.selectedDrug.id,
				    			counselingId: th.examination.id 
			     			  },{
			     				 headers: {
			     					 'Authorization': "Bearer " + localStorage.getItem('access_token')
			 	     			 }
				    	   })
					    .then(response => {
					    	     	th.therapies.push(response.data)
					    })
	 	     		});
    	    	 }
    	     })
        },
        changeShowTherapiesStatus(){
        	if(this.showTherapies == false)
        		this.showTherapies = true;
        	else
        		this.showTherapies = false;
        },
        calc(){
        	let now = new Date();
        	let endOfExam = new Date(this.examination.startDate.getTime() + 60000*this.examination.duration);
        	if(this.examination.startDate <= now && now <= endOfExam)
        		this.canStart = true;
        	else{
        		this.dateDistance(now, this.examination.startDate)
        		setTimeout(this.calc, 60000);
        	}
        	
        },
        dateDistance(date1, date2){
        	let ret = ""
        	let diffTime = Math.abs(date2 - date1);
        	let diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        	let diffHrs = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        	let diffMins = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));
        	if(diffDays == 1)
        		ret = diffDays + " day ";
        	else if(diffDays > 1)
            	ret = diffDays + " days ";
        	
        	if(diffDays == 0 && diffHrs == 0){}
        	else if(diffHrs <= 1)
        		ret += diffHrs + " hour ";
        	else if(diffHrs > 1)
            	ret += diffHrs + " hours ";
        	if(diffDays == 0 && diffHrs == 0 && diffMins < 1)
        		ret = "less than one minute";
        	else
        		ret += diffMins + " min ";
        	this.waitingTime = ret;
        },
        checkTime(date){
        	if((new Date(date)).getTime() < (new Date()).getTime())
	        	return false;
        	return true;
        },
        finish(){
        	if(this.schedule){
        		window.location.href = "/pharmacist/pharmacistHome.html";
        		return;
        	}
        	let obj = this;
        	JSAlert.confirm("Da li zelite da zavrsite pregled?")
        	.then(function(result) {
     		    if (!result)
     		        return;
     		   axios
               .post('/api/examination/setReport',
               		{
            	   		examinationId: obj.examination.id,
               			report: obj.report,
                       },
                       {
                   	  headers: {
                   	  'Authorization': "Bearer " + localStorage.getItem('access_token')
                   	}
                })
                .then(response =>{
                	window.location.href = "/pharmacist/pharmacistHome.html";
                })
                .catch(error => {
                	if(error.response.status == 400)
                		JSAlert.alert("Nije popunjen izvestaj, pregled ne moze biti zavrsen!");
                })
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
        addExam(){
        	if(!this.examTime || !this.examDuration){
        		JSAlert.alert("Nisu dozvoljena prazna polja!");
        		return;
        	}
        	let parts = this.examTime.split(':');
        	var d = new Date(this.current.getFullYear(),this.current.getMonth(),this.current.getDate(),parseInt(parts[0]),parseInt(parts[1]),0);
        	if(this.wpStart == null || this.wpEnd == null){
        		JSAlert.alert("Lekar ne radi u ovom terminu u ovoj apoteci!");
        		return;
        	}
        	else if(d < this.wpStart || d > this.wpEnd){
        		console.log(this.wpStart)
        		console.log(this.wpEnd)
        		JSAlert.alert("Lekar ne radi u ovom terminu u ovoj apoteci!");
        		return;
        	}
            	axios
	 	     	  .post('/api/examination/scheduleExamination',
	 	     			  {
	 	     		  		start: d.getTime(),
	 	     		  		duration: this.examDuration,
	 	     		  		currExaminationId: this.examination.id 
		     			  },{
		     				 headers: {
		     					 'Authorization': "Bearer " + localStorage.getItem('access_token')
		 	     			 }
			    	   })
				    .then(response => {
				    	if(response.data == -1)
				    		JSAlert.alert("Pacijent je zauzet u ovom terminu!");
				    	else if(response.data == -2){
				    		JSAlert.alert("Lekar ne radi u ovom terminu u ovoj apoteci!");
				    	}
				    	/*else if(response.data == -3){
				    		JSAlert.alert("Farmaceut na godisnjem!");
				    	}*/
				    	else if(response.data == -3){
				    		JSAlert.alert("Farmaceut zauzet!");
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
    },
	created() {
    	let url = new URL(window.location.href);
    	let urlParam = url.searchParams.get("schedule");
    	console.log(urlParam)
    	if(urlParam == "true")
    		this.schedule = true;
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
	     	this.derm = response.data
	     	axios
			.get('/api/examination/getNearestExamination',{
				headers: {
				 'Authorization': "Bearer " + localStorage.getItem('access_token')
				},
				params:{
					start: (new Date).getTime(),
					finished: !this.schedule
				}
		     })
		     .then(response => {
		    	 if(!response.data){
		    		 JSAlert.alert("Nema ni jednog pregleda!");		        	
			        	setTimeout(function () {
			        		window.location.href = "/pharmacist/pharmacistHome.html";
						}, 3000);
		    	 }
		    	 else{
		    		 this.examination = response.data
		    		 this.examination.startDate = new Date(this.examination.startDate)
		    		 this.calc();
		    		 this.current = new Date(this.current.getFullYear(), this.current.getMonth(), this.current.getDate());
		 	         this.today = new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate());
		 	         this.getTerms(this.today);
		 	         this.getDaysInMonth(this.current.getMonth(), this.current.getFullYear());
		 	         this.getWorkingPeriod(this.current);
		    	 }
		     })
	     })
	     axios
		.get('/api/medicine/getAll',{
			headers: {
			 'Authorization': "Bearer " + localStorage.getItem('access_token')
			}
	     })
	     .then(response => {
	     	this.medicines = response.data
	     })
	}
})