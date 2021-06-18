package bezbednost.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


@RestController
@RequestMapping(value = "/log")
public class LoggingController {
	
	public static final Logger LOGGER = LoggerFactory.getLogger(LoggingController.class);
	
	@RequestMapping(value = "/log", method = RequestMethod.GET)
    public String index() {
	    LOGGER.info("doStuff took input - {}");
	    LOGGER.error("doStuff took input - {}");
	    LOGGER.debug("doStuff took input - {}");
	    LOGGER.warn("doStuff took input - {}");
	    LOGGER.trace("doStuff took input - {}");

        return "Howdy! Check out the Logs to see the output...";
    }
	
}
	