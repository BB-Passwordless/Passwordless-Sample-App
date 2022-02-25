package com.passwordless.PasswordlessSampleApp;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.ObjectCodec;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.util.JSONPObject;
import com.sun.xml.internal.ws.api.message.Header;
import jdk.nashorn.internal.ir.ObjectNode;
import org.springframework.beans.factory.support.ManagedMap;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;

@Controller
@SpringBootApplication
public class PasswordlessSampleAppApplication {

	public static void main(String[] args) {
		SpringApplication.run(PasswordlessSampleAppApplication.class, args);
	}


	@RequestMapping(value={"/","/login"})
	public String login(Model model){
		HashMap<String,String> data = new HashMap<>();
		data.put("type","Login");
		model.addAttribute("data",data);
		return "index";
	}

	@RequestMapping(value="/register")
	public String register(Model model){
		HashMap<String,String> data = new HashMap<>();
		data.put("type","Register");
		model.addAttribute("data",data);
		return "index";
	}
	@RequestMapping(value = "/register-success")
	public String registerSuccess(){

		return "registerSuccess";
	}
	@RequestMapping(value = "/login-success")
	public String loginSuccess(){

		return "success";
	}
	@RequestMapping(value = "/authenticateToken/{accessToken}")
	public String approveToken(@PathVariable String accessToken, Model model) throws JsonProcessingException {

		String url = "https://home.passwordless4u.com/api/verifyToken";
		HttpHeaders httpHeaders = new HttpHeaders();
		httpHeaders.setContentType(MediaType.APPLICATION_JSON);
		HashMap<String, String> map = new HashMap<>();
		map.put("accessToken",accessToken);
		RestTemplate restTemplate = new RestTemplate();
		try {
			Object result = restTemplate.postForObject(url,map,Object.class);
			System.out.println(result);
			model.addAttribute("data",result);
			return "registerDetails";
		} catch (RuntimeException exception) {
			System.out.println(exception);
			return "error";
		}


	}
}
