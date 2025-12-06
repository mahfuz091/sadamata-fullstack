"use client";

import React from "react";
import { Table, Space, Dropdown, Popconfirm } from "antd";
import {
  HeartOutlined,
  MessageOutlined,
  MoreOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { toast } from "sonner";
import { deletePress } from "@/app/actions/press/press.actions";
import { useRouter } from "next/navigation";
import { deletePost } from "@/app/actions/blog/blog.actions";

const BlogTable = ({ allPost }) => {
  const router = useRouter();
  const handleDelete = async (id) => {
    try {
      const res = await deletePost(id);
      if (res.success) {
        toast.success(res.msg);
        // refresh table or filter out deleted post
        router.refresh();
      } else {
        toast.error(res.msg);
      }
    } catch (err) {
      toast.error("Something went wrong while deleting the post");
    }
  };
  const getMenuItems = (record) => [
    {
      key: "edit",
      label: (
        <Link href={`/dashboard/blog/edit-blog/${record.id}`}>
          <EditOutlined className='mr-2 text-blue-600' />
          Edit
        </Link>
      ),
    },
    {
      key: "delete",
      label: (
        <Popconfirm
          title='Are you sure you want to delete this post?'
          onConfirm={() => handleDelete(record.id)}
          okText='Yes'
          cancelText='No'
        >
          <span>
            <DeleteOutlined className='mr-2 text-red-600' />
            Delete
          </span>
        </Popconfirm>
      ),
    },
    // {
    //   key: "view",
    //   label: (
    //     <span>
    //       <EyeOutlined className='mr-2' />
    //       View
    //     </span>
    //   ),
    // },
  ];

  const columns = [
    {
      title: "Author",
      dataIndex: "author",
      key: "author",
      render: (author) => (
        <Space>
          <Avatar className='h-8 w-8 rounded-lg'>
            <AvatarImage src={author?.profileImage} alt='' />
          </Avatar>
          <span>{author.name}</span>
        </Space>
      ),
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (title) => <span className='font-medium'>{title}</span>,
    },

    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) =>
        new Date(date).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
    },
    {
      title: "Comments",
      key: "stats",
      render: (_, record) => (
        <Space>
          <span>
            <MessageOutlined className='mr-1' />
            {record.comments}
          </span>
        </Space>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Dropdown
          menu={{ items: getMenuItems(record) }}
          trigger={["click"]}
          placement='bottomRight'
        >
          <MoreOutlined className='text-xl cursor-pointer' />
        </Dropdown>
      ),
    },
  ];

  return (
    <div className='py-6'>
      <Table
        dataSource={allPost?.postsWithContentObj}
        columns={columns}
        rowKey='id'
        pagination={{
          pageSize: 5,
          showSizeChanger: true,
          pageSizeOptions: ["5", "10", "20"],
        }}
        bordered={false}
      />
    </div>
  );
};

export default BlogTable;
