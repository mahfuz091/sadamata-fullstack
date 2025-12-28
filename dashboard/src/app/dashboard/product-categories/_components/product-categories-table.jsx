"use client";

import React, {
  useMemo,
  useRef,
  useState,
  useCallback,
  useTransition,
} from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button as ShadButton } from "@/components/ui/button";
import {
  Button,
  Table,
  Popconfirm,
  message,
  Space,
  Tag,
  Modal,
  Input,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  MenuOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import {
  deleteProductCategory,
  updateProductCategory,
  reorderProductCategories,
  createProductCategory,
} from "@/app/actions/productCategory.actions"; // <-- server actions
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const DND_TYPE = "ROW";

const DragHandle = () => (
  <MenuOutlined style={{ cursor: "grab", color: "#999" }} />
);

// ✅ AntD row override: must return <tr {...props}> and render children
function DraggableBodyRow(props) {
  const { index, moveRow, className, style, ...restProps } = props;
  const ref = useRef(null);

  const [{ isOver, dropClassName }, drop] = useDrop({
    accept: DND_TYPE,
    collect: (monitor) => {
      const item = monitor.getItem();
      if (!item || item.index === index) return {};
      return {
        isOver: monitor.isOver(),
        dropClassName:
          item.index < index ? " drop-over-downward" : " drop-over-upward",
      };
    },
    drop: (item) => {
      if (item.index !== index) {
        moveRow(item.index, index);
        item.index = index;
      }
    },
  });

  const [, drag] = useDrag({
    type: DND_TYPE,
    item: { index },
  });

  drop(drag(ref));

  return (
    <tr
      ref={ref}
      {...restProps}
      className={`${className || ""}${isOver ? dropClassName : ""}`}
      style={{ cursor: "default", ...style }}
    />
  );
}

export default function ProductCategoriesTable({ initial = [] }) {
  const [categories, setCategories] = useState(initial);
  const [isPending, startTransition] = useTransition();
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

  // const moveRow = useCallback(
  //   (from, to) => {
  //     setCategories((prev) => {
  //       const next = [...prev];
  //       const [removed] = next.splice(from, 1);
  //       next.splice(to, 0, removed);

  //       // ✅ persist in background (no Prisma in client)
  //       persistOrder(next);

  //       return next;
  //     });
  //   },
  //   [persistOrder]
  // );

  const moveRow = useCallback(
    (from, to) => {
      setCategories((prev) => {
        const next = [...prev];
        const [removed] = next.splice(from, 1);
        next.splice(to, 0, removed);

        const orderedIds = next.map((c) => c.id);

        // ✅ defer server action so Router refresh/revalidate can't happen during render
        setTimeout(() => {
          startTransition(async () => {
            const res = await reorderProductCategories(orderedIds);
            if (res?.success) {
              toast.success("Order saved");
            } else if (!res?.success) {
              toast.error(res?.message || "Failed to save order");
            }
          });
        }, 0);

        return next;
      });
    },
    [startTransition]
  );
  const handleRenameSubmit = async () => {
    if (!renameValue.trim()) {
      toast.error("Category name is required");
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
        toast.error(res?.message || "Failed to rename category");
        return;
      }

      toast.success("Category renamed");

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
      toast.error("Something went wrong");
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
      toast.error("Category name is required");
      return;
    }

    setCreating(true);
    try {
      const res = await createProductCategory(newCategory.trim());

      if (!res?.success) {
        toast.error(res?.message || "Failed to create category");
        return;
      }

      toast.success("Category created");

      setCategories((prev) => [res.data, ...prev]);
      setNewCategory("");
      setIsModalOpen(false);
      router.refresh();
    } catch (err) {
      console.error("createProductCategory error:", err);
      toast.error("Something went wrong");
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
        toast.error(res?.message || "Failed to delete category");
        return;
      }

      toast.success("Category deleted");
      setCategories((prev) => prev.filter((c) => c.id !== categoryId));
      router.refresh();
    } catch (err) {
      console.error("deleteProductCategory client error:", err);
      toast.error("Something went wrong");
    } finally {
      setLoadingFor(categoryId, false);
    }
  };
  const columns = useMemo(
    () => [
      {
        title: "",
        dataIndex: "sort",
        key: "sort",
        width: 40,
        render: () => <DragHandle />,
      },
      { title: "Category Name", dataIndex: "name", key: "name" },
      {
        title: "Created At",
        dataIndex: "createdAt",
        key: "createdAt",
        render: (d) => new Date(d).toLocaleDateString("en-GB"),
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
    ],
    []
  );

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
      <DndProvider backend={HTML5Backend}>
        <Table
          rowKey='id'
          dataSource={categories}
          columns={columns}
          pagination={false}
          components={{
            body: {
              row: DraggableBodyRow, // ✅ correct place
            },
          }}
          // ✅ AntD passes index here, we forward moveRow
          onRow={(_, index) => ({
            index,
            moveRow,
          })}
        />
      </DndProvider>

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
