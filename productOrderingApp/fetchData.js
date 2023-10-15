// jsonファイルをAPIの代わりとしている
const SHOP_JSON_URL = "shop.json";
let shopDataCache = null;

/**
 * @function populateShopDropdown
 * @description ドロップダウンリストを動的に生成する
 * @param {Object} data - ショップのデータ
 */
function populateShopDropdown(data) {
  const shopList = document.getElementById("shop-list");

  while (shopList.options.length > 1) {
    shopList.remove(1);
  }

  for (let shopName in data) {
    const optionElement = document.createElement("option");
    optionElement.value = shopName;
    optionElement.textContent = shopName;
    shopList.appendChild(optionElement);
  }
}

/**
 * @function fetchAndCacheShopData
 * @description jsonからデータを取得してキャッシュする
 */
fetch(SHOP_JSON_URL)
  .then(response => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  })
  .then(data => {
    shopDataCache = data;
    populateShopDropdown(data);
  })
  .catch(error => {
    console.error("データ取得エラー: ", error);
  });

/**
 * @function handleShopListChange
 * @description ショップリストの変更イベントハンドラ。選択された店舗の情報を表示する
 * @param {Event} event - 発火したイベントオブジェクト
 */
function handleShopListChange(event) {
  const shopName = event.target.value;
  removeExistingShopForm();

  if (shopName && shopDataCache) {
    displayShopArea(shopDataCache[shopName]);
  }
}

const shopListElement = document.getElementById("shop-list");
shopListElement.addEventListener("change", handleShopListChange);

/**
 * @function removeExistingShopForm
 * @description 既存のショップフォームを削除する
 */
function removeExistingShopForm() {
  const shopFormElement = document.getElementById("shop-form");
  if (shopFormElement) {
    shopFormElement.remove();
  }
}

/**
 * @function displayShopArea
 * @description ショップエリアを表示する
 * @param {Array} shopInfo - 店舗の商品情報リスト
 */
function displayShopArea(shopInfo) {
  const shopAreaElement = document.getElementById("shop-area");

  const rowsHtml = shopInfo.map((row, index) => `
    <tr class="${index % 2 == 0 ? 'bg-gray-100' : 'bg-gray-200'}">
      <td class="border-b border-gray-200 px-4 py-2">${row["id"]}</td>
      <td class="border-b border-gray-200 px-4 py-2">${row["name"]}</td>
      <td class="border-b border-gray-200 px-4 py-2">${row["price"]}</td>
      <td class="border-b border-gray-200 px-4 py-2 order"></td>
      <td class="border-b border-gray-200 px-4 py-2 text-red-500" id="price${index}"></td>
    </tr>
  `).join('');

  const shopHtml = `
      <form action="List.html" id="shop-form">
        <table class="min-w-full border border-gray-300 mt-4" id="shop-table">
          <thead>
            <tr>
              <th class="border-b border-gray-300 bg-green-100 px-4 py-2 text-left">商品ID</th>
              <th class="border-b border-gray-300 bg-green-100 px-4 py-2 text-left">商品名</th>
              <th class="border-b border-gray-300 bg-green-100 px-4 py-2 text-left">値段(円)</th>
              <th class="border-b border-gray-300 bg-green-100 px-4 py-2 text-left">注文数</th>
              <th class="border-b border-gray-300 bg-green-100 px-4 py-2 text-left">金額(円)</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>
        <div class="mt-4 text-red-500" id="total-price"></div>
        <button type="submit" class="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline-blue">送信する</button>
      </form>
    `;

  shopAreaElement.innerHTML = shopHtml;
  orderList();
}
