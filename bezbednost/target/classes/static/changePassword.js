var app = new Vue({
  el: "#changePass",
  data: {
    changePass: false,
    changeData: false,
    oldPass: "",
    newPass: "",
    repeatPass: "",
    info: null,
    role: null,
    user: null
  },
  methods: {
    changeState() {
      if (this.user.username == this.newPass) {
        JSAlert.alert("Password must not be the same as the username!");
      } else if (this.newPass == this.repeatPass) {
        axios
          .post(
            "/auth/change-password",
            {
              oldPassword: this.oldPass,
              newPassword: this.newPass
            },
            {
              headers: {
                Authorization: "Bearer " + localStorage.getItem("access_token"),
                "Content-Type": "application/json"
              }
            }
          )
          .then((response) => {
            this.info = response.data;
            if (this.info.result == "success") {
              JSAlert.alert("You have successfully updated your password!");
              localStorage.clear();
              setTimeout(function () {
                window.location.href = "/login.html";
              }, 3000);
            }
          })
          .catch((error) => {
            console.log(error);
            if (error.response.status == 401 || error.response.status == 400) {
              JSAlert.alert("You haven't entered the correct old password!");
            }
          });
      } else {
        JSAlert.alert("New password and confirmed password are not the same!");
      }
    }
  },
  created() {
    axios
      .get("/auth/getRole", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("access_token")
        }
      })
      .then((response) => {
        this.user = JSON.parse(localStorage.getItem("user"));
        this.role = response.data;
        if (
          response.data != "ADMIN" &&
          response.data != "DERM" &&
          response.data != "PHARM" &&
          response.data != "SYS_ADMIN" &&
          response.data != "SUPL"
        ) {
          localStorage.clear();
          window.location.href = "/login.html";
        }
        if (this.role == "ADMIN") {
          axios
            .get("/api/pharmacyAdmin/getLoggedUser", {
              headers: {
                Authorization: "Bearer " + localStorage.getItem("access_token")
              }
            })
            .then((response) => {
              this.user = response.data;
            });
        } else if (this.role == "DERM") {
          axios
            .get("/api/dermatologist/getLoggedUser", {
              headers: {
                Authorization: "Bearer " + localStorage.getItem("access_token")
              }
            })
            .then((response) => {
              this.user = response.data;
            });
        } else if (this.role == "PHARM") {
          axios
            .get("/api/pharmacist/getLoggedUser", {
              headers: {
                Authorization: "Bearer " + localStorage.getItem("access_token")
              }
            })
            .then((response) => {
              this.user = response.data;
            });
        }
      })
      .catch(function () {
        window.location.href = "/login.html";
      });
  }
});
