import React, { useState } from "react";
import type { FormProps } from "antd";
import { Button, Flex, Form, Input, notification } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { COOKIE_NAME, SIGN_IN_LINK, TRIPS_LINK } from "../../utils/constants";
import Logo from "../../components/logo";
import axios from "axios";
import Cookies from "js-cookie";
import { useMutation } from "@tanstack/react-query";
import { API_URL, CLIENT_ID, CLIENT_SECRETS } from "../../utils/configs";

type FieldType = {
  email?: string;
  password?: string;
};

const loginUser = async ({ email, password }: FieldType) => {
  const response = await axios.post(`${API_URL}/o/token/`, new URLSearchParams({
      grant_type: "password",
      username: email as string,
      password: password as string,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRETS,
  }));

  const { access_token, expires_in } = response.data;

  Cookies.set(COOKIE_NAME, access_token, {
      expires: expires_in / 3600 / 8,
      domain: window.location.hostname.includes("localhost") ? undefined : `.${window.location.hostname}`,
      secure: true,
      sameSite: "Strict",
  });

  return response.data;
};

export const Login: React.FC = () => {
  const [api, contextHolder] = notification.useNotification();
  const [posting, setPosting] = useState(false);
  const navigate = useNavigate()

  const mutation = useMutation({
    mutationFn: async (formData: FieldType) => {
      const response = loginUser(formData)
      return response;
    },
    onSuccess: () => {
      api.success({message: 'Login successfull' })
      setPosting(false)
      navigate(`${TRIPS_LINK}/2`)
    },
    onError: () => {
      setPosting(false)
    },
  });

  const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (errorInfo) => {
    api.error({message: 'Login failed', description: JSON.stringify(errorInfo) })
  };

  const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
    setPosting(true)
    mutation.mutate(values)
  };

  return (
    <div className="form-item-center">
      {contextHolder}
      <div className="form-raised">
            <Flex justify="center" align="center">
                <div>
                    <Logo nameColor="black"/>
                    <br/> <br/>
                    <h3>Sign in to your account</h3>
                </div>
            </Flex>
            <br/>
          <Form
            name="basic"
            layout="vertical"
            style={{ width: "100%" }}
            initialValues={{ email: "truct_test@gmail.com", password: "truck_test", remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item<FieldType>
              name="email"
              label="Email"
              rules={[{ type: "email", required: true, message: "Email is not valid!" }]}
            >
              <Input autoComplete="off" autoSave="off" />
            </Form.Item>

            <Form.Item<FieldType>
              label="Password"
              name="password"
              rules={[{ required: true, message: "Please input your password!" }]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item>
              <Button disabled={posting} type="primary" htmlType="submit" className="default-btn" block>
                {posting ? "Submiting..." : "Submit"}
              </Button>
            </Form.Item>
            <Link to={SIGN_IN_LINK} className="main-text"> Don't have an accoun? Register</Link>
          </Form>
      </div>
    </div>
  );
};
