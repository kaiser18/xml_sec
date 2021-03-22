var app = new Vue({
	el: '#manageDerm',
	data: {
		medicine: [],
		pharmacyId: "",
		admin: null,
		changePass: false,
		changeOrder: false,
		changeData: false,
		oldPass: "",
		newPass: "",
		newMedication: [],
		medId: null,
		searchMedicine: "",
		orderMed: null,
		newPrice: "",
		startOfPrice: null,
		endPfPrice: null,
		medQuantity: null,
		orderedMedication: [],
		finishOrder: false,
		deadline: null,
		takeBack:null,
		grades: [],
		start: null,
		end: null,
		money: null
		
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
		
		changeState(){
			if(this.changePass == true){
				this.changePass = false;
				
			}
			else
				this.changePass = true;
		},
		discardPassCh(){
			this.finishOrder = false;
		},
		addMedication(m){
			this.orderMed = m;
			if(this.changeOrder == true){
				this.changeOrder = false;
				
			}
			else
				this.changeOrder = true;
		},
		discardPriceCh(){
			this.changeOrder = false;
		},
		defNewOrder(){
			console.log(this.orderedMedication)
			let th = this;
			if(isNaN(this.medQuantity) || !this.medQuantity){
				JSAlert.alert("Neispravan unos!");
				this.medQuantity = "";
				return;
			}
			for(let i = 0; i < this.orderedMedication.length; i++){
				if(this.orderedMedication[i].id == this.orderMed.id){
					console.log(this.medQuantity)
					this.orderedMedication[i].quantity = this.medQuantity;
					const clone = JSON.parse(JSON.stringify(this.orderedMedication));
					this.orderedMedication = clone
					console.log(this.orderedMedication[i].quantity)
					this.changeOrder = false;
					console.log(this.orderedMedication[i])
					return;
				}
			}	
			for(let i = 0; i < this.newMedication.length; i++){
				if(this.newMedication[i].id == this.orderMed.id){
					this.newMedication.splice(i, 1);
				}
			}
			this.orderMed.quantity = this.medQuantity;
			this.orderedMedication.push(this.orderMed);		
			this.medQuantity = null;
			this.changeOrder = false;
		},
		search(){
			axios
			.get('/api/medicine/searchMedicineInPharmacy',
					{
						params:{
							name: this.searchMedicine
						},
					headers: {
					    'Authorization': "Bearer " + localStorage.getItem('access_token')
					  }
				
			})
			.then(response => {
				this.medicine = response.data
			})
		},
		formatDate(d){
			let date = new Date(d)
			return date.getDate() + "." + (date.getMonth() + 1) + "." + date.getFullYear() + ".";
		},
		finish(){
			if(this.finishOrder == true){
				this.finishOrder = false;
				
			}
			else
				this.finishOrder = true;
			
			
		},
		complete(){
			if(this.orderedMedication.length == 0)
				JSAlert.alert("Your order is empty!");
			axios
			
			.post('/api/errand/newErrand',
					{
						deadline: this.deadline,
					},
					{
					headers: {
					    'Authorization': "Bearer " + localStorage.getItem('access_token')
					  }
					})
			.then(response => {
				this.errandId = response.data
				for(let i = 0; i<this.orderedMedication.length; i++){
					this.orderedMedication[i].errandId = this.errandId
				}
				axios
				.post('/api/errand/errandMedication',
						{
							dto: JSON.stringify(this.orderedMedication)
						},
						{
						headers: {
						    'Authorization': "Bearer " + localStorage.getItem('access_token')
						  }
						})
				.then(response => {
					JSAlert.alert("You hae successfully created an order!");
	                setTimeout(function () {
						window.location.href = '/pharmacyAdmin/newOrder.html';
					}, 3000);
				})
			}).catch(error => {
	            if (error.response.status == 401 || error.response.status == 400 || error.response.status == 500) {
	                JSAlert.alert(error.response.data.errors[0].defaultMessage);
	            }		            
	        })
			
		},
		deleteFromOrder(m){
			for(let i = 0; i < this.orderedMedication.length; i++){
				if(this.orderedMedication[i].id == m.id){
					this.orderedMedication.splice(i, 1);
				}
			}
			
			m.quantity = 0;
			this.newMedication.push(m);
		},
		changePrice(m){
			this.orderMed = m;
			if(this.changeOrder == true){
				this.changeOrder = false;
			}
			else
				this.changeOrder = true;
		},
		onChange(godina){
			console.log(godina)
			axios
			.get('/api/pharmacy/getReportByYear',
					{
				params:{
					year: godina
				},
			headers: {
			    'Authorization': "Bearer " + localStorage.getItem('access_token')
			  }
		
			})
		     .then(response => {
		    	 this.grades = response.data
		    	 console.log(this.grades.percentageOfGrades)
		    	 this.funkcija4();
		    	 this.funkcija5();
		    	 this.funkcija7();
		    	 this.funkcija8();
		    	 
		     })
		},
		funkcija1(){
	            var chart = {
	               plotBackgroundColor: null,
	               plotBorderWidth: null,
	               plotShadow: false
	            };
	            var title = {
	               text: 'Pharmacy grades'   
	            };
	            var tooltip = {
	               pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
	            };
	            var plotOptions = {
	               pie: {
	                  allowPointSelect: true,
	                  cursor: 'pointer',
	                  
	                  dataLabels: {
	                     enabled: true,
	                     format: '<b>{point.name}</b>: {point.percentage:.1f} %',
	                     style: {
	                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor)||
	                        'black'
	                     }
	                  }
	               }
	            };
	            var series = [{
	               type: 'pie',
	               name: 'Pharmacy grades',
	               data: [
	                  ['Grade 1',this.grades.percentageOfGrades[0]],
	                  ['Grade 2',this.grades.percentageOfGrades[1]],
	                  ['Grade 3',this.grades.percentageOfGrades[2]],
	                  ['Grade 4',this.grades.percentageOfGrades[3]],
	                  ['Grade 5',this.grades.percentageOfGrades[4]]
	               ]
	            }];
	            var json = {};   
	            json.chart = chart; 
	            json.title = title;     
	            json.tooltip = tooltip;  
	            json.series = series;
	            json.plotOptions = plotOptions;
	            $('#container1').highcharts(json);  
		},
		funkcija2(){
	            var chart = {
	               type: 'column'
	            };
	            var title = {
	               text: 'Pharmacist average grade'   
	            };

	            
	            var str = [];
	            for (var a = 0; a < this.grades.pharmacistGrades.length; a++) {	              
	              str.push(this.grades.pharmacistGrades[a].firstName);
	            }
	            
	            console.log(str);

	            var grades = [];
	            for (var a = 0; a < this.grades.pharmacistGrades.length; a++) {	              
	            	grades.push(this.grades.pharmacistGrades[a].grade);
	            }
	            
	            console.log(str);
	            

	            var xAxis = {
	            		
	               categories: str,
	               crosshair: true
	            };
	            var yAxis = {
	               min: 0,
	               title: {
	                  text: 'Grades'         
	               }      
	            };
	            var tooltip = {
	               headerFormat: '<span style = "font-size:10px">{point.key}</span><table>',
	               pointFormat: '<tr><td style = "color:{series.color};padding:0">{series.name}: </td>' +
	                  '<td style = "padding:0"><b>{point.y:.1f}</b></td></tr>',
	               footerFormat: '</table>',
	               shared: true,
	               useHTML: true
	            };
	            var plotOptions = {
	               column: {
	                  pointPadding: 0.2,
	                  borderWidth: 0
	               }
	            };  
	            var credits = {
	               enabled: false
	            };
	            var series= [
	               {
	                  name: 'Average grade',
	                  data: grades
	               }, 
	            ];     
	         
	            var json = {};   
	            json.chart = chart; 
	            json.title = title;    
	            json.tooltip = tooltip;
	            json.xAxis = xAxis;
	            json.yAxis = yAxis;  
	            json.series = series;
	            json.plotOptions = plotOptions;  
	            json.credits = credits;
	            $('#container2').highcharts(json);
	},
	funkcija3(){
        var chart = {
           type: 'column'
        };
        var title = {
           text: 'Dermatologist average grade'   
        };

        
        var str = [];
        for (var a = 0; a < this.grades.dermatologistGrades.length; a++) {	              
          str.push(this.grades.dermatologistGrades[a].firstName);
        }
        
        console.log(str);

        var grades = [];
        for (var a = 0; a < this.grades.dermatologistGrades.length; a++) {	              
        	grades.push(this.grades.dermatologistGrades[a].grade);
        }
        
        console.log(str);
        

        var xAxis = {
        		
           categories: str,
           crosshair: true
        };
        var yAxis = {
           min: 0,
           title: {
              text: 'Grades'         
           }      
        };
        var tooltip = {
           headerFormat: '<span style = "font-size:10px">{point.key}</span><table>',
           pointFormat: '<tr><td style = "color:{series.color};padding:0">{series.name}: </td>' +
              '<td style = "padding:0"><b>{point.y:.1f}</b></td></tr>',
           footerFormat: '</table>',
           shared: true,
           useHTML: true
        };
        var plotOptions = {
           column: {
              pointPadding: 0.2,
              borderWidth: 0
           }
        };  
        var credits = {
           enabled: false
        };
        var series= [
           {
              name: 'Average grade',
              data: grades
           }, 
        ];     
     
        var json = {};   
        json.chart = chart; 
        json.title = title;    
        json.tooltip = tooltip;
        json.xAxis = xAxis;
        json.yAxis = yAxis;  
        json.series = series;
        json.plotOptions = plotOptions;  
        json.credits = credits;
        $('#container3').highcharts(json);
},
		funkcija4(){
		    var chart = {
		       type: 'column'
		    };
		    var title = {
		       text: 'Monthly finished examinations'   
		    };
		
		
		    var month = [];
		    for (var a = 0; a < this.grades.monthlyCounseling.length; a++) {	              
		    	month.push(this.grades.monthlyCounseling[a]);
		    }
		    
		   console.log(month)
		
		    var xAxis = {
		               categories: ['Jan','Feb','Mar','Apr','May','Jun','Jul',
		                  'Aug','Sep','Oct','Nov','Dec'],
		               crosshair: true
		    };
		    
		    var yAxis = {
		       min: 0,
		       title: {
		          text: 'Number'         
		       }      
		    };
		    var tooltip = {
		       headerFormat: '<span style = "font-size:10px">{point.key}</span><table>',
		       pointFormat: '<tr><td style = "color:{series.color};padding:0">{series.name}: </td>' +
		          '<td style = "padding:0"><b>{point.y:.1f}</b></td></tr>',
		       footerFormat: '</table>',
		       shared: true,
		       useHTML: true
		    };
		    var plotOptions = {
		       column: {
		          pointPadding: 0.2,
		          borderWidth: 0
		       }
		    };  
		    var credits = {
		       enabled: false
		    };
		    var series= [
		       {
		          name: 'Number of examinations',
		          data: month
		       }, 
		    ];     
		 
		    var json = {};   
		    json.chart = chart; 
		    json.title = title;    
		    json.tooltip = tooltip;
		    json.xAxis = xAxis;
		    json.yAxis = yAxis;  
		    json.series = series;
		    json.plotOptions = plotOptions;  
		    json.credits = credits;
		    $('#container4').highcharts(json);
		},
		funkcija5(){
		    var chart = {
				       type: 'column'
				    };
				    var title = {
				       text: 'Quarterly finished examinations'   
				    };
				
				
				    var quarter = [];
				    for (var a = 0; a < this.grades.quarterlyCounseling.length; a++) {	              
				    	quarter.push(this.grades.quarterlyCounseling[a]);
				    }
				    
				   console.log(quarter)
				
				    var xAxis = {
				               categories: ['I','II','III','IV'],
				               crosshair: true
				    };
				    
				    var yAxis = {
				       min: 0,
				       title: {
				          text: 'Number'         
				       }      
				    };
				    var tooltip = {
				       headerFormat: '<span style = "font-size:10px">{point.key}</span><table>',
				       pointFormat: '<tr><td style = "color:{series.color};padding:0">{series.name}: </td>' +
				          '<td style = "padding:0"><b>{point.y:.1f}</b></td></tr>',
				       footerFormat: '</table>',
				       shared: true,
				       useHTML: true
				    };
				    var plotOptions = {
				       column: {
				          pointPadding: 0.2,
				          borderWidth: 0
				       }
				    };  
				    var credits = {
				       enabled: false
				    };
				    var series= [
				       {
				          name: 'Number of examinations',
				          data: quarter
				       }, 
				    ];     
				 
				    var json = {};   
				    json.chart = chart; 
				    json.title = title;    
				    json.tooltip = tooltip;
				    json.xAxis = xAxis;
				    json.yAxis = yAxis;  
				    json.series = series;
				    json.plotOptions = plotOptions;  
				    json.credits = credits;
				    $('#container5').highcharts(json);
				},
				funkcija6(){
				    var chart = {
						       type: 'column'
						    };
						    var title = {
						       text: 'Yearly finished examinations'   
						    };
						
						
						    var quarter = [];
						    for (var a = 0; a < this.grades.yearlyCounseling.length; a++) {	              
						    	quarter.push(this.grades.yearlyCounseling[a]);
						    }
						    
						   console.log(quarter)
						
						    var xAxis = {
						               categories: ['2020','2021'],
						               crosshair: true
						    };
						    
						    var yAxis = {
						       min: 0,
						       title: {
						          text: 'Number'         
						       }      
						    };
						    var tooltip = {
						       headerFormat: '<span style = "font-size:10px">{point.key}</span><table>',
						       pointFormat: '<tr><td style = "color:{series.color};padding:0">{series.name}: </td>' +
						          '<td style = "padding:0"><b>{point.y:.1f}</b></td></tr>',
						       footerFormat: '</table>',
						       shared: true,
						       useHTML: true
						    };
						    var plotOptions = {
						       column: {
						          pointPadding: 0.2,
						          borderWidth: 0
						       }
						    };  
						    var credits = {
						       enabled: false
						    };
						    var series= [
						       {
						          name: 'Number of examinations',
						          data: quarter
						       }, 
						    ];     
						 
						    var json = {};   
						    json.chart = chart; 
						    json.title = title;    
						    json.tooltip = tooltip;
						    json.xAxis = xAxis;
						    json.yAxis = yAxis;  
						    json.series = series;
						    json.plotOptions = plotOptions;  
						    json.credits = credits;
						    $('#container6').highcharts(json);
						},
						
					funkcija7(){
						    var chart = {
								       type: 'column'
								    };
								    var title = {
								       text: 'Monthly medicine usage'   
								    };
								
								
								    var month = [];
								    for (var a = 0; a < this.grades.monthlyUsage.length; a++) {	              
								    	month.push(this.grades.monthlyUsage[a]);
								    }
								    
								   console.log(month)
								
								    var xAxis = {
								               categories: ['Jan','Feb','Mar','Apr','May','Jun','Jul',
								                  'Aug','Sep','Oct','Nov','Dec'],
								               crosshair: true
								    };
								    
								    var yAxis = {
								       min: 0,
								       title: {
								          text: 'Number'         
								       }      
								    };
								    var tooltip = {
								       headerFormat: '<span style = "font-size:10px">{point.key}</span><table>',
								       pointFormat: '<tr><td style = "color:{series.color};padding:0">{series.name}: </td>' +
								          '<td style = "padding:0"><b>{point.y:.1f}</b></td></tr>',
								       footerFormat: '</table>',
								       shared: true,
								       useHTML: true
								    };
								    var plotOptions = {
								       column: {
								          pointPadding: 0.2,
								          borderWidth: 0
								       }
								    };  
								    var credits = {
								       enabled: false
								    };
								    var series= [
								       {
								          name: 'Number of used medicine',
								          data: month
								       }, 
								    ];     
								 
								    var json = {};   
								    json.chart = chart; 
								    json.title = title;    
								    json.tooltip = tooltip;
								    json.xAxis = xAxis;
								    json.yAxis = yAxis;  
								    json.series = series;
								    json.plotOptions = plotOptions;  
								    json.credits = credits;
								    $('#container7').highcharts(json);
								},
								funkcija8(){
								    var chart = {
										       type: 'column'
										    };
										    var title = {
										       text: 'Quarterly medicine usage'   
										    };
										
										
										    var quarter = [];
										    for (var a = 0; a < this.grades.quarterlyUsage.length; a++) {	              
										    	quarter.push(this.grades.quarterlyUsage[a]);
										    }
										    
										   console.log(quarter)
										
										    var xAxis = {
										               categories: ['I','II','III','IV'],
										               crosshair: true
										    };
										    
										    var yAxis = {
										       min: 0,
										       title: {
										          text: 'Number'         
										       }      
										    };
										    var tooltip = {
										       headerFormat: '<span style = "font-size:10px">{point.key}</span><table>',
										       pointFormat: '<tr><td style = "color:{series.color};padding:0">{series.name}: </td>' +
										          '<td style = "padding:0"><b>{point.y:.1f}</b></td></tr>',
										       footerFormat: '</table>',
										       shared: true,
										       useHTML: true
										    };
										    var plotOptions = {
										       column: {
										          pointPadding: 0.2,
										          borderWidth: 0
										       }
										    };  
										    var credits = {
										       enabled: false
										    };
										    var series= [
										       {
										          name: 'Number of used medicine',
										          data: quarter
										       }, 
										    ];     
										 
										    var json = {};   
										    json.chart = chart; 
										    json.title = title;    
										    json.tooltip = tooltip;
										    json.xAxis = xAxis;
										    json.yAxis = yAxis;  
										    json.series = series;
										    json.plotOptions = plotOptions;  
										    json.credits = credits;
										    $('#container8').highcharts(json);
										},
										funkcija9(){
										    var chart = {
												       type: 'column'
												    };
												    var title = {
												       text: 'Yearly medicine usage'   
												    };
												
												
												    var quarter = [];
												    for (var a = 0; a < this.grades.yearlyUsage.length; a++) {	              
												    	quarter.push(this.grades.yearlyUsage[a]);
												    }
												    
												   console.log(quarter)
												
												    var xAxis = {
												               categories: ['2020','2021'],
												               crosshair: true
												    };
												    
												    var yAxis = {
												       min: 0,
												       title: {
												          text: 'Number'         
												       }      
												    };
												    var tooltip = {
												       headerFormat: '<span style = "font-size:10px">{point.key}</span><table>',
												       pointFormat: '<tr><td style = "color:{series.color};padding:0">{series.name}: </td>' +
												          '<td style = "padding:0"><b>{point.y:.1f}</b></td></tr>',
												       footerFormat: '</table>',
												       shared: true,
												       useHTML: true
												    };
												    var plotOptions = {
												       column: {
												          pointPadding: 0.2,
												          borderWidth: 0
												       }
												    };  
												    var credits = {
												       enabled: false
												    };
												    var series= [
												       {
												          name: 'Number of used medicine',
												          data: quarter
												       }, 
												    ];     
												 
												    var json = {};   
												    json.chart = chart; 
												    json.title = title;    
												    json.tooltip = tooltip;
												    json.xAxis = xAxis;
												    json.yAxis = yAxis;  
												    json.series = series;
												    json.plotOptions = plotOptions;  
												    json.credits = credits;
												    $('#container9').highcharts(json);
												},
												funkcija10(){
												    var chart = {
														       type: 'column'
														    };
														    var title = {
														       text: 'Earnings for a period'   
														    };
														
														
														    var quarter = [];
														                 
														    	quarter.push(this.money.earningE);
														    	quarter.push(this.money.earningC);
														    	quarter.push(this.money.earningM);
														    
														   console.log(quarter)
														
														    var xAxis = {
														               categories: ['Examination', 'Counseling','Medicine'],
														               crosshair: true
														    };
														    
														    var yAxis = {
														       min: 0,
														       title: {
														          text: 'Money'         
														       }      
														    };
														    var tooltip = {
														       headerFormat: '<span style = "font-size:10px">{point.key}</span><table>',
														       pointFormat: '<tr><td style = "color:{series.color};padding:0">{series.name}: </td>' +
														          '<td style = "padding:0"><b>{point.y:.1f}</b></td></tr>',
														       footerFormat: '</table>',
														       shared: true,
														       useHTML: true
														    };
														    var plotOptions = {
														       column: {
														          pointPadding: 0.2,
														          borderWidth: 0
														       }
														    };  
														    var credits = {
														       enabled: false
														    };
														    var series= [
														       {
														          name: 'Money earned',
														          data: quarter
														       }, 
														    ];     
														 
														    var json = {};   
														    json.chart = chart; 
														    json.title = title;    
														    json.tooltip = tooltip;
														    json.xAxis = xAxis;
														    json.yAxis = yAxis;  
														    json.series = series;
														    json.plotOptions = plotOptions;  
														    json.credits = credits;
														    $('#container10').highcharts(json);
														},
												searchEarning(){
													axios
													.get('/api/pharmacy/getReportEarnings',
															{
														params:{
															start: new Date(this.start).getTime(),
															end: new Date(this.end).getTime(),
														},
													headers: {
													    'Authorization': "Bearer " + localStorage.getItem('access_token')
													  }
												
													})
												     .then(response => {
												    	 this.money = response.data
												    	 console.log(this.money)
												    	 this.funkcija10();})
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
			.get('/api/pharmacy/getReportByYear',
					{
				params:{
					year: 2021
				},
			headers: {
			    'Authorization': "Bearer " + localStorage.getItem('access_token')
			  }
		
	})
		     .then(response => {
		    	 this.grades = response.data
		    	 console.log(this.grades.percentageOfGrades)
		    	 this.funkcija1();
		    	 this.funkcija2();
		    	 this.funkcija3();
		    	 this.funkcija4();
		    	 this.funkcija5();
		    	 this.funkcija6();
		    	 this.funkcija7();
		    	 this.funkcija8();
		    	 this.funkcija9();
		    	 
		     })
		    
	     })
	     
	}
})

