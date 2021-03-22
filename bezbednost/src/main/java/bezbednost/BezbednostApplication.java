package bezbednost;

import java.util.TimeZone;

import javax.annotation.PostConstruct;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class BezbednostApplication {
	
	@PostConstruct
	public void init() {
		TimeZone.setDefault(TimeZone.getTimeZone("GMT+1"));
	}

	public static void main(String[] args) {
		SpringApplication.run(BezbednostApplication.class, args);
	}

}
