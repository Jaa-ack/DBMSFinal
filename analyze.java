
public class analyze {
	//需抓資料庫的資料
	int age = 0;
	double height = 0.0;//with m
	double weight = 0.0;//with Kg
//	String name = " ";
	double cal = 0.0;
	double protein = 0.0;
	double fat = 0.0;
	double carbonhydrate = 0.0;
	String type = " "; 
	int time = 0;//with minutes
	int normalHeartRate = 0;
	int exerciseHeartRate = 0;
	String dietGoal = " ";
//	String healthGoal =" ";
	String exerciseGoal = " ";
	//程式需要用到的資料
	double wasteCal = 0.0;
	double basicCal = 66.5 + 13.7*weight + 100*5*height - 6.8*age;
	double maxCal = 2200;
	double totalWasteCal = wasteCal + basicCal; 
	int maxHeartRate = 220 - age;
	double best1Protein = basicCal*0.35/4;
	double best1Fat = basicCal*0.25/9;
	double best1Carbonhydrate = basicCal*0.40/4;
	double best2Protein = 0.8*weight*2.5;
	double best2Fat = 1.2*weight;
	double best2Carbonhydrate = 18*weight/4;
	String exerciseComment = " ";
	String health1Comment = " ";
	String health2Comment = " ";
	String diet1Comment = " ";
	String diet2Comment = " ";
	String beginAlert = "You need to eat more, especially ";
	String alert = " ";
	String result = " ";
	
	public analyze(int age, double height, double weight, double cal, double protein, double fat, double carbonhydrate, String type, int time,
			int normalHeartRate, int exerciseHeartRate, String dietGoal, String exerciseGoal) {
		this.age = age;
		this.height = height;
		this.weight = weight;
		this.cal = cal;
		this.protein = protein;
		this.fat = fat;
		this.carbonhydrate = carbonhydrate;
		this.type = type;
		this.time = time;
		this.normalHeartRate = normalHeartRate;
		this.exerciseHeartRate = exerciseHeartRate;
		this.dietGoal = dietGoal;
		this.exerciseGoal = exerciseGoal;
	}
	public void analyzeExercise() {
		
		if(exerciseGoal == "減脂") {
			if(type == "running") {
				wasteCal = 350*time/60;
			}else if(type == "walking") {
				wasteCal = 220*time/60;
			}else if(type == "swimming") {
				wasteCal = 450*time/60;
			}else if(type == "playing basketball") {
				wasteCal = 400*time/60;
			}else if(type == "playing volleyball") {
				wasteCal = 250*time/60;
			}else if(type == "playing soccer") {
				wasteCal = 430*time/60;
			}else if(type == "dancing") {
				wasteCal = 300*time/60;
			}else if(type == "biking") {
				wasteCal = 380*time/60;
			}else if(type == "jumping the rope") {
				wasteCal = 800*time/60;
			}else {
				wasteCal = 350*time/60;
			}
		}
		
		if(totalWasteCal > maxCal) {
			exerciseComment = "You do a good job, keep moving";
		}else {
			exerciseComment = "You need to do more exercise";
		}
		 
		if(exerciseGoal == "增肌") {
			wasteCal = 500*time/60;
			if(time > 90) {
				exerciseComment = "You may work too hard!";
			}else if(time < 15) {
				exerciseComment = "You may work too less!";
			}else {
				exerciseComment = "Nice work!";
			}
			
		}		
//		System.out.println(wasteCal);
//		System.out.println(exerciseComment);
	}
	public void analyzeHealth() {
		if(normalHeartRate > 85) {
			health1Comment = "You may have some chronic!";
		}else {
			health1Comment = "You have a healthy body!";
		}
		if(exerciseHeartRate > maxHeartRate) {
			health2Comment = "You may be doing exercises that are too difficult for you!";
		}else {
			health2Comment = "Nice work!";
		}
//		System.out.println(health1Comment);
//		System.out.println(health2Comment);
	}
	public void analyzeDiet() {
		if(dietGoal == "減脂") {
			if(totalWasteCal > maxCal) {
				diet1Comment = "You do a good job!";
			}else {
				diet1Comment = "You need to eat less!";
			}
			diet2Comment = "We advise you can eat " + best1Protein + " protein, " + best1Fat + " fat, " + best1Carbonhydrate + " carbonhydrate" ;
			
		}
		if(dietGoal == "增肌") {
			if(totalWasteCal > maxCal) {
				diet1Comment = "You need to eat more!";
			}else {
				diet1Comment = "You do a good job!";
			}
			if(protein < best2Protein) {
				alert = alert + " protein";
			}
			if(fat < best2Fat) {
				alert = alert + " fat";
			}
			if(carbonhydrate < best2Carbonhydrate ) {
				alert = alert + "carbonhydrate";
			}
			if(alert == " ") {
				diet2Comment = "Excellent work!";
			}else {
				diet2Comment = beginAlert + alert;
			}
		}
//		System.out.println(diet1Comment);
//		System.out.println(diet2Comment);
	}
	
}

