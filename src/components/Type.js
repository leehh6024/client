import React, { useContext, useEffect, useState } from "react";
import axios from "react";
import ErrorBanner from "./ErrorBanner.js";
import { OrderContext } from "../context/OrderContext.js";
import Products from "./Products.js";
// import Options from "./Options.js";

const Type = ({ orderType }) => {
	// console.log("orderType", orderType);
	const [items, setItems] = useState([]);
	const [error, setError] = useState(false);
	const [orderData, updateItemCount] = useContext(OrderContext);

	console.log("orderData", orderData.totals);

	useEffect(() => {
		loadItems(orderType);
	}, [orderType]);

	const loadItems = async (orderType) => {
		// 현재 Server 없음, 서버 실행 후 정상작동 확인할 것
		try {
			const response = await axios.get(`https://localhost:4000/${orderType}`);
			setItems(response.data);
			console.log("response.data ===> ", response.data);
		} catch (error) {
			setError(true);
		}
	};

	const ItemComponent = orderType === "products" ? Products : null;

	const optionItems = items.map((item) => (
		<ItemComponent
			key={item.name}
			name={item.name}
			imagePath={item.imagePath}
			updateItemCount={(itemName, newItemCount) =>
				updateItemCount(itemName, newItemCount, orderType)
			}
		/>
	));
	if (error) {
		return <ErrorBanner message="에러가 발생했습니다." />;
	}

	return (
		<div>
			<h2>주문 종류</h2>
			<p>하나의 가격</p>
			<p>총 가격: {orderData.totals[orderType]}</p>
			<div
				style={{
					display: "flex",
					flexDirection: orderType === "options" ? "column" : "row"
				}}
			>
				{optionItems}
			</div>
		</div>
	);
};

export default Type;
