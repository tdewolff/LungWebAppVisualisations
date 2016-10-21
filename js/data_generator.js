
function calculateFEVData(age, gender, years, packs, height, scaling) {
	var fev1 = [];
	var fev1_s = [];
	var fev1_stop = [];
	var fev1_cmp25 = [];
	var fev1_s_cmp25 = [];
	var fev1_stop_cmp25 = [];
	var current_age = 7;
	var smoking_decline_male = 7.4, smoking_decline_female = 4.4;
	var smoking_start = age - years;
	var previous_fev = 0;
	var smoking_decline = smoking_decline_male;
	if  (gender == "female")
		smoking_decline = smoking_decline_female;
	var last_smoking_reading = 0;
	var fev1_at_25 = 0.0;
	while (current_age < 100) {
		var current_fev = 0;
		if (gender == "male") {
			if (current_age < 19) {
				current_fev = -0.2584-0.20415*current_age+0.010133*current_age*current_age+0.00018642*height*height;
			} else {
				current_fev = -0.1933+0.00064*current_age-0.000269*current_age*current_age+0.00018642*height*height;
			}
			fev1.push({x : current_age, y :current_fev })
		} else {
			if (current_age < 17) {
				current_fev = -1.2082+0.05916*current_age+0.00014815*height*height;
			} else {
				current_fev = -0.3560+0.01870*current_age-0.000382*current_age*current_age+0.00014815*height*height;
			}
			fev1.push({x : current_age, y :current_fev })
		} 
		if (current_age == 25)
			fev1_at_25 = current_fev;
		var current_fev_smoke = current_fev;
		if (current_age > 7) {
			current_fev_smoke = 0;
			var years_of_smoking = (current_age > smoking_start) ? (current_age-smoking_start) : 0;
			if (years_of_smoking > 0 && packs > 0.0) {
				var decline = (current_fev - previous_fev) * 1000;
				var decline_for_smoke = decline - (smoking_decline * packs * years_of_smoking);
				current_fev_smoke = previous_fev + decline_for_smoke / 1000;
			}
			else {
				current_fev_smoke = current_fev;
			}
			current_fev_smoke = current_fev_smoke * scaling;
			fev1_s.push({x : current_age, y : current_fev_smoke})
		}
		if (current_age > age) {
			last_smoking_reading = last_smoking_reading + (current_fev - previous_fev) * scaling;
			fev1_stop.push({x : current_age, y :last_smoking_reading })
		} else {
			last_smoking_reading = current_fev_smoke;
			if (current_age > (age - 2))
				fev1_stop.push({x : current_age, y :last_smoking_reading })
		}

		
		previous_fev = current_fev;
		current_age = current_age + 2;
	}
	
	for (var i = 0; i < fev1.length; i++) {
		fev1_cmp25.push( {x : fev1[i].x, y : (fev1[i].y / fev1_at_25 * 100.0)});
	}
		
	for (var i = 0; i < fev1_s.length; i++) {
		fev1_s_cmp25.push( {x : fev1_s[i].x, y : (fev1_s[i].y / fev1_at_25 * 100.0)});
	}
	
	for (var i = 0; i < fev1_stop.length; i++) {
		fev1_stop_cmp25.push( {x : fev1_stop[i].x, y : (fev1_stop[i].y / fev1_at_25 * 100.0)});
	}
		
	return [fev1, fev1_s, fev1_stop, fev1_cmp25, fev1_s_cmp25, fev1_stop_cmp25];
};
