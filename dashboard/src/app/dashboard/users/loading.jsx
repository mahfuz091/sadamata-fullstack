import React from "react";
import { Flex, Spin } from "antd";

const loading = () => {
  return (
    <div className='w-full justify-center items-center h-[100vh] flex loading'>
      <Flex align='center' justify='center' gap='middle'>
        <Spin size='large' style={{ color: "#f37927" }} />
      </Flex>
    </div>
  );
};

export default loading;
