var app = new Vue({
  el: "#verification",
  data: {
    loading: true,
    verified: false
  },
  methods: {},
  async created() {
    // axios
    // 	.get('/api/pharmacy')
    // 	.then(response => {
    // 		this.pharmacies = response.data
    // 	})

    const verificationParams = window.location.href.split("?")[1].split("&");
    try {
      this.verified = await axios.post("/auth/verify", {
        userId: verificationParams[0].split("=")[1],
        hash: verificationParams[1].split("=")[1]
      });
      this.loading = false;
    } catch (err) {
      this.verified = false;
      this.loading = false;
    }
    console.log(this.loading, this.verified);
  }
});
