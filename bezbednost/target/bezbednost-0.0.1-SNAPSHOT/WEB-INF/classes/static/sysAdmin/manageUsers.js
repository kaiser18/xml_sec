new Vue({
  el: "#manageUsers",
  data: {
    firstName: "",
    lastName: "",
    email: "",
    email: "",
    password: "",
    phonenumber: "",
    city: "",
    country: "",
    addressString: "",
    countryOptions: [],
    cityOptions: [],
    selectedUserType: "ROLE_SYS_ADMIN"
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
    async createUser() {
      const user = {
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        username: this.email,
        password: this.password,
        phonenumber: this.phonenumber,
        cityId: this.city.id,
        stateId: this.city.country.id,
        addressString: this.addressString
      };
      try {
        switch (this.selectedUserType) {
          case "ROLE_SYS_ADMIN":
            await axios.post("/api/sys-admin", user, {
              headers: {
                Authorization: "Bearer " + localStorage.getItem("access_token")
              }
            });
            break;
          case "ROLE_DERM":
            await axios.post("/api/sys-admin/derm", user, {
              headers: {
                Authorization: "Bearer " + localStorage.getItem("access_token")
              }
            });
            break;
          case "ROLE_SUPL":
            await axios.post("/api/sys-admin/suppl", user, {
              headers: {
                Authorization: "Bearer " + localStorage.getItem("access_token")
              }
            });
            break;
        }
        alert("User successfully created.");
        this.firstName = "";
        this.lastName = "";
        this.email = "";
        this.email = "";
        this.password = "";
        this.phonenumber = "";
        this.city = "";
        this.country = "";
        this.addressString = "";
      } catch (err) {
        console.log(err);
        alert("User with given email already exists.");
      }
    }
  },
  async created() {
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
    const res = await axios.get("/api/country/getAllCountries");
    this.countryOptions = res.data;
  },
  watch: {
    country: async function (country) {
      this.cityOptions = "";
      const { data } = await axios.get("/api/city/getAllCitiesForCountry", {
        params: {
          id: country.id
        }
      });
      this.cityOptions = data;
    }
  }
});
