new Vue({
  el: "#register",
  data: {
    username: "",
    email: "",
    password: "",
    confirmedPassword: "",
    address: "",
    city: "",
    country: "",
    validationErrors: {},
    isFormValid: false,
    country: "",
    city: "",
    countryOptions: [],
    cityOptions: [],
    address: "",
    firstname: "",
    lastname: "",
    successReg: false,
    loading: false
  },
  async created() {
    const { data } = await axios.get("/api/country/getAllCountries");
    this.countryOptions = data;
  },
  methods: {
    validateForm() {
      this.validationErrors = {};
      this.isFormValid = true;
      this.validateUsername();
      this.validateEmail();
      this.validatePassword();
      this.validateAddress();
      this.validateFirstAndLast();
      this.checkRequiredFileds();
    },
    validateUsername() {
      if (this.username.match(REGEX.STARTS_WITH_SPACE)) {
        this.validationErrors = {
          username: "Username can't start with space."
        };
        this.isFormValid = false;
      }
    },
    validateEmail() {
      if (this.email && !this.email.match(REGEX.EMAIL_REGEX)) {
        this.validationErrors = {
          email: "Email must have valid email format."
        };
        this.isFormValid = false;
      }
      if (this.email.match(REGEX.STARTS_WITH_SPACE)) {
        this.validationErrors = {
          email: "Email can't start with space."
        };
        this.isFormValid = false;
      }
    },
    validatePassword() {
      if (this.password.match(REGEX.STARTS_WITH_SPACE)) {
        this.validationErrors = {
          ...this.validationErrors,
          password: "Password can't start with space."
        };
        this.isFormValid = false;
      }
      if (this.password !== this.confirmedPassword && this.confirmedPassword) {
        this.validationErrors = {
          ...this.validationErrors,
          confirmedPassword: "Confirmed password must match password."
        };
        this.isFormValid = false;
      }
      if (this.password && this.password.length < 6) {
        this.validationErrors = {
          ...this.validationErrors,
          password: "Password min length is 6 characters."
        };
        this.isFormValid = false;
      }
    },
    checkRequiredFileds() {
      if (
        !this.username ||
        !this.password ||
        !this.email ||
        !this.confirmedPassword ||
        !this.country ||
        !this.city ||
        !this.address ||
        !this.firstname ||
        !this.lastname
      ) {
        this.isFormValid = false;
      }
    },
    validateAddress() {
      if (this.address.match(REGEX.STARTS_WITH_SPACE)) {
        this.validationErrors = {
          ...this.validationErrors,
          address: "Address can't start with space."
        };
        this.isFormValid = false;
      }
    },
    validateFirstAndLast() {
      if (this.firstname.match(REGEX.STARTS_WITH_SPACE)) {
        this.validationErrors = {
          ...this.validationErrors,
          firstname: "Firstname can't start with space."
        };
        this.isFormValid = false;
      }
      if (this.lastname.match(REGEX.STARTS_WITH_SPACE)) {
        this.validationErrors = {
          ...this.validationErrors,
          lastname: "Lastname can't start with space."
        };
        this.isFormValid = false;
      }
    },
    async submit() {
      try {
        this.loading = true;
        await axios.post("/auth/signup", {
          email: this.email.trim(),
          password: this.password,
          stateId: this.country.id,
          cityId: this.city.id,
          address: this.address.trim(),
          firstname: this.firstname.trim(),
          lastname: this.lastname.trim(),
          username: this.username.trim()
        });
        this.successReg = true;
        this.loading = false;
        JSAlert.alert(
          "You registered successfully. Verify your account on your email!"
        );
      } catch (err) {
        this.loading = false;
        this.successReg = false;
        this.validationErrors = {
          email: "Email is already in use."
        };
        this.isFormValid = false;
        JSAlert.alert("Email already in use!");
      }
    }
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
