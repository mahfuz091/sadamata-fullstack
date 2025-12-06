// app/(dashboard)/careers/add-career/page.jsx
"use client";

import React, { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { Form, Input, Button, Space, message, Select } from "antd";
import { toast } from "sonner";

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

export default function AddCareerPage() {
  const [form] = Form.useForm();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const normalizeList = (val) => {
    if (!val) return [];
    if (Array.isArray(val))
      return val.map((s) => String(s).trim()).filter(Boolean);
    // fallback: string -> split by line or comma
    return String(val)
      .split(/\r?\n|,/)
      .map((s) => s.trim())
      .filter(Boolean);
  };

  const handleSubmit = useCallback(
    async (values) => {
      setSubmitting(true);
      try {
        const payload = {
          title: String(values.title).trim(),
          shortDescription: values.shortDescription
            ? String(values.shortDescription).trim()
            : null,
          location: String(values.location).trim(),
          jobType: values.jobType ? String(values.jobType).trim() : null,
          department: values.department
            ? String(values.department).trim()
            : null,
          experienceLevel: values.experienceLevel
            ? String(values.experienceLevel).trim()
            : null,
          aboutRole: values.aboutRole ? String(values.aboutRole).trim() : null,
          // new short description fields
          keyResponsibilitiesShortDesc: values.keyResponsibilitiesShortDesc
            ? String(values.keyResponsibilitiesShortDesc).trim()
            : null,
          requirementsShortDesc: values.requirementsShortDesc
            ? String(values.requirementsShortDesc).trim()
            : null,
          benefitsShortDesc: values.benefitsShortDesc
            ? String(values.benefitsShortDesc).trim()
            : null,
          responsibilities: normalizeList(values.responsibilities),
          requirements: normalizeList(values.requirements),
          benefits: normalizeList(values.benefits),
          applyUrl: values.applyUrl ? String(values.applyUrl).trim() : null,
        };

        const res = await fetch(`${API_URL}/api/v1/careers`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const json = await res.json().catch(() => ({}));

        if (!res.ok) {
          const errMsg =
            json?.message || json?.error || "Failed to create role";
          throw new Error(errMsg);
        }

        toast.success("Role created");
        // optional: reset form or navigate
        router.push("/dashboard/careers");
      } catch (err) {
        console.error("create error:", err);
        const msg = err?.message || "Failed to create role";
        message.error(msg);
      } finally {
        setSubmitting(false);
      }
    },
    [router]
  );

  return (
    <div className='p-6'>
      <h2 className='text-xl font-semibold mb-4'>Add Role</h2>

      <div className='bg-white p-6 rounded shadow'>
        <Form
          form={form}
          layout='vertical'
          onFinish={handleSubmit}
          initialValues={{
            responsibilities: [],
            requirements: [],
            benefits: [],
          }}
        >
          <Form.Item
            name='title'
            label='Title'
            rules={[{ required: true, message: "Title is required" }]}
          >
            <Input placeholder='e.g. Housekeeping Staff' />
          </Form.Item>

          <Form.Item name='shortDescription' label='Short Description'>
            <Input placeholder='One-line description' />
          </Form.Item>

          <Form.Item
            name='location'
            label='Location'
            rules={[{ required: true, message: "Location required" }]}
          >
            <Input placeholder='e.g. Dhaka' />
          </Form.Item>

          <Form.Item name='jobType' label='Job Type'>
            <Input placeholder='Full-Time / Part-Time / On-site' />
          </Form.Item>

          <Form.Item name='department' label='Department'>
            <Input placeholder='e.g. Housekeeping' />
          </Form.Item>

          <Form.Item name='experienceLevel' label='Experience Level'>
            <Input placeholder='Entry / Mid / Senior' />
          </Form.Item>

          <Form.Item name='aboutRole' label='About the Role'>
            <Input.TextArea
              rows={4}
              placeholder='Rich description (HTML/markdown or plain text)'
            />
          </Form.Item>

          {/* New short descriptions for sections */}
          <Form.Item
            name='keyResponsibilitiesShortDesc'
            label='Key Responsibilities — Short Description (optional)'
          >
            <Input.TextArea
              rows={2}
              placeholder='Short intro for responsibilities section'
            />
          </Form.Item>

          <Form.Item
            name='responsibilities'
            label='Responsibilities (add items)'
          >
            <Select
              mode='tags'
              style={{ width: "100%" }}
              placeholder='Add responsibilities and press enter'
            />
          </Form.Item>

          <Form.Item
            name='requirementsShortDesc'
            label='Requirements — Short Description (optional)'
          >
            <Input.TextArea
              rows={2}
              placeholder='Short intro for requirements section'
            />
          </Form.Item>

          <Form.Item name='requirements' label='Requirements (add items)'>
            <Select
              mode='tags'
              style={{ width: "100%" }}
              placeholder='Add requirements and press enter'
            />
          </Form.Item>

          <Form.Item
            name='benefitsShortDesc'
            label='What We Offer — Short Description (optional)'
          >
            <Input.TextArea
              rows={2}
              placeholder='Short intro for benefits section'
            />
          </Form.Item>

          <Form.Item name='benefits' label='Benefits (add items)'>
            <Select
              mode='tags'
              style={{ width: "100%" }}
              placeholder='Add benefits and press enter'
            />
          </Form.Item>

          <Form.Item name='applyUrl' label='Apply URL / mailto:'>
            <Input placeholder='mailto:jobs@example.com or https://...' />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button onClick={() => router.back()} disabled={submitting}>
                Cancel
              </Button>
              <Button type='primary' htmlType='submit' loading={submitting}>
                Create
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
