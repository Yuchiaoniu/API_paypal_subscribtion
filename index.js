const path = require('path');
const express = require('express');
const fs = require('fs');
const { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET, PORT = 3000 } = process.env;
const base = "https://api-m.sandbox.paypal.com";
const app = express();
const viewsDirectory = path.join(__dirname, 'gmrhpyd/server/views');
require('dotenv/config');
import('node-fetch').then(fetch => {
  const generateAccessToken = async () => {
    try {
      if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
        throw new Error("MISSING_API_CREDENTIALS");
      }
      const auth = Buffer.from(
        PAYPAL_CLIENT_ID + ":" + PAYPAL_CLIENT_SECRET,
      ).toString("base64");
      const response = await fetch(`${base}/v1/oauth2/token`, {
        method: "POST",
        body: "grant_type=client_credentials",
        headers: {
          Authorization: `Basic ${auth}`,
        },
      });

      const data = await response.json();
      return data.access_token;
    } catch (error) {
      console.error("Failed to generate Access Token:", error);
    }
  };

  async function handleResponse(response) {
    try {
      const jsonResponse = await response.json();
      return {
        jsonResponse,
        httpStatusCode: response.status,
      };
    } catch (err) {
      const errorMessage = await response.text();
      throw new Error(errorMessage);
    }
  }

  app.post("/api/orders", async (req, res) => {
    try {
      // use the cart information passed from the front-end to calculate the order amount detals
      const { cart } = req.body;
      // Add your custom_id here
      const custom_id = fileContent;  // Use fileContent as custom_id

      const { jsonResponse, httpStatusCode } = await createOrder(cart, custom_id);
      res.status(httpStatusCode).json(jsonResponse);
    } catch (error) {
      console.error("Failed to create order:", error);
      res.status(500).json({ error: "Failed to create order." });
    }
  });

  app.post("/api/orders/:orderID/capture", async (req, res) => {
    try {
      const { orderID } = req.params;
      const { jsonResponse, httpStatusCode } = await captureOrder(orderID);
      res.status(httpStatusCode).json(jsonResponse);
    } catch (error) {
      console.error("Failed to create order:", error);
      res.status(500).json({ error: "Failed to capture order." });
    }
  });
});


app.set("view engine", "ejs");
app.set('views', viewsDirectory);
app.use(express.static(viewsDirectory));
app.use(express.json());
// render checkout page with client id & unique client token

app.get("/checkout", async (req, res) => {
  try {
    var email = req.query.email; // 從查詢參數中獲取email
    // 將email寫入到一個.txt文件中
    fs.writeFileSync(`${email}.txt`, email);
    if (req.headers.referer === 'http://localhost/wbloom-2/index.html') {
      // 如果是，則將email寫入到一個.txt文件中
      fs.writeFileSync(`${email}.txt`, email);
    }
    // 建立文件的路徑
    var filePath = path.join(__dirname, `${email}.txt`);

    // 讀取文件的內容
    var fileContent = fs.readFileSync(filePath, 'utf8');
    res.render("checkout.ejs", {
      clientId: PAYPAL_CLIENT_ID,
      email: email,
      fileContent: fileContent  // 將文件內容傳遞給EJS模板
    });
  } catch (err) {
    res.status(500).send(err.message);
  }
});
app.listen(PORT, () => {
  console.log(`Node server listening at http://localhost:${PORT}/`);
});