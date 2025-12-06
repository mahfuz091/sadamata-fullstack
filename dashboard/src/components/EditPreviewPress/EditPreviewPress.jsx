"use client";

import { startTransition, useContext } from "react";

import { ArrowLeft, ArrowUpRight, CircleCheckBig } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";

import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { PressContext } from "@/context/PressContext";
import { pressUpdate } from "@/app/actions/press/press.actions";

const EditSeePress = ({ userId }) => {
  const router = useRouter();
  const { pressData, setPressData } = useContext(PressContext);
  console.log("pressData: Update", pressData);

  if (!pressData) return <p>No blog data available</p>;

  const renderItem = (item) => {
    if (typeof item === "string") return item;

    if (typeof item === "object") {
      if ("content" in item) return item.content;
      if ("text" in item) return item.text;
      return JSON.stringify(item);
    }

    return String(item);
  };

  const renderBlock = (block, index) => {
    if (!block?.type || !block?.data) return null;

    switch (block.type) {
      case "header": {
        const HeaderTag = `h${block.data.level || 2}`;
        return (
          <HeaderTag key={index} className='my-4 font-bold text-black'>
            {block.data.text}
          </HeaderTag>
        );
      }

      case "paragraph":
        return (
          <p key={index} className='my-2 text-gray-800 leading-relaxed'>
            {block.data.text}
          </p>
        );

      case "list": {
        const items = block.data?.items || [];

        if (block.data.style === "ordered") {
          return (
            <ol key={index} className='list-decimal my-2'>
              {items.map((item, i) => (
                <li key={i}>{renderItem(item)}</li>
              ))}
            </ol>
          );
        } else if (block.data.style === "checklist") {
          return (
            <ul key={index} className='my-2'>
              {items.map((item, i) => (
                <li key={i} className='flex items-center gap-2'>
                  <input
                    type='checkbox'
                    checked={item?.meta?.checked ?? false}
                    readOnly
                    className='w-4 h-4'
                  />
                  <span>{renderItem(item)}</span>
                </li>
              ))}
            </ul>
          );
        } else {
          return (
            <ul key={index} className='my-2'>
              {items.map((item, i) => (
                <li key={i} className='flex mt-4 gap-2'>
                  <CircleCheckBig /> {renderItem(item)}
                </li>
              ))}
            </ul>
          );
        }
      }

      case "image":
        return block.data?.file?.url ? (
          <div key={index} className='my-4'>
            <img
              src={block.data.file.url}
              alt={block.data.caption || "Blog Image"}
              className='w-full rounded-md object-cover'
            />
            {block.data.caption && (
              <p className='text-sm text-white mt-2'>{block.data.caption}</p>
            )}
          </div>
        ) : null;

      case "quote":
        return (
          <blockquote
            key={index}
            className='border-l-4 border-gray-300 pl-4 italic my-4'
          >
            {block.data.text}
            {block.data.caption && (
              <cite className='block mt-1'>— {block.data.caption}</cite>
            )}
          </blockquote>
        );

      case "code":
        return (
          <pre
            key={index}
            className='bg-gray-100 rounded p-3 overflow-x-auto my-4 font-mono text-sm'
          >
            {block.data.code}
          </pre>
        );

      case "table":
        return (
          <div key={index} className='overflow-x-auto my-4'>
            <table className='table-auto border-collapse border border-gray-300 w-full'>
              <tbody>
                {block.data?.content?.map((row, rIdx) => (
                  <tr key={rIdx}>
                    {row.map((cell, cIdx) => (
                      <td key={cIdx} className='border border-gray-300 p-2'>
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      default:
        return null;
    }
  };

  // const handlePublish = (e) => {
  //   e.preventDefault();

  //   const formData = {
  //     title: pressData.title,
  //     shortDesc: pressData.shortDesc,
  //     image: pressData.image,
  //     content: JSON.stringify(pressData.content),
  //     blogCategoryId: pressData.categoryId,
  //     authorId: userId,
  //   };

  //   console.log("Publishing blog data:", formData);

  //   setPressData({
  //     title: "",
  //     shortDesc: "",
  //     content: null,
  //     image: "/banner.png",
  //     categories: [],
  //   });
  // };

  const handleUpdate = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("id", pressData.id);
    formData.append("title", pressData.title);
    formData.append("shortDesc", pressData.shortDesc);
    formData.append("bannerImage", pressData.image);
    formData.append("authorId", userId);
    // formData.append("blogCategoryId", pressData.categoryId);

    // Append content blocks as JSON string
    formData.append("content", JSON.stringify(pressData.content));

    startTransition(async () => {
      try {
        const response = await pressUpdate(null, formData);
        console.log("response:", response);

        if (response?.success) {
          toast.success(response.msg);
          router.push("/dashboard");
          setPressData({
            title: "",
            shortDesc: "",
            content: null,
            image: "/banner.png",
            categories: [],
          });
        } else {
          toast.error(response?.msg || "Failed to publish blog");
        }
      } catch (err) {
        console.error("publish error:", err);
        toast.error("Server error while publishing blog");
      }
    });
  };
  return (
    <form
      onSubmit={handleUpdate}
      className='bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-md transition-colors duration-300'
    >
      <input type='hidden' name='title' value={pressData.title} />
      <input type='hidden' name='shortDesc' value={pressData.shortDesc} />
      <input type='hidden' name='image' value={pressData.image} />
      <input
        type='hidden'
        name='content'
        value={JSON.stringify(pressData.content)}
      />
      {pressData.categories?.map((cat, i) => (
        <input key={i} type='hidden' name='categories' value={cat?.id} />
      ))}

      <div className='flex justify-between items-center mb-6'>
        <h3 className='text-xl font-bold'>Preview</h3>
        <Link href={`/dashboard/press/edit-press/${pressData.id}`}>
          <Button type='button' className='w-full'>
            <ArrowLeft /> Back to Edit
          </Button>
        </Link>
      </div>

      {pressData.bannerImage && (
        <img
          src={pressData.bannerImage}
          alt={pressData.title}
          className='w-full h-[400px] object-cover mb-6 border border-white/10 rounded-lg'
        />
      )}

      {pressData.categories?.length > 0 && (
        <div className='flex flex-wrap gap-2 mb-4'>
          {pressData.categories.map((cat, i) => (
            <span key={i} className='blog-card-category'>
              {cat.name}
            </span>
          ))}
        </div>
      )}

      <h1 className='text-3xl font-bold mb-6'>{pressData.title}</h1>

      {pressData.shortDesc && (
        <p className='text-gray-800 mb-4'>{pressData.shortDesc}</p>
      )}

      {pressData.content?.blocks?.map((block, index) =>
        renderBlock(block, index)
      )}

      <div className='mt-6 flex justify-end'>
        <Button type='submit' className='w-full'>
          Publish Now
          <ArrowUpRight />
        </Button>
      </div>
    </form>
  );
};

export default EditSeePress;
