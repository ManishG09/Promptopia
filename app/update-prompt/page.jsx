"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/router"; // Import from 'next/router' instead of 'next/navigation'
import { useFallback, Suspense } from "react"; // Import from 'react' instead of 'next/navigation'
import Form from "@components/Form";

const UpdatePrompt = () => {
  const router = useRouter();
  const fallbackResult = useFallback();
  const Fallback = fallbackResult.Fallback;
  const promptId = router.query?.id;
  const [post, setPost] = useState({ prompt: "", tag: "" });
  const [submitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const getPromptDetails = async () => {
      const response = await fetch(`/api/prompt/${promptId}`);
      const data = await response.json();
      setPost({
        prompt: data.prompt,
        tag: data.tag,
      });
    };
    if (promptId) getPromptDetails();
  }, [promptId]);

  const updatePrompt = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    if (!promptId) return alert("Missing PromptId!");
    try {
      const response = await fetch(`/api/prompt/${promptId}`, {
        method: "PATCH",
        body: JSON.stringify({
          prompt: post.prompt,
          tag: post.tag,
        }),
      });
      if (response.ok) {
        router.push("/");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Suspense fallback={<Fallback />}>
      <Form
        type="Edit"
        post={post}
        setPost={setPost}
        submitting={submitting}
        handleSubmit={updatePrompt}
      />
    </Suspense>
  );
};

export default UpdatePrompt;
