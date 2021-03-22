var app = new Vue({
  el: "#promotions",
  data: {
    pharmacies: []
  },
  methods: {
    async checkRole() {
      axios
        .get("/auth/getRole", {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("access_token")
          }
        })
        .then((response) => {
          this.role = response.data;
          if (response.data != "PATIENT") {
            window.location.href = "/login.html";
          }
        })
        .catch(function () {
          window.location.href = "/login.html";
        });
    },
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
    async unsubscribe(id) {
      await axios.post("/api/promotion/unsubscribe", id, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("access_token"),
          "Content-Type": "application/json"
        }
      });
      const { data } = await axios.get("/api/promotion", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("access_token")
        }
      });
      this.pharmacies = data;
    }
  },
  async created() {
    await this.checkRole();

    try {
      const { data } = await axios.get("/api/promotion", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("access_token")
        }
      });

      this.pharmacies = data;
    } catch (err) {
      console.log(err);
    }
  }
});
