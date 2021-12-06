const fido = new passwordless("BASE_URL", "CLIENT_ID");

const approveRegister = (username, id) => {
  fido
    .register({ username, id })
    .then(async (response) => {
      console.log(response);
      if (response.verified) {
        await AddToAudit(response.userId, 1, "success");
        window.location.href = "/registerSuccess";
      } else await AddToAudit(response.userId, 1, "error");
    })
    .catch(async (error) => {
      alert(error);
    });
};

const approveLogin = (username, id) => {
  fido
    .login({ username, id })
    .then(async (response) => {
      console.log("loginResponse", response);
      if (response.verified) {
        await AddToAudit(response.userId, 2, "success");
        window.location.href = "/success";
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

const AddToAudit = async (userId, type, label) => {
  const ispAPI = await fetch("https://ipapi.co/json");

  const data = await ispAPI.json();
  const ua = detect.parse(navigator.userAgent);
  data.time = new Date();
  (data.browser = ua.browser.name), (data.device = ua.os.name);
  data.label = label;
  fido.Audit({ userId, data, type });
};
