var app = new Vue({
  el: "#sysAdminProfile",
  data: {
    user: null,
    changeData: false,
    oldPass: "",
    newPass: "",
    repeatPass: "",
    countries: null,
    cities: null,
    addresses: null,
    idCountry: 0,
    idCity: 0,
    idAddress: 0
  },
  methods: {
    logout() {
      axios
        .post("/auth/logout", null, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("access_token")
          }
        })
        .then(function () {
          localStorage.clear();
          window.location.href = "/login.html";
        });
    },
    changeState() {
      window.location.href = "/changePassword.html";
    },
    discardPassCh() {
      this.changePass = false;
      this.oldPass = "";
      this.newPass = "";
      this.repeatPass = "";
    },
    chData() {
      if (this.changeData == true) {
        this.changeData = false;
        //axios za izmenu podataka
        const user = {
          ...this.user,
          address: {
            ...this.user.address,
            city: {
              ...this.cities.find((c) => this.selectedCity.id === c.id)
            }
          }
        };

        axios
          .put(
            "/api/sys-admin",
            {
              ...this.user,
              address: this.user.address.street,
              cityId: this.selectedCity.id,
              stateId: this.selectedCountry.id,
              firstname: this.user.firstName,
              lastname: this.user.lastName
            },
            {
              headers: {
                Authorization: "Bearer " + localStorage.getItem("access_token")
              }
            }
          )
          .then((response) => {
            localStorage.setItem("user", JSON.stringify(user));
            this.user = user;
            alert(
              "Novo ime: " +
                this.user.firstName +
                "\nNovo prezime: " +
                this.user.lastName +
                "\nNov email: " +
                this.user.email
            );
          });
      } else {
        this.changeData = true;
      }
    },
    discardDataCh() {
      this.user = JSON.parse(localStorage.getItem("user"));
      this.changeData = false;
    },
    findCity() {
      axios
        .get("/api/city/getAllCitiesForCountry", {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("access_token")
          },
          params: {
            id: this.selectedCountry.id
          }
        })
        .then((response) => {
          this.cities = response.data;
        });
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
        if (response.data != "SYS_ADMIN") {
          window.location.href = "/login.html";
        }
      })
      .catch(function () {
        window.location.href = "/login.html";
      });
    const user = JSON.parse(localStorage.getItem("user"));
    this.user = user;
    this.selectedCity = user.address.city.id;
    this.selectedCountry = user.address.city.country.id;
    axios
      .get("/api/country/getAllCountries", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("access_token")
        }
      })
      .then((response) => {
        this.countries = response.data;

        axios
          .get("/api/city/getAllCitiesForCountry", {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("access_token")
            },
            params: {
              id: user.address.city.country.id
            }
          })
          .then((response) => {
            this.cities = response.data;
          });
      });
  }
});
