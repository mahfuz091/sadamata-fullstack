"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import { Button as ShadButton } from "@/components/ui/button";
import {
  Table,
  Space,
  Button,
  Popconfirm,
  message,
  Tag,
  Modal,
  Input,
} from "antd";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import {
  createProductCategory,
  deleteProductCategory,
  updateProductCategory,
} from "@/app/actions/productCategory.actions";

export default function ProductCategoriesTable({ initial = [] }) {
  const [categories, setCategories] = useState(initial);
  const [loadingIds, setLoadingIds] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [creating, setCreating] = useState(false);
  const [renameOpen, setRenameOpen] = useState(false);
  const [renameValue, setRenameValue] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [renaming, setRenaming] = useState(false);
  const openRenameDialog = (category) => {
    setSelectedCategory(category);
    setRenameValue(category.name);
    setRenameOpen(true);
  };

  const handleRenameSubmit = async () => {
    if (!renameValue.trim()) {
      message.error("Category name is required");
      return;
    }

    if (renameValue.trim() === selectedCategory.name) {
      setRenameOpen(false);
      return;
    }

    setRenaming(true);
    try {
      const res = await updateProductCategory(
        selectedCategory.id,
        renameValue.trim()
      );

      if (!res?.success) {
        message.error(res?.message || "Failed to rename category");
        return;
      }

      message.success("Category renamed");

      setCategories((prev) =>
        prev.map((c) =>
          c.id === selectedCategory.id ? { ...c, name: renameValue.trim() } : c
        )
      );

      setRenameOpen(false);
      setSelectedCategory(null);
      router.refresh();
    } catch (err) {
      console.error("rename category error:", err);
      message.error("Something went wrong");
    } finally {
      setRenaming(false);
    }
  };

  const router = useRouter();

  const setLoadingFor = (id, val) => {
    setLoadingIds((prev) =>
      val ? [...prev, id] : prev.filter((x) => x !== id)
    );
  };

  /* ----------------------------------------
     ADD CATEGORY
  ---------------------------------------- */

  const handleCreateCategory = async () => {
    if (!newCategory.trim()) {
      message.error("Category name is required");
      return;
    }

    setCreating(true);
    try {
      const res = await createProductCategory(newCategory.trim());

      if (!res?.success) {
        message.error(res?.message || "Failed to create category");
        return;
      }

      message.success("Category created");

      setCategories((prev) => [res.data, ...prev]);
      setNewCategory("");
      setIsModalOpen(false);
      router.refresh();
    } catch (err) {
      console.error("createProductCategory error:", err);
      message.error("Something went wrong");
    } finally {
      setCreating(false);
    }
  };

  /* ----------------------------------------
     DELETE CATEGORY
  ---------------------------------------- */
  const handleDelete = async (categoryId) => {
    setLoadingFor(categoryId, true);
    try {
      const res = await deleteProductCategory(categoryId);

      if (!res?.success) {
        message.error(res?.message || "Failed to delete category");
        return;
      }

      message.success("Category deleted");
      setCategories((prev) => prev.filter((c) => c.id !== categoryId));
      router.refresh();
    } catch (err) {
      console.error("deleteProductCategory client error:", err);
      message.error("Something went wrong");
    } finally {
      setLoadingFor(categoryId, false);
    }
  };

  /* ----------------------------------------
     INLINE UPDATE (OPTIONAL)
  ---------------------------------------- */

  const columns = [
    {
      title: "Category Name",
      dataIndex: "name",
      key: "name",
      render: (name) => <strong>{name}</strong>,
    },
    {
      title: "Category ID",
      dataIndex: "id",
      key: "id",
      render: (id) => <Tag>{id.slice(0, 8)}...</Tag>,
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (createdAt) =>
        new Date(createdAt).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => openRenameDialog(record)}
          >
            Rename
          </Button>

          <Popconfirm
            title='Delete this category?'
            okText='Yes'
            cancelText='No'
            onConfirm={() => handleDelete(record.id)}
            disabled={loadingIds.includes(record.id)}
          >
            <Button
              danger
              icon={<DeleteOutlined />}
              loading={loadingIds.includes(record.id)}
            >
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <div className='flex justify-end mb-4'>
        <Button
          type='primary'
          icon={<PlusOutlined />}
          onClick={() => setIsModalOpen(true)}
          className='bg-[#f29456]! border-[#f29456]! hover:bg-[#f29456]'
        >
          Add Category
        </Button>
      </div>
      <Table
        rowKey='id'
        dataSource={categories}
        columns={columns}
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title='Add New Category'
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleCreateCategory}
        confirmLoading={creating}
        okText='Create'
      >
        <div className='space-y-2'>
          <label className='text-sm font-medium'>Category Name</label>
          <Input
            placeholder='e.g. T-Shirts, Hoodies'
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            onPressEnter={handleCreateCategory}
          />
        </div>
      </Modal>

      <Dialog open={renameOpen} onOpenChange={setRenameOpen}>
        <DialogContent className='sm:max-w-[420px]'>
          <DialogHeader>
            <DialogTitle>Rename Category</DialogTitle>
          </DialogHeader>

          <div className='space-y-2'>
            <label className='text-sm font-medium'>Category Name</label>
            <Input
              value={renameValue}
              onChange={(e) => setRenameValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleRenameSubmit();
              }}
              placeholder='Enter category name'
            />
          </div>

          <DialogFooter>
            <ShadButton
              variant='outline'
              onClick={() => setRenameOpen(false)}
              disabled={renaming}
            >
              Cancel
            </ShadButton>
            <ShadButton onClick={handleRenameSubmit} disabled={renaming}>
              {renaming ? "Updating..." : "Update"}
            </ShadButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
