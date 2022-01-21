
Passwordless.init(
  "https://api.passwordless.com.au/v1",
  "CLIENT_ID",
);
const getAppDetails = async () => {
  const logoImage = document.getElementById("logo");
  console.log(logoImage);
  try {
    const response = await Passwordless.getApplicationNameAndLogo();
    console.log(response);

    if (response.logo) {
      console.log(logoImage);
      logoImage.src = response.logo;
    }
  } catch (error) {
    console.log(error);
  }
};
getAppDetails();

function randomString(length, chars) {
  var result = "";
  for (var i = length; i > 0; --i)
    result += chars[Math.floor(Math.random() * chars.length)];
  return result;
}

const generateRandomId = () => {
  const rString = randomString(
    32,
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
  );
  return rString;
};

const registerFun = async () => {
  //console.log("regn session id",sessionId);
  const qrImg = document.getElementById("qrImg");
  qrImg.src = "#";

  const username = this.username.value;
  //console.log(username);
  if (this.authMethod.value == 1) {
    Passwordless
      .register({ username })
      .then(async (response) => {
        if (response.verified) {
          

          window.location.href = "/registerSuccess";
        } 
      })
      .catch(async (error) => {
        alert(error);
      });
  } else if (this.authMethod.value == 2) {
    generateQR(username, 1, "web");
  } else if (this.authMethod.value == 3) {
    generateQR(username, 1, "app");
   
  }
  
};

const loginFun = async () => {
  //console.log("login session id",sessionId);
  const username = this.username.value;
  const qrImg = document.getElementById("qrImg");
  qrImg.src = "#";

  if (this.authMethod.value == 1) {
    Passwordless
      .login({ username })
      .then(async (response) => {
        if (response.verified) {
         
          window.location.href = "/success";
        } 
      })
      .catch(async (error) => {
        alert(error);
      });
  } else if (this.authMethod.value == 2) {
    generateQR(username, 2, "web");
  } else if (this.authMethod.value == 3) {
    generateQR(username, 2, "app");
    
  }

  else if(this.authMethod.value == 4){
    generateQR(username, 2, "app","push");
    
  }
};

const generateQR = async (username, type, platform = "web",method="qr") => {
  const qrImg = document.getElementById("qrImg");
  qrImg.src = "#";
  const success = async (position) => {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    const ua = detect.parse(navigator.userAgent);
    const reqTime = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    });
    let path;

    if (type == 1) path = `${location.origin}/registerToken`;
    else if (type == 2) path = `${location.origin}/loginToken`;
    else path = `${location.origin}/addDevice`;

    const userDetails = {
      latitude,
      longitude,
      device: `${ua.os.name},${ua.browser.name}`,
      username,
      type,
      platform,
      reqTime,
      path,
      email:username
    };
  
    let remoteResponse; 

    try {
      if (method == "push") {
        remoteResponse = await Passwordless.sendPushNotification(userDetails);
        const device = remoteResponse?.devices?.join(", ");
        alert("push notification sent successfully to "+device);
      }
      else {
        remoteResponse = await Passwordless.generateQR(userDetails);
        qrImg.src = remoteResponse.url;
        type === 1
          ? $("#RegisterModal").modal("show")
          : $("#loginModal").modal("show");
      }


      console.log({accessToken:remoteResponse.accessToken});
      const { transactionId } = remoteResponse;
      
      const transactionResponse =
        await Passwordless.getTransactionStatusOnChange(transactionId);
      
      if (transactionResponse.status === "SUCCESS") {
       window.location.href = type === 1 ? "/registerSuccess" : "/success";
        
      }
      else if(transactionResponse.status === "FAILED"){
        transactionResponse.message ?alert(transactionResponse.message) : alert("Authentication Failed");
      }
      else {
        alert("Something went wrong");
      }
    }
    catch (error) { 
      console.log(error);
      alert(error.message);
    }

  
  };

  function error() {
    alert("Unable to retrieve your location");
  }

  if (!navigator.geolocation) {
    alert("Geolocation is not supported by your browser");
  } else {
    navigator.geolocation.getCurrentPosition(success, error, {
      enableHighAccuracy: true,
    });
  }
};

const addDevice = async (sessionId) => {
  //console.log("regn session id",sessionId);
  const qrImg = document.getElementById("qrImg");
  qrImg.src = "#";

  const username = this.username.value;
  //console.log(username);
  if (this.authMethod.value == 1) {
    Passwordless
      .addDevice(username)
      .then(async (response) => {
        if (response.verified) {
          

          alert("new device added successfully");
        }
      })
      .catch(async (error) => {
        alert(error);
      });
  } else if (this.authMethod.value == 2) {
    generateQR(username, 3, "web", sessionId);
  } else if (this.authMethod.value == 3) {
    generateQR(username, 3, "app", sessionId);
    $("#RegisterModal").modal("show");
  } else alert("not done yet");
};



const approveRegister = (username, id) => {
  Passwordless
    .register({ username, id })
    .then(async (response) => {
      console.log(response);
      if (response.verified) {
       
        window.location.href = "/registerSuccess";
      } 
    })
    .catch(async (error) => {
      alert(error);
    });
};

const approveLogin = (username, id) => {
  Passwordless
    .login({ username, id })
    .then(async (response) => {
      console.log("loginResponse", response);
      if (response.verified) {
        
        window.location.href = "/success";
      } 
    })
    .catch(async (error) => {
      alert(error);
    });
};

const declineProcess = async (id) => {
  
  try {
    const response = await Passwordless.declineTransaction(id);

    if(response.errorCode === 0){
     window.close();
    }
  }
  catch (error) { 
    alert(error.message);

  }
  
};

const approveDevice = (username, id) => {
  Passwordless
    .addDevice({ username, id })
    .then(async (response) => {
      console.log(response);
      if (response.verified) {
        
        alert("device added successfully");
        window.close();
      } 
    })
    .catch(async (error) => {
      alert(error);
    });
};
