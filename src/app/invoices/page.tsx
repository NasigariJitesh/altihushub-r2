"use client";

import Table from "@/components/table";
import { Button } from "@mui/material";
import React from "react";

const Invoices = () => {
	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
			}}>
			<div
				style={{
					display: "flex",
					flexDirection: "row",
					justifyContent: "space-between",
				}}>
				<h4>Invoices</h4>

				<Button
					style={{
						height: 40,
					}}
					variant='contained'
					href='/invoices/create'>
					Add
				</Button>
			</div>
			<Table />
		</div>
	);
};

export default Invoices;
