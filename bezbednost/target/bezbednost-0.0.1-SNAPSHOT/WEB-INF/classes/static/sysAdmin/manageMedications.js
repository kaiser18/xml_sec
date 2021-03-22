new Vue({
  el: "#manageMedications",
  data: {
    name: "",
    type: "",
    form: "",
    contraindications: "",
    composition: "",
    recommendedIntakePerDay: "",
    manufacturer: "",
    forms: [],
    types: [],
    medicines: [],
    substitutes: []
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
    async createMedicine() {
      try {
        await axios.post(
          "/api/medicine",
          {
            name: this.name,
            type: this.type,
            form: this.form,
            contraindications: this.contraindications,
            composition: this.composition,
            recommendedIntakePerDay: this.recommendedIntakePerDay,
            substitutes: this.substitutes,
            manufacturer: this.manufacturer
          },
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("access_token")
            }
          }
        );
        alert("Successfully added new drug");
      } catch (error) {
        console.log(error);
      }
    }
  },
  async created() {
    try {
      let resp = await axios.get("/api/medicine/types", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("access_token")
        }
      });
      this.types = resp.data;
      resp = await axios.get("/api/medicine/forms", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("access_token")
        }
      });
      this.forms = resp.data;
      resp = await axios.get("/api/medicine/findAllMedicine", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("access_token")
        }
      });
      this.medicines = resp.data;
    } catch (err) {
      console.log(err);
    }
  }
});
