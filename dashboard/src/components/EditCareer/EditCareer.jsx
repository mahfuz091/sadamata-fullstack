// components/Career/EditCareer.jsx
"use client";

import React, { useEffect, useState } from "react";
import { Form, Input, Button, Space, message, Select } from "antd";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

export default function EditCareer({
  initial = null,
  onCancel = () => {},
  onSaved = () => {},
}) {
  const [form] = Form.useForm();
  const isEdit = Boolean(initial && initial.id);
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initial) {
      form.setFieldsValue({
        title: initial.title,
        shortDescription: initial.shortDescription ?? "",
        location: initial.location ?? "",
        jobType: initial.jobType ?? "",
        department: initial.department ?? "",
        experienceLevel: initial.experienceLevel ?? "",
        aboutRole: initial.aboutRole ?? "",
        // new short desc fields
        keyResponsibilitiesShortDesc:
          initial.keyResponsibilitiesShortDesc ?? "",
        requirementsShortDesc: initial.requirementsShortDesc ?? "",
        benefitsShortDesc: initial.benefitsShortDesc ?? "",
        responsibilities: Array.isArray(initial.responsibilities)
          ? initial.responsibilities
          : [],
        requirements: Array.isArray(initial.requirements)
          ? initial.requirements
          : [],
        benefits: Array.isArray(initial.benefits) ? initial.benefits : [],
        applyUrl: initial.applyUrl ?? "",
      });
    } else {
      form.resetFields();
    }
  }, [initial, form]);

  const normalizeString = (v) =>
    v === undefined || v === null ? null : String(v).trim() || null;

  const handleSubmit = async (values) => {
    setSubmitting(true);
    try {
      const payload = {
        title: String(values.title).trim(),
        shortDescription: normalizeString(values.shortDescription),
        location: String(values.location).trim(),
        jobType: normalizeString(values.jobType),
        department: normalizeString(values.department),
        experienceLevel: normalizeString(values.experienceLevel),
        aboutRole: normalizeString(values.aboutRole),
        // short description fields
        keyResponsibilitiesShortDesc: normalizeString(
          values.keyResponsibilitiesShortDesc
        ),
        requirementsShortDesc: normalizeString(values.requirementsShortDesc),
        benefitsShortDesc: normalizeString(values.benefitsShortDesc),
        // list fields (Select mode="tags" already gives arrays)
        responsibilities: Array.isArray(values.responsibilities)
          ? values.responsibilities.map((s) => String(s).trim()).filter(Boolean)
          : [],
        requirements: Array.isArray(values.requirements)
          ? values.requirements.map((s) => String(s).trim()).filter(Boolean)
          : [],
        benefits: Array.isArray(values.benefits)
          ? values.benefits.map((s) => String(s).trim()).filter(Boolean)
          : [],
        applyUrl: normalizeString(values.applyUrl),
      };

      const url = isEdit
        ? `${API_URL}/api/v1/careers/${initial.id}`
        : `${API_URL}/api/v1/careers`;
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        const errMsg = json?.message || json?.error || "Save failed";
        throw new Error(errMsg);
      }

      toast.success(isEdit ? "Role updated" : "Role created");
      onSaved && onSaved(json);
      // navigate back and refresh listing
      router.push("/dashboard/careers");
      // if you need to refresh the destination after navigation:
      try {
        router.refresh();
      } catch (e) {
        /* ignore if refresh not necessary */
      }
    } catch (err) {
      console.error("save error:", err);
      const msg = err?.message || "Failed to save role";
      message.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className='bg-white p-6 rounded shadow'>
      <h3 className='text-lg font-semibold mb-4'>
        {isEdit ? "Edit Role" : "Create Role"}
      </h3>

      <Form form={form} layout='vertical' onFinish={handleSubmit}>
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

        {/* Key responsibilities short intro */}
        <Form.Item
          name='keyResponsibilitiesShortDesc'
          label='Key Responsibilities — Short Description (optional)'
        >
          <Input.TextArea
            rows={2}
            placeholder='Short intro for responsibilities section'
          />
        </Form.Item>

        <Form.Item name='responsibilities' label='Responsibilities (add items)'>
          <Select
            mode='tags'
            style={{ width: "100%" }}
            placeholder='Add responsibilities and press enter'
          />
        </Form.Item>

        {/* Requirements short intro */}
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

        {/* Benefits short intro */}
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
            <Button onClick={onCancel} disabled={submitting}>
              Cancel
            </Button>
            <Button type='primary' htmlType='submit' loading={submitting}>
              {isEdit ? "Save changes" : "Create role"}
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
}
