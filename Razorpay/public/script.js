
const handlePayment = async () => {

    const amount = document.querySelector("#amount").value;

    // destructuring response.data from the backend
    const { data } = await axios.post("http://localhost:3000/razorpay", {
        amount: amount * 100
    });

    const order = data.order;

    const options = {
        key: process.env.RAZORPAY_KEY_ID || "rzp_test_Rp4UfVRvSGNvh0",
        amount: order.amount,
        name: "Flash Razorpay payment test",
        description: "Test Transaction",
        order_id: order.id,

        handler: async function (response) {
            const paymentId = response.razorpay_payment_id;
            const orderId = response.razorpay_order_id;
            const signature = response.razorpay_signature;

            const { data } = await axios.post("http://localhost:3000/verify", {
                paymentId, orderId, signature
            });

            alert(data.msg);
        },

        // prefill details (/login details of the user)
        prefill: {
            name: 'Flash',
            email: 'flash@example.com',
            contact: '9999999999',
        },
        theme: { color: '#3399cc' },
    };

    const rzp = new Razorpay(options);
    rzp.open();

}
