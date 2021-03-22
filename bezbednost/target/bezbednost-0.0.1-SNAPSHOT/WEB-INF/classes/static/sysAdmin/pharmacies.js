new Vue({
  el: "#pharmacies",
  data: {
    pharmacies: [],
    showAddPharmacyForm: false,
    showAddPharmacyAdminForm: false,
    name: "",
    address: "",
    city: "",
    pharmacySelected: false,
    pharmacyAdmins: [],
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    phonenumber: "",
    addressString: "",
    country: "",
    city: "",
    countryOptions: [],
    cityOptions: []
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
    async submit() {
      try {
        await axios.post(
          "/api/pharmacy",
          { name: this.name, address: this.address, city: this.city },
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("access_token")
            }
          }
        );
        alert("Successfully added new pharmacy");
        this.showAddPharmacyForm = false;
        const { data } = await axios.get("/api/pharmacy/findAll", {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("access_token")
          }
        });
        this.pharmacies = data;
      } catch (err) {
        alert("Pharmacy with given name or address already exist");
      }
    },
    async createPharmacyAdmin() {
      try {
        await axios.post(
          "/api/pharmacyAdmin",
          {
            firstName: this.firstName,
            lastName: this.lastName,
            email: this.email,
            username: this.email,
            password: this.password,
            phonenumber: this.phonenumber,
            cityId: this.city.id,
            stateId: this.city.country.id,
            addressString: this.addressString,
            pharmacyId: this.pharmacySelected
          },
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("access_token")
            }
          }
        );

        const { data } = await axios.get(
          `/api/pharmacy/${this.pharmacySelected}/admins`,
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("access_token")
            }
          }
        );
        this.pharmacyAdmins = data;
        alert("Successfully added new pharmacy admin");
        this.showAddPharmacyAdminForm = false;
        this.firstName = "";
        this.lastName = "";
        this.email = "";
        this.password = "";
        this.phonenumber = "";
        this.city = "";
        this.country = "";
        this.addressString = "";
      } catch (err) {
        alert("Pharmacy admin with given email already exists");
      }
    }
  },
  async created() {
    try {
      const { data } = await axios.get("/api/pharmacy/findAll", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("access_token")
        }
      });
      this.pharmacies = data;
      const res = await axios.get("/api/country/getAllCountries");
      this.countryOptions = res.data;
    } catch (err) {
      window.location.href = "/login.html";
      console.log(err);
    }
  },
  watch: {
    showAddPharmacyForm() {
      this.name = "";
      this.address = "";
    },
    async pharmacySelected() {
      if (this.pharmacySelected) {
        const { data } = await axios.get(
          `/api/pharmacy/${this.pharmacySelected}/admins`,
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("access_token")
            }
          }
        );
        this.pharmacyAdmins = data;
      }
    },
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
