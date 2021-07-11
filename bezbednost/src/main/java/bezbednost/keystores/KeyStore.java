package bezbednost.keystores;

public class KeyStore {
	public static final String ROOT_FILE = "root";
	public static final String ROOT_PASS = "root";
	public static final String INTER_FILE = "inter";
	public static final String INTER_PASS = "inter";
	public static final String END_FILE = "end";
	public static final String END_PASS = "end";
	
	public static String getPassword(String fileName) {
		if(fileName.equals(ROOT_FILE))
			return ROOT_PASS;
		else if(fileName.equals(INTER_FILE))
			return INTER_PASS;
		else if(fileName.equals(END_FILE))
			return END_PASS;
		else
			return null;
	}
}
