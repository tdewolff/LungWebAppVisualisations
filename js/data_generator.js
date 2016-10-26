
function computedFEV1(gender, age, height) {
	var current_fev1 = 0;
	if (gender == "male") {
		if (age < 19) {
			current_fev1 = -0.2584-0.20415*age+0.010133*age*age+0.00018642*height*height;
		} else {
			current_fev1 = -0.1933+0.00064*age-0.000269*age*age+0.00018642*height*height;
		}
	} else {
		if (age < 17) {
			current_fev1 = -1.2082+0.05916*age+0.00014815*height*height;
		} else {
			current_fev1 = -0.3560+0.01870*age-0.000382*age*age+0.00014815*height*height;
		}
	} 
	
	return current_fev1;
}

function calculateFEVData(age, gender, years, packs, height, fev1_measured, scaling) {
	var fev1_normal_non_smoker = [];
	var fev1_you = [];
	var fev1_you_smoking = [];
	
	
	var current_age = 7;
	// var smoking_decline_male = 7.4, smoking_decline_female = 4.4;
	var smoking_decline_male = 12.4, smoking_decline_female = 7.4;

	var smoking_start = age - years;

	var smoking_decline = smoking_decline_male;
	if  (gender == "female") {
		smoking_decline = smoking_decline_female;
	}

	var previous_fev1_you = 0;
	var last_smoking_reading = 0;

	var fev1_measured_scaling = fev1_measured / computedFEV1(gender, age, height);
	var fev1_measured_offset = fev1_measured - computedFEV1(gender, age, height);
	
	var fev1_at_25 = computedFEV1(gender, 25.0, height);
	var fev1_at_25_you = fev1_at_25;  //+ fev1_measured_offset;
	while (current_age < 100) {
		var current_fev1 = computedFEV1(gender, current_age, height);
		var current_fev1_you = current_fev1 * fev1_measured_scaling;
		fev1_normal_non_smoker.push({x: current_age, y: current_fev1 / fev1_at_25 * 100.0})
		fev1_you.push({x: current_age, y: current_fev1_you / fev1_at_25_you * 100.0});

		var current_fev1_smoke = current_fev1_you;
		if (current_age > 7) {
			current_fev1_smoke = 0;
			var years_of_smoking = (current_age > smoking_start) ? (current_age - smoking_start) : 0;
			if (years_of_smoking > 0 && packs > 0.0) {
				var decline = (current_fev1_you - previous_fev1_you) * 1000;
				var decline_for_smoke = decline - (smoking_decline * packs * years_of_smoking);
				current_fev1_smoke = previous_fev1_you + decline_for_smoke / 1000;
			}
			else {
				current_fev1_smoke = current_fev1_you;
			}
			current_fev1_smoke = current_fev1_smoke * scaling;
			fev1_you_smoking.push({x: current_age, y: current_fev1_smoke / fev1_at_25_you * 100.0})
		}
		
		previous_fev1_you = current_fev1_you;
		current_age = current_age + 2;
	}
	
	return [fev1_normal_non_smoker, fev1_you, fev1_you_smoking];
};

