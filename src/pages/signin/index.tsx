import React from "react";
import type { FormProps } from "antd";
import { Button, Flex, Form, Input } from "antd";
import { Link } from "react-router-dom";
import { LOGIN_LINK } from "../../utils/constants";
import Logo from "../../components/logo";

type FieldType = {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  password?: string;
  confirmPassword?: string;
};

const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
  console.log("Success:", values);
};

const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (errorInfo) => {
  console.log("Failed:", errorInfo);
};

export const Register: React.FC = () => {
  return (
    <div className="form-item-center">
      <div className="form-raised">
        <Flex justify="center" align="center">
            <div>
                <Logo nameColor="black"/>
                <br/> <br/>
                <h3>Create an accout with us</h3>
            </div>
        </Flex>
        <br/>
        <Form
          name="register"
          layout="vertical"
          style={{ width: "100%" }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          {/* First Name */}
          <Form.Item<FieldType>
            name="firstName"
            label="First Name"
            rules={[{ required: true, message: "Please enter your first name!" }]}
          >
            <Input autoComplete="off" />
          </Form.Item>

          {/* Last Name */}
          <Form.Item<FieldType>
            name="lastName"
            label="Last Name"
            rules={[{ required: true, message: "Please enter your last name!" }]}
          >
            <Input autoComplete="off" />
          </Form.Item>

          {/* Email */}
          <Form.Item<FieldType>
            name="email"
            label="Email"
            rules={[{ type: "email", required: true, message: "Please enter a valid email!" }]}
          >
            <Input autoComplete="off" />
          </Form.Item>

          {/* Phone Number */}
          <Form.Item<FieldType>
            name="phone"
            label="Phone Number"
            rules={[
              { required: true, message: "Please enter your phone number!" },
              { pattern: /^[0-9]{10}$/, message: "Phone number must be 10 digits!" }
            ]}
          >
            <Input autoComplete="off" />
          </Form.Item>

          {/* Password */}
          <Form.Item<FieldType>
            name="password"
            label="Password"
            rules={[{ required: true, message: "Please enter your password!" }]}
            hasFeedback
          >
            <Input.Password />
          </Form.Item>

          {/* Confirm Password */}
          <Form.Item<FieldType>
            name="confirmPassword"
            label="Confirm Password"
            dependencies={["password"]}
            hasFeedback
            rules={[
              { required: true, message: "Please confirm your password!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Passwords do not match!"));
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>

          {/* Submit Button */}
          <Form.Item>
            <Button type="primary" htmlType="submit" className="default-btn" block>
              Register
            </Button>
          </Form.Item>

          <Link to={LOGIN_LINK} className="main-text"> Have an accoun? login</Link>
        </Form>
      </div>
    </div>
  );
};
