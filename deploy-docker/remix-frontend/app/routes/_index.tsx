/* eslint-disable @typescript-eslint/no-unused-vars */
import { MetaFunction, redirect } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import { Divider, Menu, MenuProps } from "antd";
import { useRef, useState } from "react";

export const meta: MetaFunction = () => {
  return [
    { title: "Fuck" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export const loader = async () => redirect('/user');