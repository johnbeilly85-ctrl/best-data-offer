
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    console.log("========== STK PUSH SUCCESS ==========");
    console.log(response.data);
    console.log("======================================");

    return true;
  } catch (error) {
    console.log("========== STK PUSH ERROR ==========");
    console.log("HTTP Status:", error.response?.status);
    console.log("Response Data:", error.response?.data);
    console.log("Message:", error.message);

    if (error.response?.config?.data) {
      console.log("Request Body Sent:");
      console.log(error.response.config.data)
