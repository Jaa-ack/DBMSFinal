import java.io.*;
import java.sql.*;

public class Main {
	public static void main(String args[]) throws SQLException, IOException{
		try {
			Class.forName("oracle.jdbc.driver.OracleDriver");
		}catch(ClassNotFoundException x) {
			System.out.println("Driver could not be loaded");
		}
		
		String dbacct = "";
		String dbpassw = "";
		Connection conn = DriverManager.getConnection("jdbc:oracle:oci8:" + dbacct + "/" + dbpassw);
		            
		conn.close();
	}
	
	public void Login(Connection conn, String account, String password)  throws SQLException{
		// 準備 SQL 語句
		String sql = "SELECT account, password FROM User WHERE username = ? AND password = = ?";
				            
		try {
			// 創建 PreparedStatement 對象
			PreparedStatement pstmt = conn.prepareStatement(sql);
			// 設置參數值
			pstmt.setString(1, account);
			pstmt.setString(2, password);
					            
			// 執行 SQL 語句
			ResultSet rs = pstmt.executeQuery();
					            
			// 處理查詢結果
			if (rs.next()) {
                System.out.println("登入成功");
            } else {
                System.out.println("登入失敗：用戶名或密碼錯誤");
            }
					            
			// 關閉資源
			rs.close();
			pstmt.close();
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	public void Register(Connection conn, String account, String password)  throws SQLException{
		// 準備 SQL 語句
		String sql = "SELECT account FROM User WHERE username = ?";
						            
		try {
			// 創建 PreparedStatement 對象
			PreparedStatement pstmt = conn.prepareStatement(sql);
			// 設置參數值
			pstmt.setString(1, account);
							            
			// 執行 SQL 語句
			ResultSet rs = pstmt.executeQuery();
							            
			// 處理查詢結果
			if (rs.next()) {
				System.out.println("帳號重複");
			} else {
				sql = "INSERT INTO User (account, password) VALUES (account, password);";
				Statement stmt = conn.createStatement();
								            
				// 執行 INSERT 語句並獲取受影響的記錄數量
	            int rowsAffected = stmt.executeUpdate(sql);

	            // 檢查操作是否成功
	            if (rowsAffected > 0) {
	                System.out.println("Insert operation successful.");
	            } else {
	                System.out.println("Insert operation failed.");
	            }
			}
			// 關閉資源
			rs.close();
			pstmt.close();
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	
	public void Forget() {
		
	}
}
