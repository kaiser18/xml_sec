var app = new Vue({
  el: "#offers",
  data: {
    filterTypes: ["ALL", "APPROVED", "PENDING", "REFUSED"],
    offers: [],
    errands: [],
    allOffers: [],
    offersTab: true,
    errandPreview: null,
    offerEdit: null,
    stock: [],
    invalidOffer: true,
    supplyDeadline: "",
    price: 1,
    filter: "ALL"
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
    findErrandIndex(id) {
      let ind = false;
      this.errands.forEach((er, i) => {
        if (id === er.id) ind = i;
      });

      return ind;
    },
    async checkRole() {
      axios
        .get("/auth/getRole", {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("access_token")
          }
        })
        .then((response) => {
          if (response.data != "SUPL") {
            window.location.href = "/login.html";
          }
        })
        .catch(function () {
          window.location.href = "/login.html";
        });
    },
    findStockQuantity(id) {
      const medicine = this.stock.find((s) => s.medicineId === id);
      return medicine ? medicine.quantity : 0;
    },
    async submit() {
      try {
        await axios.post(
          "/api/offer",
          {
            errandId: this.errands[this.errandPreview].id,
            price: this.price,
            supplyDeadline: this.supplyDeadline
          },
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("access_token")
            }
          }
        );
        alert("Successfully created new offer");
        this.errandPreview = null;
        this.price = 1;
        this.supplyDeadline = "";
        const offers = await axios.get("/api/offer", {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("access_token")
          }
        });
        this.offers = offers.data;
      } catch (err) {
        alert(err);
      }
    },
    offerExists() {
      return this.offers.some(
        (o) => o.errandId === this.errands[this.errandPreview].id
      );
    }
  },
  async created() {
    await this.checkRole();
    const errands = await axios.get("/api/offer/erands", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token")
      }
    });
    this.errands = errands.data;
    const offers = await axios.get("/api/offer", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token")
      }
    });
    this.offers = offers.data;
    this.allOffers = offers.data;
    const stock = await axios.get("/api/offer/stock", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token")
      }
    });
    this.stock = stock.data;
  },
  watch: {
    errandPreview() {
      try {
        if (this.errandPreview !== null) {
          this.invalidOffer = this.errands[
            this.errandPreview
          ].medicineQuantity.some((e) => {
            const med = this.stock.find((s) => s.medicineId === e.medicineId);
            if (!med) return true;
            return e.quantity > med.quantity;
          });
          const offer = this.offers.find(
            (o) => o.errandId === this.errands[this.errandPreview].id
          );
          if (offer) {
            this.supplyDeadline = offer.supplyDeadline;
            this.price = offer.price;
          }
        }
      } catch (err) {
        console.log(err);
      }
    },
    async filter() {
      let filterBy;
      switch (this.filter) {
        case "ALL":
          filterBy = "nothing";
          break;
        case "APPROVED":
          filterBy = true;
          break;
        case "PENDING":
          filterBy = null;
          break;
        case "REFUSED":
          filterBy = false;
          break;
      }
      console.log(this.allOffers);
      this.offers = this.allOffers.filter((offer) =>
        filterBy === "nothing" ? true : offer.approved === filterBy
      );
    }
  }
});
