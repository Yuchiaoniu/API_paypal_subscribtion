paypal訂閱方案的api

以下為自訂內容:
在根目錄的index.js接收網頁傳送的get值
var email = req.query.email; // 從查詢參數中獲取email
var brandName = req.query.brandName; // 從查詢參數中獲取brandName
var iftest = req.query.mode; //從查詢參數中確定是要進入正式模式還是測試模式

在checkout.ejs中結帳後利用表單post變數
form.appendChild(inputBrandName);
form.appendChild(inputEmail);
form.appendChild(inputSubscriptionID);
