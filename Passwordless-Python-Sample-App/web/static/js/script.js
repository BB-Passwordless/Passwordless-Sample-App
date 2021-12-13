const fido = new passwordless(
  "BASE_URL",
  "CLIENT_ID"
);


const getAppDetails = async () => {
  const logoImage = document.getElementById("logo");
  console.log(logoImage);
  try {
    const response = await fido.getApplicationNameAndLogo();
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
  console.log(username);
  if (this.authMethod.value == 1) {
    fido
      .register({ username })
      .then(async (response) => {
        console.log(response);
        if (response.verified) {
          await AddToAudit(response.userId, 1, "success");

          // window.location.href = "/register-success";
        } else await AddToAudit(response.userId, 1, "error");
      })
      .catch(async (error) => {
        alert(error);
      });
  } else if (this.authMethod.value == 2) {
    generateQR(username, 1, "web");
  } else if (this.authMethod.value == 3) {
    generateQR(username, 1, "app");
    $("#RegisterModal").modal("show");
  }
};

const loginFun = async () => {
  //console.log("login session id",sessionId);
  const username = this.username.value;
  const qrImg = document.getElementById("qrImg");
  qrImg.src = "#";

  if (this.authMethod.value == 1) {
    fido
      .login({ username })
      .then(async (response) => {
        if (response.verified) {
          await AddToAudit(response.userId, 2, "success");
          window.location.href = "/login-success";
        } else await AddToAudit(response.userId, 2, "error");
      })
      .catch(async (error) => {
        alert(error);
      });
  } else if (this.authMethod.value == 2) {
    generateQR(username, 2, "web");
  } else if (this.authMethod.value == 3) {
    generateQR(username, 2, "app");
    $("#loginModal").modal("show");
  }
};

const generateQR = async (username, type, platform = "web") => {
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
    };
    //console.log(userDetails);

    fido
      .generateQR(userDetails)
      .then(async (response) => {
        //console.log(response);
        qrImg.src = response.url;

        console.log({ accessToken: response.accessToken });

        if (type === 2) $("#loginModal").modal("show");
        else $("#RegisterModal").modal("show");

        console.log(userDetails);

        const transactionResponse = await fido.getTransactionStatusOnChange(
          userDetails.id
        );
        if (transactionResponse.status == "SUCCESS") {
          console.log("transaction success");
          if (type == 1) window.location.href = "/register-success";
          else if (type == 2) window.location.href = "/login-success";
          else if (type == 3) window.location.href = "/addDeviceSuccess";
        } else {
          console.log("Something went wrong");
        }
      })
      .catch((error) => alert(error));
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
    fido
      .addDevice(username)
      .then(async (response) => {
        if (response.verified) {
          await AddToAudit(response.userId, 3, "success");

          alert("new device added successfully");
        } else await AddToAudit(response.userId, 3, "error");
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

const AddToAudit = async (userId, type, label) => {
  const ispAPI = await fetch("https://ipapi.co/json");

  const data = await ispAPI.json();
  const ua = detect.parse(navigator.userAgent);
  data.time = new Date();
  (data.browser = ua.browser.name), (data.device = ua.os.name);
  data.label = label;
  fido.Audit({ userId, data, type });
};

const approveRegister = () => {
  const { username, id } = document.getElementById("auth-data").dataset;
  fido
    .register({ username, id })
    .then(async (response) => {
      console.log(response);
      if (response.verified) {
        await AddToAudit(response.userId, 1, "success");
        window.location.href = "/register-success";
      } else await AddToAudit(response.userId, 1, "error");
    })
    .catch(async (error) => {
      alert(error);
    });
};

const approveLogin = () => {
  const { username, id } = document.getElementById("auth-data").dataset;
  console.log(username, id);
  document.getElementById("auth-data");
  fido
    .login({ username, id })
    .then(async (response) => {
      console.log("loginResponse", response);
      if (response.verified) {
        await AddToAudit(response.userId, 2, "success");
        window.location.href = "/login-success";
      } else await AddToAudit(response.userId, 2, "error");
    })
    .catch(async (error) => {
      alert(error);
    });
};

const declineProcess = (process) => {
  window.close();
};

const approveDevice = (username, id) => {
  fido
    .addDevice({ username, id })
    .then(async (response) => {
      console.log(response);
      if (response.verified) {
        await AddToAudit(response.userId, 3, "success");
        alert("device added successfully");
        window.close();
      } else await AddToAudit(response.userId, 3, "error");
    })
    .catch(async (error) => {
      alert(error);
    });
};
