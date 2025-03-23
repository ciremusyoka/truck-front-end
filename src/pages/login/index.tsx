import React from "react";
import type { FormProps } from "antd";
import { Button, Flex, Form, Input } from "antd";
import { Link } from "react-router-dom";
import { SIGN_IN_LINK } from "../../utils/constants";
import Logo from "../../components/logo";

type FieldType = {
  email?: string;
  password?: string;
};

const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
  console.log("Success:", values);
};

const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (errorInfo) => {
  console.log("Failed:", errorInfo);
};

export const Login: React.FC = () => {
  return (
    <div className="form-item-center">
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
            initialValues={{ remember: true }}
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
              <Button type="primary" htmlType="submit" className="default-btn" block>
                Submit
              </Button>
            </Form.Item>
            <Link to={SIGN_IN_LINK} className="main-text"> Don't have an accoun? Register</Link>
          </Form>
      </div>
    </div>
  );
};
