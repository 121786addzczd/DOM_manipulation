/**
 * @function orderList
 * @description ページ内のすべての ".order" クラス要素に対して、
 *              0から9までの数字を選択するためのドロップダウンメニューを作成する。
 */
function orderList() {
  const orderElements = Array.from(document.getElementsByClassName("order"));
  
  orderElements.forEach((orderElement, i) => {
    let options = "";
    for (let j = 0; j < 10; j++) {
      options += `<option>${j}</option>`;
    }
    const bgColor = i % 2 == 0 ? 'bg-gray-100' : 'bg-gray-200';
    const selectHtml = `
      <select id="select${i}" class="${bgColor} border rounded px-2 py-1">
        ${options}
      </select>
    `;
    orderElement.innerHTML = selectHtml;

    const selectElement = document.getElementById(`select${i}`);
    selectElement.addEventListener("change", calcTotalAmount);
  });
}

/**
 * @function calcTotalAmount
 * @description 注文されたアイテムの合計金額を計算し、表示する。
 */
function calcTotalAmount() {
  // 各要素を取得
  const shopTableElement = document.getElementById("shop-table");
  const orderElements = Array.from(document.getElementsByClassName("order"));
  const totalElement = document.getElementById("total-price");

  let totalPrice = 0;

  // 注文数ごとに処理を行う
  orderElements.forEach((_, index) => {
    const orderInput = document.forms[0].elements[index];
    const orderCount = orderInput.value;
    const itemPrice = shopTableElement.rows[index + 1].cells[2].innerText;  // 商品の価格を取得
    const priceElement = document.getElementById(`price${index}`);   // 金額を表示する要素を取得

    // 注文数が0より大きい場合の処理
    if (orderCount > 0) {
      const amount = orderCount * itemPrice;  // 金額を計算
      priceElement.innerHTML = amount;        // 金額を表示
      totalPrice += amount;                   // 合計金額を更新
    } else {
      priceElement.innerHTML = "";            // 金額表示をクリア
    }
  });

  // 注文数ごとの処理が終わったら合計額表示
  if (totalPrice > 0) {
    totalPrice = Number(totalPrice).toLocaleString();
    totalElement.innerHTML = `￥${totalPrice}`;
    totalElement.style.textDecoration = "underline";
  } else {
    totalElement.innerHTML = "";
    totalElement.style.textDecoration = "none";
  }
}
