import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

public class analyze {
	//需抓資料庫的資料
	//food table
	int food_id = 0;
	String food_Name = "";
	double calories = 0.0;
	double protein = 0.0;
	double fat = 0.0;
	double carbohydrate;
	//daily table
	int daily_id = 0;
//	int goal_id = 0;
	double achievement = 0.0;
	String daily_name = "";
	int daily_quantity;
	//exercise table
	int exercise_id = 0;
	String type ="";
	//goal table
	int goal_id = 0;
	String goal_name = "";
	String goal_type = "";
	int quantity = 0;
	int startTime = 0;
	int expected_days = 0;
	//user table
	int user_id = 0;
	String name  = "";
	int group_id = 0;
//	String goal_id = ""; //型態好像有問題
	int age = 0;
	double height = 0.0;
	double weight = 0.0;
	//meal table
//	int user_id = 0;
//	int food_id = 0;
	//workout table
//	int exercise_id = 0;
//	int user_id = 0;
	int time = 0;
	String exercuse_data = "";
	//comment table
//	int post_id = 0;
//	int user_id = 0;
//	String content = "";
//	int comment_time = 0;
	//article table
//	int post_id = 0;
//	String content = 0;
//	int user_id = 0;
//	int post_time = 0;
	//group  table
//	int group_id = 0;
//	String group_name = "";
//	String group_goal = "";
	int normalHeartRate = 0; //資料庫需要增加這些資料
	int exerciseHeartRate = 0;
	double target = 0.0;// with Kg / %
//	 int age = 0;
//	 double height = 0.0;//with m
//	 double weight = 0.0;//with Kg
//	// String name = " ";
//	 double realWaste = 0.0; 
//	 double cal = 0.0; 
//	 double protein = 0.0;
//	 double fat = 0.0;
//	 double carbonhydrate = 0.0;

//	 String type = " "; 
//	 int time = 0;// with minutes

	 String dietGoal = " ";  //不曉得資料庫的資料在哪
	// String healthGoal =" ";
	 String exerciseGoal = " ";
	
	 
//	 public analyze(int age, double height, double weight, double calories, double protein, double fat, double carbohydrate, String type, int time,
//	   int normalHeartRate, int exerciseHeartRate, String dietGoal, String exerciseGoal) {
//	  this.age = age;
//	  this.height = height;
//	  this.weight = weight;
//	  this.calories = calories;
//	  this.protein = protein;
//	  this.fat = fat;
//	  this.carbohydrate = carbohydrate;
//	  this.type = type;
//	  this.time = time;
//	  this.normalHeartRate = normalHeartRate;
//	  this.exerciseHeartRate = exerciseHeartRate;
//	  this.dietGoal = dietGoal;
//	  this.exerciseGoal = exerciseGoal;
//	 }
	 
	 public void getData() {
	        Connection connection = null;
	        Statement statement = null;
	        ResultSet resultSet1 = null;
	        ResultSet resultSet2 = null;
	        ResultSet resultSet3 = null;
	        ResultSet resultSet4 = null;
	        ResultSet resultSet5 = null;
	        ResultSet resultSet6 = null;

	        try {
	            connection = DatabaseConnectionManager.getConnection();
	            statement = connection.createStatement();
	            String query1 = "SELECT * FROM food";
	            resultSet1 = statement.executeQuery(query1);

	            while (resultSet1.next()) {
	                food_id = resultSet1.getInt("food_id");
	                food_Name = resultSet1.getString("food_Name");
	                calories = resultSet1.getDouble("calories");
	                protein = resultSet1.getDouble("protein");
	                fat = resultSet1.getDouble("fat");
	                carbohydrate = resultSet1.getDouble("carbohydrate");
 
	            }
	            String query2 = "SELECT * FROM daily";
	            resultSet2 = statement.executeQuery(query2);
	            while (resultSet2.next()) {
	                daily_id = resultSet2.getInt("daily_id");
	                achievement = resultSet2.getDouble("achievement");
	                daily_name = resultSet2.getString("daily_name");
	                daily_quantity = resultSet2.getInt("daily_quantity");
 
	            }
	            String query3 = "SELECT * FROM exercise";
	            resultSet3 = statement.executeQuery(query3);
	            while (resultSet3.next()) {
	                exercise_id = resultSet3.getInt("exercise_id");
	                type = resultSet3.getString("type");
 
	            }
	            String query4 = "SELECT * FROM goal";
	            resultSet4 = statement.executeQuery(query4);
	            while (resultSet4.next()) {
	                goal_id = resultSet4.getInt("goal_id");
	                goal_name = resultSet4.getString("goal_name");
	                goal_type = resultSet4.getString("goal_type");
	                quantity = resultSet4.getInt("quantity");
	                startTime = resultSet4.getInt("startTime");
	                expected_days = resultSet4.getInt("expected_days");
 
	            }
	            String query5 = "SELECT * FROM user";
	            resultSet5 = statement.executeQuery(query5);
	            while (resultSet5.next()) {
	                user_id = resultSet5.getInt("user_id");
	                name = resultSet5.getString("name");
	                group_id = resultSet5.getInt("group_id");
	                age = resultSet5.getInt("age");
	                height = resultSet5.getDouble("height");
	                weight = resultSet5.getDouble("weight");
 
	            }
	            String query6 = "SELECT * FROM workout";
	            resultSet6 = statement.executeQuery(query6);
	            while (resultSet6.next()) {
	                time = resultSet6.getInt("time");
	                exercuse_data = resultSet6.getString("exercuse_data");
 
	            }
//	                System.out.println("ID: " + id + ", Name: " + name + ", Position: " + position);
	           
	        } catch (SQLException e) {
	            e.printStackTrace();
	        } finally {
	            try {
	                if (resultSet1 != null) resultSet1.close();
	                if (resultSet2 != null) resultSet2.close();
	                if (resultSet3 != null) resultSet3.close();
	                if (resultSet4 != null) resultSet4.close();
	                if (resultSet5 != null) resultSet5.close();
	                if (resultSet6 != null) resultSet6.close();
	                if (statement != null) statement.close();
	                if (connection != null) connection.close();
	            } catch (SQLException e) {
	                e.printStackTrace();
	            }
	        }
	    }
	 
	 
	 //程式需要用到的資料
	 double wasteCal = 0.0;
	 double basicCal = 66.5 + 13.7*weight + 100*5*height - 6.8*age;
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
	 double completeDiet = 0.0;
	 double completeExercise = 0.0;
	 
	 public void analyzeExercise() {
	  
	  if(exerciseGoal == "輕鬆運動") {
	   if(type == "running") {
	    wasteCal = 0.8*350*time/60;
	    completeExercise = Math.min(1,basicCal  / wasteCal);
	   }else if(type == "walking") {
	    wasteCal =0.8*220*time/60;
	    completeExercise = Math.min(1,basicCal  / wasteCal);
	   }else if(type == "swimming") {
	    wasteCal = 0.8*450*time/60;
	    completeExercise = Math.min(1,basicCal  / wasteCal);
	   }else if(type == "playing basketball") {
	    wasteCal = 0.8*400*time/60;
	    completeExercise = Math.min(1,basicCal  / wasteCal);
	   }else if(type == "playing volleyball") {
	    wasteCal = 0.8*250*time/60;
	    completeExercise = Math.min(1,basicCal  / wasteCal);
	   }else if(type == "playing soccer") {
	    wasteCal = 0.8*430*time/60;
	    completeExercise = Math.min(1,basicCal  / wasteCal);
	   }else if(type == "dancing") {
	    wasteCal = 0.8*300*time/60;
	    completeExercise = Math.min(1,basicCal  / wasteCal);
	   }else if(type == "biking") {
	    wasteCal = 0.8*380*time/60;
	    completeExercise = Math.min(1,basicCal  / wasteCal);
	   }else if(type == "jumping the rope") {
	    wasteCal = 0.8*800*time/60;
	    completeExercise = Math.min(1,basicCal  / wasteCal);
	   }else {
	    wasteCal = 0.8*350*time/60;
	    completeExercise = Math.min(1,basicCal  / wasteCal);
	   }
	  }

	  if(exerciseGoal == "一般運動") {
	   if(type == "running") {
	    wasteCal = 1.2*350*time/60;
	    completeExercise = Math.min(1,basicCal  / wasteCal);
	   }else if(type == "walking") {
	    wasteCal =1.2*220*time/60;
	    completeExercise = Math.min(1,basicCal  / wasteCal);
	   }else if(type == "swimming") {
	    wasteCal = 1.2*450*time/60;
	    completeExercise = Math.min(1,basicCal  / wasteCal);
	   }else if(type == "playing basketball") {
	    wasteCal = 1.2*400*time/60;
	    completeExercise = Math.min(1,basicCal  / wasteCal);
	   }else if(type == "playing volleyball") {
	    wasteCal = 1.2*250*time/60;
	    completeExercise = Math.min(1,basicCal  / wasteCal);
	   }else if(type == "playing soccer") {
	    wasteCal = 1.2*430*time/60;
	    completeExercise = Math.min(1,basicCal  / wasteCal);
	   }else if(type == "dancing") {
	    wasteCal = 1.2*300*time/60;
	    completeExercise = Math.min(1,basicCal  / wasteCal);
	   }else if(type == "biking") {
	    wasteCal = 1.2*380*time/60;
	    completeExercise = Math.min(1,basicCal  / wasteCal);
	   }else if(type == "jumping the rope") {
	    wasteCal = 1.2*800*time/60;
	    completeExercise = Math.min(1,basicCal  / wasteCal);
	   }else {
	    wasteCal = 1.2*350*time/60;
	    completeExercise = Math.min(1,basicCal  / wasteCal);
	   }
	  }
	  if(exerciseGoal == "挑戰運動") {
	   if(type == "running") {
	    wasteCal = 1.5*350*time/60;
	    completeExercise = Math.min(1,basicCal  / wasteCal);
	   }else if(type == "walking") {
	    wasteCal =1.5*220*time/60;
	    completeExercise = Math.min(1,basicCal  / wasteCal);
	   }else if(type == "swimming") {
	    wasteCal = 1.5*450*time/60;
	    completeExercise = Math.min(1,basicCal  / wasteCal);
	   }else if(type == "playing basketball") {
	    wasteCal = 1.5*400*time/60;
	    completeExercise = Math.min(1,basicCal  / wasteCal);
	   }else if(type == "playing volleyball") {
	    wasteCal = 1.5*250*time/60;
	    completeExercise = Math.min(1,basicCal  / wasteCal);
	   }else if(type == "playing soccer") {
	    wasteCal = 1.5*430*time/60;
	    completeExercise = Math.min(1,basicCal  / wasteCal);
	   }else if(type == "dancing") {
	    wasteCal = 1.5*300*time/60;
	    completeExercise = Math.min(1,basicCal  / wasteCal);
	   }else if(type == "biking") {
	    wasteCal = 1.5*380*time/60;
	    completeExercise = Math.min(1,basicCal  / wasteCal);
	   }else if(type == "jumping the rope") {
	    wasteCal = 1.5*800*time/60;
	    completeExercise = Math.min(1,basicCal  / wasteCal);
	   }else {
	    wasteCal = 1.5*350*time/60;
	    completeExercise = Math.min(1,basicCal  / wasteCal);
	   }
	  }
	//  System.out.println(wasteCal);
	//  System.out.println(exerciseComment);
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
	//  System.out.println(health1Comment);
	//  System.out.println(health2Comment);
	 }
	 public void analyzeDiet() {
	  if(dietGoal == "減脂") {
	   if(totalWasteCal > calories) {
	    diet1Comment = "You do a good job!";
	    completeDiet = completeDiet + (totalWasteCal - calories)*0.01 /target;
	   }else {
	    diet1Comment = "You need to eat less!";
	    completeDiet = completeDiet + (totalWasteCal - calories)*0.01 /target;
	   }
	//   diet2Comment = "We advise you can eat " + best1Protein + " protein, " + best1Fat + " fat, " + best1Carbonhydrate + " carbonhydrate" ;
	   
	  }
	  if(dietGoal == "增肌") {
	   if(totalWasteCal > calories) {
	    diet1Comment = "You need to eat more!";
	    completeDiet = completeDiet + (calories - totalWasteCal)*0.005 + (protein - best2Protein)*0.005;
	   }else {
	    diet1Comment = "You do a good job!";
	    completeDiet = completeDiet + (calories - totalWasteCal)*0.005 + (protein - best2Protein)*0.005;
	   }
	   
	  if(dietGoal == "減肥") {
	   if(totalWasteCal > calories) {
	    diet1Comment = "You do a good job!";
	    completeDiet = completeDiet + (totalWasteCal - calories)*0.013 /target;
	   }else {
	    diet1Comment = "You need to eat less!";
	    completeDiet = completeDiet + (totalWasteCal - calories)*0.013 /target;
	   }
	  }
	//  System.out.println(diet1Comment);
	//  System.out.println(diet2Comment);
	 }
	 
	}

	}